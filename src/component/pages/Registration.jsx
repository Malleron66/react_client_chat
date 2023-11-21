import React from "react";
import DefaultButton from "../UI/button/DefaultButton";
import DefaultInput from "../UI/input/DefaultInput";
import css from "./Home.module.css";
import { useForm } from "react-hook-form";

const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    mode: 'onBlur',
    defaultValues:{
      fullName:'',
      email:'',
      password:'',
      passwordConfirmation:'',
    }
  });

  const onSubmit = async (data) => {
    const { passwordConfirmation, ...dataUser } = data;
    try {
      const res = await fetch("http://localhost:3000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUser),
      });

      const dataRes = await res.json();
      localStorage.setItem('token', dataRes.token);
      console.log(dataRes);
      if (dataRes.token) {

        window.location.replace(`/chat`);
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
            placeholder="Введите Ваше имя"
            {...register("fullName", {required: 'Имя обязательно!'})}
          />
          <p>{errors.name?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="text"
            placeholder="Введите email"
            {...register("email", {required: 'Поле email обязательно!',pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Неправильный формат email',
            }})}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="password"
            placeholder="Введите пароль"
            {...register("password", {required: 'Вы не ввели пароль!'})}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="password"
            placeholder="Повторите пароль"
            {...register("passwordConfirmation", {required: 'Повторите Ваш пароль!', validate: {
              matchesPassword: (value) => value === getValues("password") || "Пароли не совпадают"
            } })}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultButton
            type="submit"
            customClass="loginButton"
            value="Зарегестрироваться"
          />
        </div>
      </form>
    </>
  );
};

export default Registration;
