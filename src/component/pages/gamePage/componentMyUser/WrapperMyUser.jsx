import React, { useContext, useState, useEffect, Suspense } from "react";
import { LanguageContext } from "../../../multilingual/LanguageProvider";
import css from "./WrapperMyUser.module.css";
import { getUserInfo } from "../../../../lib/userInfo";

const DefaultAvatar = ({ avatarPath }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <img src={require(`../../../../${avatarPath}`)} alt="Avatar" />
    </Suspense>
  );
};

export const WrapperMyUser = () => {
  const token = localStorage.getItem("token");
  const { language } = useContext(LanguageContext);
  const translations = require(`../../../multilingual/languages/${language}.json`);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo(token);
      const userAva = user.avatar;
      setUserInfo(userAva);
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className={css.container}>
      <p>WrapperMyUser</p>
      <p>{userInfo}</p>
      {userInfo && <DefaultAvatar avatarPath={userInfo}/>}
    </div>
  );
};
