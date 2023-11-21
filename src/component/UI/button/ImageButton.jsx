import React from 'react';

const ImageButton = (props) => {
  return (
    <button onMouseDown={props.onClick}>
      <img src={props.imageUrl} alt={props.altText} title={props.titleText}/>
    </button>
  );
};

export default ImageButton;