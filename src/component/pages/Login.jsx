import React, { useContext } from "react";
import DefaultInput from "../UI/input/DefaultInput";
import DefaultButton from "../UI/button/DefaultButton";
import { NavLink } from "react-router-dom";
import css from "./Home.module.css";
import { useForm } from "react-hook-form";
import { server } from "../routers/Routers";
import { LanguageContext } from "../multilingual/LanguageProvider";

const Login = () => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../multilingual/languages/${language}.json`);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${server}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataRes = await res.json();
      localStorage.setItem("token", dataRes.token);
      console.log(dataRes);
      if (dataRes.token) {
        window.location.replace(`/user/${dataRes.fullName}`);
      } else {
        console.error("Ошибка аутентификации");
      }
    } catch (error) {
      console.error("Произошла ошибка: " + error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="text"
            placeholder={translations.enterEmail}
            {...register("email", {
              required: `${translations.theEmailFieldIsRequired}`,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: `${translations.incorrectEmailFormat}`,
              },
            })}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="password"
            placeholder={translations.enterPassword}
            {...register("password", {
              required: `${translations.youHaveNotEnteredYourPassword}`,
            })}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultButton
            type="submit"
            customClass="loginButton"
            value={translations.toComeIn}
          />
        </div>
        <div className={css.formGroup}>
          <span>{translations.dontHaveAnAccount}</span>
          <NavLink to="/registration">{translations.registerHere}</NavLink>
        </div>
      </form>
    </>
  );
};
export default Login;
