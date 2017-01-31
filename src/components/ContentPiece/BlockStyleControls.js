import React from 'react';
import StyleButton from './StyleButton';

const BLOCK_TYPES = [
  {label: 'Title', style: 'header-one'},
  {label: 'Subtitle', style: 'header-two'},
  {label: 'Section title', style: 'header-three'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'Bulleted List', style: 'unordered-list-item'},
  {label: 'Numbered List', style: 'ordered-list-item'},
];

export default (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="sans">
      {BLOCK_TYPES.map((type) =>
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={props.onToggle}
            style={type.style}
          />
      )}
    </div>
  );
};
