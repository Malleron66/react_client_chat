import React from "react";
import DefaultInput from "../UI/input/DefaultInput";
import DefaultButton from "../UI/button/DefaultButton";
import { NavLink } from "react-router-dom";
import css from "./Home.module.css";
import { useForm } from "react-hook-form";

const Login = () => {
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
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataRes = await res.json();
      localStorage.setItem('token', dataRes.token);
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
            placeholder="Введите email"
            {...register("email", {
              required: "Поле email обязательно!",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Неправильный формат email",
              },
            })}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultInput
            customClass="boxShadow"
            type="password"
            placeholder="Введите пароль"
            {...register("password", { required: "Вы не ввели пароль!" })}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div className={css.formGroup}>
          <DefaultButton
            type="submit"
            customClass="loginButton"
            value="Войти"
          />
        </div>
        <div className={css.formGroup}>
          <p>
            Нет аккаунта?
            <NavLink to="/registration">Зарегистрируйтесь здесь</NavLink>
          </p>
        </div>
      </form>
    </>
  );
};
export default Login;
