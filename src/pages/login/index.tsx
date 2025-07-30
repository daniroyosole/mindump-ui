// src/pages/Login.tsx
import { GoogleLogin } from "@react-oauth/google";
import { saveUserSession } from "../../functions/auth";
import { useNavigate } from "react-router-dom";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const { updateUser } = useUser()

  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
      const data = await mindumpApi.authWithGoogle(credentialResponse.credential)

      saveUserSession(data.user_uuid);
      updateUser({ name: data.name, email: data.email, user_uuid: data.user_uuid})
      onLogin();
      navigate("/journal");
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-xl mb-4">Inicia sesión</h1>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.error("Login failed")} />
    </div>
  );
}
