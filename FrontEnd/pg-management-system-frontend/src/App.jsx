import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Rent from "./pages/Rent";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect } from "react";

import "./App.css";


function App() {

  useEffect(() => {

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
          "Failed to load theme settings:",
          error
        );

      }

    }

    if (darkMode) {

      document.body.classList.add("dark-mode");

      document.body.classList.remove(
        "light-mode"
      );

    } else {

      document.body.classList.add(
        "light-mode"
      );

      document.body.classList.remove(
        "dark-mode"
      );

    }

  }, []);


  return (

    <Routes>

      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
  path="/register"
  element={<Register />}
/>


      {/* =========================
          PROTECTED ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/rooms"
          element={<Rooms />}
        />

        <Route
          path="/tenants"
          element={<Tenants />}
        />

        <Route
          path="/rent"
          element={<Rent />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

    </Routes>

  );

}


export default App;