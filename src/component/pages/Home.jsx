import React from "react";
import homeLogo from '../../img/logo_home.png';
import css from "./Home.module.css";
import Login from "./Login";
import Registration from "./Registration";
import { NavLink } from "react-router-dom";

export const Home = (props) => {
  //const [pageType, setPageType] = useState('login');
  const pageType = props.pageType;
  
  const getMe = async (token) => {
    try {
      const res = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: { "Content-Type": "application/json",  "authorization": "Bearer "+token},
      });

      const dataRes = await res.json();
      console.log(dataRes);
      if (dataRes._id) {
        window.location.replace(`/user/${dataRes._id}`);
      } 
    } catch (error) {
      console.error("Произошла ошибка: " + error);
    }
  };
  const token = localStorage.getItem('token');
  if(token){
    getMe(token);
  }
  return (
      <>
          <div className={css.homeHead}><NavLink to="/">{props.head}</NavLink></div>
          <div className={css.wrapperContainer}>
            <div className={css.container}>
                <div className={css.formGroup}>
                    <img src={homeLogo} className={css.logoHome} alt="Логотип"/>
                </div>
                <h2>{props.title}</h2>
                {pageType==='login' ? <Login/> : <Registration/>}
            </div>
          </div>
      </>
  );
}
