import React, {  useState, useEffect} from "react";

import css from "./WrapperMyUser.module.css";

const DefaultAvatar = ({ avatarPath }) => {
  return (
      <img src={`/${avatarPath}`} alt="Avatar" />
  );
};

export const WrapperMyUser = ({userAvatar}) => {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    setUserInfo(userAvatar);
  }, [userAvatar]);

  return (
    <div className={css.container}>
      {userInfo && <DefaultAvatar avatarPath={userInfo}/>}
    </div>
  );
};
