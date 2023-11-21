import React from "react";
import css from "./WrapperChat.module.css";
import hrefImgButton from "../../img/img_loader.png";
import DefaultButton from "../UI/button/DefaultButton";
import DefaultInput from "../UI/input/DefaultInput";
import CreateMessage from "./CreateMessage";

export const WrapperChat = () => {
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    // Здесь вы можете обработать выбранные файлы
    console.log(selectedFiles);
  };

  return (
    <>
      <div className={css.chatPage}>
        <div className={css.headChat}>Переписка от кого кому</div>
        <div className={css.wSms}>
          <CreateMessage customClass={"sent"} />
          <CreateMessage customClass={"sent"} />
        </div>
        <div className={css.wrapperImagePreviewContainer}></div>
        <div className={css.wSending}>
          <div className={css.inputConteiner}>
            <DefaultInput customClass="messageInput" />
            <label htmlFor="fileInput">
              <img
                src={hrefImgButton}
                className={css.loaderImgButton}
                alt="Логотип"
                title="Load img"
              />
            </label>
            <DefaultInput
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
          </div>
          <DefaultButton value="Send" />
        </div>
      </div>
    </>
  );
};
