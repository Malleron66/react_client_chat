import React from "react";
import css from './DefaultButton.module.css'

const DefaultButton = ({customClass, ...props}) => {
  const combinedClasses = customClass ? `${css.defaultButton} ${css[customClass]}` : css.defaultButton;

  return (
    <button {...props} className={combinedClasses}>{props.value}</button>
  );
}
export default DefaultButton;