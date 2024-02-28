import React from "react";
import css from "./WrapperGamePage.module.css";
import { WrapperHeadBar } from "./componentHeadBar/WrapperHeadBar";
import { WrapperMyUser } from "./componentMyUser/WrapperMyUser";
import { WrapperGameCanvas } from "./componentGameCanvas/WrapperGameCanvas";
import { WrapperEnemyUser } from "./componentEnemyUser/WrapperEnemyUser";
import { WrapperChat } from "./componentChat/WrapperChat";
import { WrapperGameItem } from "./componentGameItem/WrapperGameItem";
import { WrapperGameMap } from "./componentGameMap/WrapperGameMap";

export const WrapperGamePage = () => {
  return (
    <div className={css.container}>
      <div className={css.headBar}>
        <WrapperHeadBar />
      </div>
      <div className={css.gridContainerTop}>
        <div className={css.gridItem}>
          <WrapperMyUser />
        </div>
        <div className={css.gridItem}>
          <WrapperGameCanvas />
        </div>
        <div className={css.gridItem}>
          <WrapperEnemyUser />
        </div>
      </div>
      <div className={css.gridContainerBottom}>
        <div className={css.gridItem}>
          <WrapperChat />
        </div>
        <div className={css.gridItem}>
          <WrapperGameItem />
        </div>
        <div className={css.gridItem}>
          <WrapperGameMap />
        </div>
      </div>
    </div>
  );
};
