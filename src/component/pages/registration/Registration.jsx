import React, { useContext, useState, useEffect } from "react";
import DefaultButton from "../../UI/button/DefaultButton";
import DefaultInput from "../../UI/input/DefaultInput";
import css from "../Home.module.css";
import { useForm } from "react-hook-form";
import { server } from "../../routers/Routers";
import { LanguageContext } from "../../multilingual/LanguageProvider";
import { WrapperRaceComponent } from "./WrapperRaceComponent";

const Registration = () => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../multilingual/languages/${language}.json`);
  const [dataTemp, setDataTemp] = useState();
  const [isDataTempChanged, setIsDataTempChanged] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleGamePerson = (data) => {
    setDataTemp(data);
  };

  useEffect(() => {
    if (dataTemp !== undefined) {
      setIsDataTempChanged(true);
    }
  }, [dataTemp]);

  const onSubmit = async (data) => {
    const { passwordConfirmation, ...dataUser } = data;
    if (!isDataTempChanged) {
      console.log("DataTemp is not changed");
      return;
    }
    const dataGamePerson = { ...dataUser, ...dataTemp };
    try {
      const res = await fetch(`${server}/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataGamePerson),
      });

      const dataRes = await res.json();
      localStorage.setItem("token", dataRes.token);
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
          <WrapperRaceComponent props={handleGamePerson} />
          <DefaultInput
            customClass="boxShadow"
            type="text"
            placeholder={translations.enterYourName}
            {...register("fullName", {
              required: `${translations.aNameIsRequired}`,
            })}
          />
          <p>{errors.name?.message}</p>
        </div>
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
          <DefaultInput
            customClass="boxShadow"
            type="password"
            placeholder={translations.repeatPassword}
            {...register("passwordConfirmation", {
              required: `${translations.repeatYourPassword}`,
              validate: {
                matchesPassword: (value) =>
                  value === getValues("password") ||
                  `${translations.passwordMismatch}`,
              },
            })}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultButton
            type="submit"
            customClass="loginButton"
            value={translations.register}
          />
        </div>
      </form>
    </>
  );
};

export default Registration;
