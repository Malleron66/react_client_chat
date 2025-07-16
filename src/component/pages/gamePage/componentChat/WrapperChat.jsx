import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import css from "./WrapperChat.module.css";
import hrefImgButton from "../../../../img/img_loader.png";
import DefaultButton from "../../../UI/button/DefaultButton";
import DefaultInput from "../../../UI/input/DefaultInput";
import CreateMessage from "./CreateMessage";
import { server } from "../../../routers/Routers";
import { LanguageContext } from "../../../multilingual/LanguageProvider";

export const WrapperChat = ({ idUser }) => {
  const { language } = useContext(LanguageContext);
  const translations = require(`../../../multilingual/languages/${language}.json`);
  const [userId, setUserId] = useState(null);
  const [messages, setMessage] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [idEditing, setIdEditing] = useState("");
  const [titleMessage, setTitleMessage] = useState("");
  const token = localStorage.getItem("token");
  const smsContainerRef = useRef();
  useEffect(() => {
    if (!idUser) {
      setUserId(idUser);
    }
    setUserId(idUser);
  }, [idUser]);
  //Позиция скролла
  useEffect(() => {
    if (smsContainerRef.current) {
      smsContainerRef.current.scrollTop = smsContainerRef.current.scrollHeight;
    }
  }, [messages]);
  //Получение Всех сообщений с базы (временно)
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
        customClass: userId === data.user ? "sent" : "received",
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
  }, [userId, getMessage, token]);

  //Отправка сообщения + занесение в базу
  const sendMessage = () => {
    if (!isEditing) {
      if (titleMessage !== "") {
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
        })
          .then((response) => response.json())
          .catch((error) => {
            console.error("Ошибка:", error);
          });
      }

      setTitleMessage("");
    } else {
      if (titleMessage !== "") {
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
              const messageUpdate = {
                id: dataMessage.idUpdate,
                customClass: "sent",
                valueMessage: titleMessage,
              };
              const updatedMessages = messages.map((m) => {
                if (m.id === idEditing) {
                  return { ...m, ...messageUpdate };
                }
                return m;
              });
              setMessage(updatedMessages);
            }
          })
          .catch((error) => {
            console.error("Ошибка:", error);
          });
        setIdEditing("");
        setTitleMessage("");
        setIsEditing(false);
      } else {
        setIdEditing("");
        setTitleMessage("");
        setIsEditing(false);
      }
    }
  };

  //Загрузка картинок
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    // Здесь вы можете обработать выбранные файлы
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
      <div className={css.chatPage}>
        <div className={css.headChat}>Переписка от кого кому</div>
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
                src={hrefImgButton}
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
            value={isEditing ? `${translations.edit}` : `${translations.send}`}
          />
        </div>
      </div>
    </>
  );
};
