import { server } from "../component/routers/Routers";

export const getUserInfo = async (token) => {
  try {
    const res = await fetch(`${server}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });

    const dataRes = await res.json();
    return dataRes;
  } catch (error) {
    console.error("Произошла ошибка: " + error);
  }
};
export const getUserLanguageByToken = async (token) => {
  try {
    const res = await fetch(`${server}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    });

    const dataRes = await res.json();
    return dataRes.language;
  } catch (error) {
    console.error("Произошла ошибка: " + error);
  }
};
export const saveUserLanguage = async (userId, token, language) => {
  try {
    if (!userId) {
      throw new Error("Пользователь не найден");
    }

    const res = await fetch(`${server}/save-language`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ userId, language }),
    });

    const dataRes = await res.json();
    return dataRes.success;
  } catch (error) {
    console.error("Произошла ошибка: " + error);
    return false;
  }
};
