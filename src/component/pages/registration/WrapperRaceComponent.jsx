import React, { useState, useContext } from "react";
import css from "./WrapperRaceComponent.module.css";
import { LanguageContext } from "../../multilingual/LanguageProvider";
import { StatList } from "./StatList";

const avatarRace = [
  {
    id: 1,
    race: "hm",
    gender: "man",
    avatar: { v1: "hmM1", v2: "hmM2", v3: "hmM3" },
  },
  {
    id: 2,
    race: "hm",
    gender: "woman",
    avatar: { v1: "hmW1", v2: "hmW2", v3: "hmW3" },
  },
  {
    id: 3,
    race: "el",
    gender: "man",
    avatar: { v1: "elM1", v2: "elM2", v3: "elM3" },
  },
  {
    id: 4,
    race: "el",
    gender: "woman",
    avatar: { v1: "elW1", v2: "elW2", v3: "elW3" },
  },
  {
    id: 5,
    race: "gn",
    gender: "man",
    avatar: { v1: "gnM1", v2: "gnM2", v3: "gnM3" },
  },
  {
    id: 6,
    race: "gn",
    gender: "woman",
    avatar: { v1: "gnW1", v2: "gnW2", v3: "gnW3" },
  },
  {
    id: 7,
    race: "or",
    gender: "man",
    avatar: { v1: "orM1", v2: "orM2", v3: "orM3" },
  },
  {
    id: 8,
    race: "or",
    gender: "woman",
    avatar: { v1: "orW1", v2: "orW2", v3: "orW3" },
  },
];
const AvatarComponent = ({ race, gender, avatar }) => {
  return (
      <img
        src={`/img/raceAvatar/${race}/${gender}/${avatar}.png`}
        alt="Avatar"
      />

  );
};

export const WrapperRaceComponent = ({ props }) => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../multilingual/languages/${language}.json`);
  

  const statPerson = {
    stats: {
      strength: {
        value: `${translations.statPerson.stats.strength}`,
        default: 0,
      },
      agility: {
        value: `${translations.statPerson.stats.agility}`,
        default: 0,
      },
      luck: { value: `${translations.statPerson.stats.luck}`, default: 0 },
      reaction: {
        value: `${translations.statPerson.stats.reaction}`,
        default: 0,
      },
      anger: { value: `${translations.statPerson.stats.anger}`, default: 0 },
    },
    parameters: {
      health: {
        value: `${translations.statPerson.parameters.health}`,
        default: 0,
      },
      mana: { value: `${translations.statPerson.parameters.mana}`, default: 0 },
      initiative: {
        value: `${translations.statPerson.parameters.initiative}`,
        default: 0,
      },
    },
    mastery: {
      defenseMastery: {
        value: `${translations.statPerson.mastery.defenseMastery}`,
        default: 0,
      },
      weaponMastery: {
        value: `${translations.statPerson.mastery.weaponMastery}`,
        default: 0,
      },
      unarmedCombat: {
        value: `${translations.statPerson.mastery.unarmedCombat}`,
        default: 0,
      },
    },
    protect: {
      evasionProtect: {
        value: `${translations.statPerson.protect.evasionProtect}`,
        default: 0,
      },
      luckProtect: {
        value: `${translations.statPerson.protect.luckProtect}`,
        default: 0,
      },
      responseProtect: {
        value: `${translations.statPerson.protect.responseProtect}`,
        default: 0,
      },
      criticalProtect: {
        value: `${translations.statPerson.protect.criticalProtect}`,
        default: 0,
      },
    },
    antiProtect: {
      evasionAntiProtect: {
        value: `${translations.statPerson.antiProtect.evasionAntiProtect}`,
        default: 0,
      },
      luckAntiProtect: {
        value: `${translations.statPerson.antiProtect.luckAntiProtect}`,
        default: 0,
      },
      responseAntiProtect: {
        value: `${translations.statPerson.antiProtect.responseAntiProtect}`,
        default: 0,
      },
      criticalAntiProtect: {
        value: `${translations.statPerson.antiProtect.criticalAntiProtect}`,
        default: 0,
      },
    },
  };

  const [currentGender, setCurrentGender] = useState("man");
  const [currentAvatarVersion, setCurrentAvatarVersion] = useState("v1");
  const [currentRace, setCurrentRace] = useState("hm");

  const currentAvatar = avatarRace.find(
    (avatar) => avatar.gender === currentGender && avatar.race === currentRace
  ).avatar;

  const handleGender = (nextGender) => {
    setCurrentGender(nextGender);
  };

  const handleChangeAvatarVersion = (version) => {
    setCurrentAvatarVersion(version);
  };

  const handleChangeRace = (race) => {
    setCurrentRace(race);
  };


  const handleUpdateStats = (updatedStats) => {
    updatedStats.avatar = `img/raceAvatar/${currentRace}/${currentGender}/${currentAvatar[currentAvatarVersion]}.png`;
    updatedStats.race = currentRace;
    updatedStats.gender = currentGender;
    props(updatedStats);
  };

  return (
    <div className={css.wrapperRace}>
      <div className={css.wrapperRaceInfo}>
        <div className={css.wrapperAvatar}>
          <div className={css.avatar}>
            <AvatarComponent
              race={currentRace}
              gender={currentGender}
              avatar={currentAvatar[currentAvatarVersion]}
            />
          </div>
          <div className={css.buttonGender}>
            <button
              onClick={() => handleGender("man")}
              className={
                currentGender === "man" ? `${css.man} ${css.activ}` : css.man
              }
            >
              <span className="material-icons">male</span>
            </button>
            <button
              onClick={() => handleGender("woman")}
              className={
                currentGender === "woman"
                  ? `${css.woman} ${css.activ}`
                  : css.woman
              }
            >
              <span className="material-icons">female</span>
            </button>
          </div>
          <div className={css.versionAvatar}>
            {Object.keys(currentAvatar).map((version) => (
              <button
                key={version}
                onClick={() => handleChangeAvatarVersion(version)}
                className={version === currentAvatarVersion ? css.activ : ""}
              >
                {`${translations.variant} ${version.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
        <div className={css.wrapperStat}>
          <StatList
            stats={statPerson}
            className={css.statList}
            currentRace={currentRace}
            currentGender={currentGender}
            currentAvatarVersion={currentAvatarVersion}
            onUpdateStats={handleUpdateStats}
          />
        </div>
        <div className={css.wrapperDescription}>Описание</div>
      </div>
      <div className={css.wrapperRaceSelect}>
        <button
          onClick={() => handleChangeRace("hm")}
          className={currentRace === "hm" ? css.activ : ""}
        >
          {translations.humans}
        </button>
        <button
          onClick={() => handleChangeRace("el")}
          className={currentRace === "el" ? css.activ : ""}
        >
          {translations.elves}
        </button>
        <button
          onClick={() => handleChangeRace("gn")}
          className={currentRace === "gn" ? css.activ : ""}
        >
          {translations.dwarfs}
        </button>
        <button
          onClick={() => handleChangeRace("or")}
          className={currentRace === "or" ? css.activ : ""}
        >
          {translations.orcs}
        </button>
      </div>
    </div>
  );
};
