import React, { useState, useContext, useEffect } from "react";
import enIcon from "../../img/language/en.png";
import ruIcon from "../../img/language/ru.png";
import uaIcon from "../../img/language/ua.png";
import css from "./LanguageSelect.module.css";
import { LanguageContext } from "./LanguageProvider";
import { getUserLanguageByToken, saveUserLanguage } from "../../lib/userInfo";

export const LanguageSelect = () => {
  const token = localStorage.getItem("token");
  const { language, changeLanguage } = useContext(LanguageContext);
  const translations = require(`./languages/${language}.json`);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language.toUpperCase());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const languages = [
    { id: 1, label: "EN", icon: enIcon },
    { id: 2, label: "RU", icon: ruIcon },
    { id: 3, label: "UA", icon: uaIcon }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const userLanguage = await getUserLanguageByToken(token);
      if (userLanguage) {
        changeLanguage(userLanguage);
        setSelectedLanguage(userLanguage.toUpperCase());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = async (language) => {
    setSelectedLanguage(language.label);
    setIsOpen(false);
    setLoading(true);
    setError(null);
    const success = await saveUserLanguage(token, language.label.toLowerCase());
    setLoading(false);
    if (!success) {
      setError("Не удалось сохранить язык пользователя");
    } else {
      changeLanguage(language.label.toLowerCase());
    }
  };

  return (
    <div>
      {loading ? (
        <p>{translations.loading}</p>
      ) : (
        <div className={css.languageSelect}>
          <div className={css.selectedLanguage} onClick={toggleDropdown}>
            <img src={languages.find((lang) => lang.label === selectedLanguage).icon} alt={selectedLanguage} />
            <span>{selectedLanguage}</span>
          </div>
          {isOpen && (
            <ul className={`${css.languageList} ${isOpen ? css.show : ""}`}>
              {languages.map((lang) => (
                <li key={lang.id} onClick={() => selectLanguage(lang)}>
                  <img src={lang.icon} alt={lang.label} />
                  <span>{lang.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};