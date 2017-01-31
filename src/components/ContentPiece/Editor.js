import React from 'react';
import Link from 'react-router/lib/Link';
import elementClass from 'element-class';
import {Editor, EditorState, Entity, Modifier, RichUtils} from 'draft-js';
import ContentMedia from '../ContentMedia';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import LinkControl from './LinkControl';

const EDITING_BODY_CLASS = 'overflow-hidden';

class NWFCEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlValue: ''
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState, extras = {}) => this._onChange(editorState, extras);
    this.onSave = () => this._onSave();
    this.stopEditing = () => this._stopEditing();
    this.togglePublishedStateText = () => this._togglePublishedState();

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.addImage = this._addImage.bind(this);
    this.addLink = this._addLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.readOnly) {
      elementClass(document.body).remove(EDITING_BODY_CLASS);
    } else {
      elementClass(document.body).add(EDITING_BODY_CLASS);
    }
  }

  componentWillUnmount() {
    elementClass(document.body).remove(EDITING_BODY_CLASS);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _addImage(src) {
    const editorState = this.props.editorState;
    const key = Entity.create('IMAGE', 'IMMUTABLE', { src });
    const contentStateWithEntity = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      src,
      null,
      key
    );
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity }
    );
    this.onChange(newEditorState);
  }

  _addLink(link) {
    const editorState = this.props.editorState;
    const url = link || this.state.urlValue;
    const key = url ? Entity.create('LINK', 'MUTABLE', { url }) : null;
    const contentStateWithEntity = Modifier.applyEntity(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      key
    );
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity }
    );
    this.onChange(newEditorState);
  }

  _onChange(editorState, extras) {
    const nextPostState = {
      ...this.props.post,
      editorState,
      ...extras
    };
    const title = editorState
      .getCurrentContent()
      .getBlockMap()
      .find(b => b.type === 'header-one');
    if (title) {
      nextPostState.title = title.getText() || 'no title';
    }
    this.props.onChange(this.props.databaseAccessPoint, nextPostState, this.props.post.slug);
  }

  _onSave() {
    this.stopEditing();
    this.props.onSave();
  }

  _onTab(e) {
    e.preventDefault();
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.props.editorState, maxDepth));
  }

  _stopEditing() {
    this.onChange(this.props.editorState, { editing: false });
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.props.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.props.editorState,
        inlineStyle
      )
    );
  }

  _togglePublishedState() {
    this.onChange(this.props.editorState, { published: !this.props.post.published });
  }

  _getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'Editor-blockquote';
      case 'header-one': return 'center primary-foreground';
      case 'header-two': return 'center';
      case 'header-three': return 'center callout Editor-section-title';
      // .pseudoParagraph handles the restriction that we can't actually use a p
      // tag here, since div's in p's is not valid HTML
      case 'unstyled': return 'pseudoParagraph';
      default: return null;
    }
  }

  renderEditor() {
    const {editorState, readOnly} = this.props;
    return (
      <Editor
        blockStyleFn={this._getBlockStyle}
        editorState={editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
        onTab={this.onTab}
        readOnly={readOnly}
        ref="editor"
        spellCheck
      />
    );
  }

  renderPersistenceControls() {
    const publishedState = this.props.post.published ? 'PUBLISHED' : 'UNPUBLISHED';
    const togglePublishedStateText = publishedState === 'PUBLISHED' ? 'Unpublish' : 'Publish';
    return (
      <div className="Editor-persist-control">
        <div>
          This post is currently <span className="callout">{publishedState}.</span>
        </div>
        <div>
          <span
            className="Editor-persist-control-item"
            onClick={() => this.togglePublishedStateText()}
          >
            {togglePublishedStateText}
          </span>
          <span
            className="Editor-persist-control-item"
            onClick={() => this.onSave()}
          >
            Save
          </span>
          <span
            className="Editor-persist-control-item"
            onClick={() => this.stopEditing()}
          >
            Cancel
          </span>
        </div>
      </div>
    );
  }

  renderStyleControls() {
    return (
      <div className="Editor-text-controls">
        <BlockStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={this.props.editorState}
          onToggle={this.toggleInlineStyle}
        />
        <LinkControl
          addLink={() => this.addLink()}
          onChange={(e) => this.setState({ urlValue: e.target.value })}
          value={this.state.urlValue}
        />
      </div>
    );
  }

  render() {
    const {databaseAccessPoint, editorState, post, readOnly} = this.props;
    if (readOnly) {
      return (
        <div className="readable">
          {this.props.signedIn &&
            <Link
              className="Editor-edit-button"
              onClick={() => {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                this.onChange(editorState, { editing: true })
              }}
              to={`/${databaseAccessPoint.replace('posts/', '')}/${post.slug}`}
            >
              Edit
            </Link>
          }
          {this.renderEditor()}
        </div>
      );
    }

    return (
      <div>
        <div className="Editor-controls">
          {this.renderPersistenceControls()}
          {this.renderStyleControls()}
          <ContentMedia
            addImage={(imageUrl) => this.addImage(imageUrl)}
            addPDF={(pdfUrl) => this.addLink(pdfUrl)}
          />
        </div>
        <div className="Editor-editing-container readable">
          <div className="Editor-editor" onClick={this.focus}>
            {this.renderEditor()}
          </div>
        </div>
      </div>
    );
  }
}

export default NWFCEditor;
