import React, { useEffect } from "react";

import css from "./Home.module.css";
import Login from "./Login";
import Registration from "./registration/Registration";
import { NavLink } from "react-router-dom";
import { server } from "../routers/Routers"

export const Home = (props) => {
  const pageType = props.pageType;
  const token = localStorage.getItem("token");
  const homeLogo = "/img/logo_home.png";
  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      if (token) {
        try {
          const res = await fetch(`${server}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + token,
            },
          });

          const dataRes = await res.json();
          console.log(dataRes);
          if (dataRes.fullName) {
            window.location.replace(`/user/${encodeURIComponent(dataRes.fullName)}`);
          }
        } catch (error) {
          console.error("Произошла ошибка: " + error);
        }
      }
    };

    checkTokenAndNavigate();
  }, [token]);
  return (
    <>
      <div className={css.homeHead}>
        <NavLink to="/">{props.head}</NavLink>
      </div>
      <div className={css.wrapperContainer}>
        <div className={css.container}>
          <div className={css.formGroup}>
            <img src={homeLogo} className={css.logoHome} alt="Логотип" />
          </div>
          <h2>{props.title}</h2>
          {pageType === "login" ? <Login /> : <Registration />}
        </div>
      </div>
    </>
  );
};
