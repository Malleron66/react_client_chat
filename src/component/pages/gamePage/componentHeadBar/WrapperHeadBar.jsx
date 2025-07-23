import React, { useContext } from "react";
import css from "./WrapperHeadBar.module.css";
import { IconButton } from "../../../UI/button/IconButton";
import DefaultButton from "../../../UI/button/DefaultButton";
import { LanguageContext } from "../../../multilingual/LanguageProvider";
import { LanguageSelect } from "../../../multilingual/LanguageSelect";

export const WrapperHeadBar = ({ userId, userLanguage }) => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../../multilingual/languages/${language}.json`);
  //PopUp Новостей
  const newsPopUp = () => {
    console.log("News");
  };
  //PopUp Библиотеки
  const libraryPopUp = () => {
    console.log("Library");
  };
  //Настройка пользователя
  const settingsUser = () => {
    console.log("Settings");
  };
  //Выход пользователя с системы
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.replace(`/`);
  };
  return (
    <div className={css.gridContainer}>
      <div className={css.gridLeftItem}>
        <DefaultButton onClick={newsPopUp} value={translations.news} />
        <DefaultButton onClick={libraryPopUp} value={translations.library} />
      </div>
      <div className={css.gridRightItem}>
        <LanguageSelect userId={userId}/>
        <IconButton
          clasS={"iconHeadBar"}
          titleText={translations.settings}
          altText={translations.settings}
          nameIcon={"manage_accounts"}
          onClick={settingsUser}
        />
        <IconButton
          clasS={"iconHeadBar"}
          titleText={translations.exit}
          altText={translations.exit}
          nameIcon={"logout"}
          onClick={logOut}
        />
      </div>
    </div>
  );
};
