import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import css from "./WrapperChat.module.css";
import DefaultButton from "../../../UI/button/DefaultButton";
import DefaultInput from "../../../UI/input/DefaultInput";
import CreateMessage from "./CreateMessage";
import { server } from "../../../routers/Routers";
import { LanguageContext } from "../../../multilingual/LanguageProvider";

export const WrapperChat = ({ idUser }) => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../../multilingual/languages/${language}.json`);

  const [isOpenChat, setIsOpenChat] = useState(false);
  const [userId, setUserId] = useState(null);
  const [messages, setMessage] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [idEditing, setIdEditing] = useState("");
  const [titleMessage, setTitleMessage] = useState("");

  const token = localStorage.getItem("token");
  const smsContainerRef = useRef();

  useEffect(() => {
    setUserId(idUser);
  }, [idUser]);

  useEffect(() => {
    if (smsContainerRef.current) {
      smsContainerRef.current.scrollTop = smsContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessage = useCallback(async () => {
    try {
      const res = await fetch(`${server}/message`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      });

      const dataRes = await res.json();
      const newMessages = dataRes.map((data) => ({
  id: data.id,
  customClass: userId === data.user
    ? data.sender === "assistant"
      ? "received" 
      : "sent"     // Ты отправил
    : "received",  // От assistant
  valueMessage: data.text,
}));
      setMessage(newMessages);
    } catch (error) {
      console.error("Произошла ошибка: " + error);
    }
  }, [token, userId]);

  useEffect(() => {
    if (userId !== null) {
      getMessage();
    }
  }, [userId, getMessage]);

  const sendMessage = () => {
    if (titleMessage.trim() === "") return;

    if (!isEditing) {
      const newMessage = {
        id: Date.now(),
        customClass: "sent",
        valueMessage: titleMessage,
      };

      const dataMessage = {
        id: newMessage.id,
        text: titleMessage,
      };

      setMessage([...messages, newMessage]);

      fetch(`${server}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(dataMessage),
      }).catch((error) => {
        console.error("Ошибка:", error);
      });

      setTitleMessage("");
    } else {
      const dataMessage = {
        id: idEditing,
        idUpdate: Date.now(),
        text: titleMessage,
      };

      fetch(`${server}/message`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(dataMessage),
      })
        .then((response) => response.json())
        .then((result) => {
          if (!result.error) {
            const updatedMessages = messages.map((m) =>
              m.id === idEditing
                ? { ...m, id: dataMessage.idUpdate, valueMessage: titleMessage }
                : m
            );
            setMessage(updatedMessages);
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });

      setIdEditing("");
      setTitleMessage("");
      setIsEditing(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    console.log(selectedFiles);
  };

  const deleteCallback = (message) => {
    fetch(`${server}/message`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ id: message.id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          const newMessages = messages.filter((m) => m.id !== message.id);
          setMessage(newMessages);
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
      });
  };

  const editingCallback = (message) => {
    setTitleMessage(message.valueMessage);
    setIdEditing(message.id);
    setIsEditing(true);
  };

  return (
    <>
      {/* Чат как всплывающее окно */}
      <div
        className={`${css.chatPage} ${
          isOpenChat ? css.chatOpened : css.chatClosed
        }`}
        style={{
          backgroundImage: `url('/img/chat/fon_chat/fon1.jpg')`,
        }}
      >
        <div className={css.headChat}>Переписка от кого кому<button
    style={{
      marginLeft: 16,
      padding: "4px 12px",
      background: "#516693",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: "pointer"
    }}
    onClick={async () => {
      if (!titleMessage.trim()) return;
      // Добавляем сообщение пользователя
      const userMsg = {
        id: Date.now(),
        customClass: "sent",
        valueMessage: titleMessage,
      };
      setMessage((prev) => [...prev, userMsg]);
      setTitleMessage("");

      // Запрос к серверу для получения ответа Квин
      try {
        const res = await fetch(`${server}/ai/assistant`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({ question: titleMessage }),
        });
        const data = await res.json();
        if (data.answer) {
          setMessage((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              customClass: "received",
              valueMessage: data.answer,
            },
          ]);
        }
      } catch (e) {
        setMessage((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            customClass: "received",
            valueMessage: "Ошибка получения ответа от Квин.",
          },
        ]);
      }
    }}
  >
    Спросить у Квин
  </button></div>

        <div className={css.wSms} ref={smsContainerRef}>
          {messages.map((message) => (
            <CreateMessage
              deleteCallback={deleteCallback}
              editingCallback={editingCallback}
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
                src="/img/chat/img_loader.png"
                className={css.loaderImgButton}
                alt={translations.loadImg}
                title={translations.loadImg}
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

          <DefaultButton
            onClick={sendMessage}
            value={isEditing ? translations.edit : translations.send}
          />
        </div>
      </div>

      {/* Кнопка открытия чата */}
      <div
        className={css.chatToggleBtn}
        style={{ backgroundImage: `url('/img/chat/chat_icon.png')` }}
        onClick={() => setIsOpenChat((prev) => !prev)}
      />
    </>
  );
};

