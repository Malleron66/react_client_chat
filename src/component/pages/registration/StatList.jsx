import React, { useContext, useEffect } from "react";
import css from "./WrapperRaceComponent.module.css";
import { LanguageContext } from "../../multilingual/LanguageProvider";

export const StatList = ({ stats, className, currentRace, currentAvatarVersion, currentGender, onUpdateStats }) => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../multilingual/languages/${language}.json`);

  const defaultValuesByRace = {
    el: {
      strength: 5,
      agility: 10,
      health: 15,
      initiative: 1,
      evasionProtect: 50,
    },
    hm: {
      strength: 15,
      health: 20,
      initiative: 1,
      evasionProtect: 10,
      luckProtect: 10,
      responseProtect: 10,
      criticalProtect: 10,
    },
    gn: {
      strength: 5,
      luck: 10,
      health: 25,
      initiative: 1,
      luckProtect: 50,
    },
    or: {
      strength: 5,
      anger: 10,
      health: 30,
      initiative: 1,
      criticalProtect: 50,
    },
  };

  const updateItemJson = { attributes: {} };
  useEffect(() => {
    onUpdateStats(updateItemJson);
  }, [currentRace, currentAvatarVersion, currentGender]);
  return (
    <>
      {Object.entries(stats).map(([key, value]) => {
        const isStatsOrParameters = key === "stats" || key === "parameters";
        updateItemJson.attributes[key] = {};
        return (
          <React.Fragment key={key}>
            <h2>{translations[key]}</h2>
            <ul key={key} className={className}>
              {Object.entries(value).map(([innerKey, innerValue]) => {
                const defaultValue = defaultValuesByRace[currentRace][innerKey];
                const displayDefault =
                  defaultValue !== undefined
                    ? defaultValue
                    : innerValue.default;
                updateItemJson.attributes[key][innerKey] = displayDefault;
                return (
                  <li key={`${key}-${innerKey}`} className={css.statItem}>
                    {innerValue.value}:{" "}
                    <span>
                      {isStatsOrParameters
                        ? displayDefault
                        : `${displayDefault}%`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </>
  );
};
