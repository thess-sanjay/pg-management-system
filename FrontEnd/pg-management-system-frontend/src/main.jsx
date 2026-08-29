import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";


/* =========================================
   LOAD SAVED THEME
========================================= */

const savedSettings =
  localStorage.getItem("pgms-settings");


let darkMode = true;


if (savedSettings) {

  try {

    const parsedSettings =
      JSON.parse(savedSettings);

    darkMode =
      parsedSettings.darkMode ?? true;

  } catch (error) {

    console.error(
      "Failed to load saved theme:",
      error
    );

  }

}


/* =========================================
   APPLY THEME BEFORE APP RENDERS
========================================= */

document.documentElement.classList.toggle(
  "light-theme",
  !darkMode
);


/* =========================================
   RENDER APP
========================================= */

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <BrowserRouter>

      <App />

    </BrowserRouter>

  </StrictMode>

);