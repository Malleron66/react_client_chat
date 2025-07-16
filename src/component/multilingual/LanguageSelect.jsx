import React, { useState, useContext, useEffect } from "react";
import css from "./LanguageSelect.module.css";
import { LanguageContext } from "./LanguageProvider";
import { saveUserLanguage } from "../../lib/userInfo";

export const LanguageSelect = ({ userId }) => {
  const token = localStorage.getItem("token");
  const { language, changeLanguage } = useContext(LanguageContext);
  const translations = require(`../multilingual/languages/${language}.json`);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    language.toUpperCase()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const languages = [
    { id: 1, label: "EN", icon: "/img/language/en.png" },
    { id: 2, label: "RU", icon: "/img/language/ru.png" },
    { id: 3, label: "UA", icon: "/img/language/ua.png" },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (language) {
      changeLanguage(language);
      setSelectedLanguage(language.toUpperCase());
    }
    setLoading(false);
  }, [language, changeLanguage]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = async (language) => {
    setSelectedLanguage(language.label);
    setIsOpen(false);
    setLoading(true);
    setError(null);
    const success = await saveUserLanguage(
      userId,
      token,
      language.label.toLowerCase()
    );
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
            <img
              src={
                languages.find((lang) => lang.label === selectedLanguage).icon
              }
              alt={selectedLanguage}
            />
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
