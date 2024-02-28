import React from "react";
import css from "./IconButton.module.css";

export const IconButton = (props) => {
    const customClass = "material-icons";
    const combinedClasses = customClass + ` ${css[props.clasS]}`;
  return (
    <button onMouseDown={props.onClick}>
      <span alt={props.altText} title={props.titleText} className={combinedClasses}>{props.nameIcon}</span>
    </button>
  );
};
