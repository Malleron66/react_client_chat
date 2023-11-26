import React, { useState, useEffect, useCallback, useRef } from "react";
import css from "./WrapperChat.module.css";
import hrefImgButton from "../../img/img_loader.png";
import DefaultButton from "../UI/button/DefaultButton";
import DefaultInput from "../UI/input/DefaultInput";
import CreateMessage from "./CreateMessage";

export const WrapperChat = () => {
  const [userId, setUserId] = useState(null);
  const [messages, setMessage] = useState([]);
  const [titleMessage, setTitleMessage] = useState("");
  const token = localStorage.getItem("token");
  const smsContainerRef = useRef();

  //Позиция скролла
  useEffect(() => {
    if (smsContainerRef.current) {
      smsContainerRef.current.scrollTop = smsContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //Получение id пользователя по токену
  const getUser = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      });

      const dataRes = await res.json();
      console.log(dataRes)
      return dataRes._id;
    } catch (error) {
      console.error("Произошла ошибка: " + error);
    }
  }, [token]);

  //Получение Всех сообщений с базы (временно)
  const getMessage = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/message", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      });

      const dataRes = await res.json();
      const newMessages = dataRes.map((data) => ({
        id: data._id,
        customClass: userId === data.user ? "sent" : "received",
        valueMessage: data.text,
      }));
      setMessage(newMessages);
    } catch (error) {
      console.error("Произошла ошибка: " + error);
    }
  }, [token, userId]);

  useEffect(() => {
    const fetchData = async () => {
      const id = await getUser();
      setUserId(id);
    };

    fetchData();
  }, [getUser, token]);

  useEffect(() => {
    if (userId !== null) {
      getMessage();
    }
  }, [userId, getMessage, token]);

  //Отправка сообщения + занесение в базу
  const sendMessage = () => {
    if (titleMessage !== "") {
      const newMessage = {
        id: Date.now(),
        customClass: "sent",
        valueMessage: titleMessage,
      };
      const dataMessage = {
        text: titleMessage,
      };
      setMessage([...messages, newMessage]);
      fetch("http://localhost:3000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(dataMessage),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Сервер ответил:", result);
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }

    setTitleMessage("");
  };

  //Загрузка картинок
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    // Здесь вы можете обработать выбранные файлы
    console.log(selectedFiles);
  };

  //Выход пользователя с системы
  const logOut = () =>{
    localStorage.removeItem("token");
    window.location.replace(`/`);
  };
  return (
    <>
      <div className={css.chatPage}>
        <div className={css.headChat}>
          Переписка от кого кому
          <DefaultButton onClick={logOut} value="Exit" />
        </div>
        <div className={css.wSms} ref={smsContainerRef}>
          {messages.map((message) => (
            <CreateMessage
              message={message}
              customClass={message.customClass}
              key={message.id}
            />
          ))}
        </div>
        <div className={css.wrapperImagePreviewContainer}></div>
        <div className={css.wSending}>
          <div className={css.inputConteiner}>
            <DefaultInput
              value={titleMessage}
              type="text"
              onChange={(e) => setTitleMessage(e.target.value)}
              customClass="messageInput"
            />
            <label htmlFor="fileInput">
              <img
                src={hrefImgButton}
                className={css.loaderImgButton}
                alt="Логотип"
                title="Load img"
              />
            </label>
            <DefaultInput
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
          </div>
          <DefaultButton onClick={sendMessage} value="Send" />
        </div>
      </div>
    </>
  );
};
