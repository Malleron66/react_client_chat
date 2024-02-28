import React, { useState } from "react";
import css from "./CreateMessage.module.css";
import redactButtonImg from "../../../../img/icon/redact.png";
import delButtonImg from "../../../../img/icon/del.png";
import ImageButton from "../../../UI/button/ImageButton";

const CreateMessage = ({
  customClass,
  deleteCallback,
  editingCallback,
  ...props
}) => {
  const combinedClasses = customClass
    ? `${css.smsText} ${css[customClass]}`
    : css.smsText;
  const clickClass = combinedClasses + ` ${css.block}`;
  const bluerClass = combinedClasses;

  const [isBlockClassActive, setIsBlockClassActive] = useState(false);
  const clickMessage = () => {
    setIsBlockClassActive(true);
  };
  const blurMessage = () => {
    setIsBlockClassActive(false);
  };

  if (customClass === "received") {
    return (
      <div
        {...props}
        tabIndex={0}
        className={combinedClasses}
      >
        <span className={css.textContent}>
          <span>{props.message.valueMessage}</span>
        </span>
      </div>
    );
  }
  

  return (
    <div
      {...props}
      tabIndex={0}
      className={isBlockClassActive ? clickClass : bluerClass}
      onClick={clickMessage}
      onBlur={blurMessage}
    >
      <span className={css.textContent}>
        <span>{props.message.valueMessage}</span>
      </span>
      <div className={css.wIcon}>
        <span>
          <ImageButton
            imageUrl={redactButtonImg}
            altText={"Editing"}
            onClick={() => editingCallback(props.message)}
            titleText={"Editing"}
          />
        </span>
        <span>
          <ImageButton
            imageUrl={delButtonImg}
            altText={"Delete"}
            onClick={() => deleteCallback(props.message)}
            titleText={"Delete"}
          />
        </span>
      </div>
    </div>
  );
};
export default CreateMessage;
