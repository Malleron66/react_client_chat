import React, { createContext, useState, useEffect} from 'react';
import {getUserLanguageByToken} from "../../lib/userInfo";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const changeLanguage = newLanguage => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserLanguageByToken(token)
        .then(userLanguage => {
          if (userLanguage) {
            setLanguage(userLanguage);
          }
        })
        .catch(error => {
          console.error('Ошибка при получении языка пользователя:', error);
        });
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};