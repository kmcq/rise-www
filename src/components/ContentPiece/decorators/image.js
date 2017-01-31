import React from 'react';
import { Entity } from 'draft-js';

function strategy(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null && Entity.get(entityKey).getType() === 'IMAGE'
      );
    },
    callback
  );
}


const component = ({decoratedText}) => {
  return (
    // Might be good to query firebase for alt prop here somehow
    <div className="ContentPiece-image-container">
      <img
        className="ContentPiece-image"
        role="presentation"
        src={decoratedText}
      />
    </div>
  );
};

export default {
  component,
  strategy
};
