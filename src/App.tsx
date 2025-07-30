import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Diary from "./pages/diary";
import NewEntry from "./pages/new-entry";
import { getUserSession } from "./functions/auth";
import Journal from "pages/journal";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUserSession());

  useEffect(() => {
    // Cada vez que se monta, chequea sesión
    const session = getUserSession();
    setIsLoggedIn(!!session);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/diary" /> : <Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/journal"
          element={isLoggedIn ? <Journal /> : <Navigate to="/" />}
        />
        <Route
          path="/diary"
          element={isLoggedIn ? <Diary /> : <Navigate to="/" />}
        />
        <Route
          path="/new-entry"
          element={isLoggedIn ? <NewEntry /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
