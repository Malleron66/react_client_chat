import React, {useState,useEffect}from "react";
import css from "./WrapperGamePage.module.css";
import { WrapperHeadBar } from "./componentHeadBar/WrapperHeadBar";
import { WrapperMyUser } from "./componentMyUser/WrapperMyUser";
import { WrapperChat } from "./componentChat/WrapperChat";

import {getUserInfo} from "../../../lib/userInfo"

export const WrapperGamePage = () => {
  const [userId, setUserId] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userInfo = await getUserInfo(token);
      setUserId(userInfo._id);
      setUserAvatar(userInfo.avatar);
    };
    fetchData();
  }, []);
  
  return (
    <div className={css.container}>
      <div className={css.headBar}>
        <WrapperHeadBar userId={userId}/>
      </div>
      <div className={css.gridContainerTop}>
        <div className={css.gridItem}>
          <WrapperMyUser userAvatar={userAvatar}/>
        </div>
      </div>
      <div className={css.gridContainerBottom}>
        <div className={css.gridItem}>
          <WrapperChat idUser={userId}/>
        </div>
      </div>
    </div>
  );
};
