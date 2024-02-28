import React from "react";
import ReactDOM from "react-dom/client";
import { IndexRout } from "./component/routers/IndexRout";
import "./styles/default.css";
import { LanguageProvider } from "./component/multilingual/LanguageProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <IndexRout />
  </LanguageProvider>
);
