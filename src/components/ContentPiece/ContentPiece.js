import React, { Component } from 'react';
import startCase from 'lodash/startCase';
import { CompositeDecorator, EditorState, convertFromRaw } from 'draft-js';
import Editor from './Editor';
import decorators from './decorators';
import FirebaseContainer from '../FirebaseContainer';
import ContentNav from '../ContentNav';

const NEWS = 'news';
const BLOG_LINK = {
  root: true,
  name: 'Blog',
  path: '/blog'
};

class ContentPiece extends Component {
  navLinks() {
    const posts = this.props.posts.valueSeq();
    if (!posts.size) return [];
    const links = posts.map((post) => ({
      indexLevels: post.slug === posts.first().slug ? [1] : undefined,
      name: post.title,
      path: `/${post.slug}`
    })).toJS();
    return this.props.category === NEWS ? links.concat(BLOG_LINK) : links;
  }

  toEditorState(content) {
    const decorator = new CompositeDecorator(decorators);

    if (!content._immutable) {
      return EditorState.createWithContent(
        // Ensure that entityMap is in the object
        convertFromRaw({ entityMap: {}, ...content }),
        decorator
      );
    }
    return content;
  }

  render() {
    const databaseAccessPoint = `posts/${this.props.category}`;
    return (
      <div className="container">
        <FirebaseContainer dataType={databaseAccessPoint}>
          <div className="ContentPiece">
            {this.props.post &&
              <div className={`ContentPiece-content ${this.props.category}`}>
                <Editor
                  editorState={this.toEditorState(this.props.post.editorState)}
                  databaseAccessPoint={databaseAccessPoint}
                  readOnly={!this.props.post.editing}
                  onCancel={this.props.onCancel}
                  onChange={this.props.onChange}
                  onSave={() => this.props.onSave(databaseAccessPoint, this.props.post)}
                  post={this.props.post}
                  signedIn={this.props.signedIn}
                />
              </div>
            }
            {this.props.post && !this.props.post.editing &&
              <ContentNav
                links={this.navLinks()}
                relativePath={`/${this.props.category}`}
                sectionTitle={startCase(this.props.category)}
              />
            }
          </div>
        </FirebaseContainer>
      </div>
    );
  }
}

export default ContentPiece;
