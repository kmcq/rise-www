import React from 'react';

const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/;

function getYouTubeID(url) {
  let result = '';
  if (url) {
    const match = url.match(regex);
    if (match && match[7] && match[7].length === 11) result = match[7];
  }
  return result;
}

const strategy = (contentBlock, callback) => {
  const text = contentBlock.getText();
  if (getYouTubeID(text).length === 11)
  {
    const matchArr = regex.exec(text);
    if (matchArr !== null) {
      const start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }
} 

// Needs the empty span tag at the end in order to delete properly
const component = ({decoratedText}) => {
  const id = getYouTubeID(decoratedText);
  return (
    <div className="Youtube-wrapper">
      <iframe id={`yt-${id}`} className="Youtube-iframe"
        src={`https://www.youtube.com/embed/${id}?autoplay=0`}
        type='text/html' frameBorder='0'
      />
      <span> </span>
    </div>
  );
};

export default {
  component,
  strategy
};
