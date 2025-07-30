import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Diary from "./pages/diary";
import NewEntry from "./pages/new-entry";
import { useUser } from "contexts/UserContext";
import Messages from "pages/messages";
import InitialForm from "pages/initial-form";
import DashboardPage from "pages/dashboard";
import AppLayout from "components/AppLayout";
import Profile from "pages/profile";

export default function App() {
  const { user, loading } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user.user_uuid);
  }, [user.user_uuid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/initial-form" /> : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/initial-form"
          element={isLoggedIn ? <InitialForm /> : <Navigate to="/" />}
        />
        <Route
          path="/new-entry"
          element={isLoggedIn ? <NewEntry /> : <Navigate to="/" />}
        />
        <Route
          path="/messages"
          element={isLoggedIn ? <Messages /> : <Navigate to="/" />}
        />
        {/* Rutas con footer */}
        <Route
          path="/diary"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Diary />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Profile />
              </AppLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
