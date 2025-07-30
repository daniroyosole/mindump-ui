import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputBar from "components/InputBar";
import { useUser } from "contexts/UserContext";
import dayjs from "dayjs";
import { mindumpApi } from "api/mindumpApi";
import { getLocalDateISO } from "functions/date";

const phrases = [
  "Hoy también mereces ser escuchado.",
  "Vacía lo que llevas dentro.",
  "No hay juicio, solo espacio.",
  "Tu voz es importante.",
  "Escribe como si nadie fuera a leerlo."
];
const phrase = phrases[Math.floor(Math.random() * phrases.length)];

export default function NewEntry() {
  const { user } = useUser()
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSave = async (text: string) => {
    if (!text.trim() || !user.user_uuid) return;
    setLoading(true);
    console.log(user)
    try {
      await mindumpApi.sendMessage({
        content: text,
        date: getLocalDateISO(),
        timezone: user.timezone ?? null,
        user_uuid: user.user_uuid
      });
      navigate("/journal");
    } catch (error) {
      console.error("Error saving entry", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">

      <div className="flex-1 flex items-center justify-center px-6 text-center">
        {loading ? (
          <div className="animate-pulse text-gray-400">Guardando...</div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">¿Cómo fue tu día?</h1>
            <p className="text-lg italic text-gray-500">{phrase}</p>
          </div>
        )}
      </div>

      <div className="w-full p-4 border-t">
        <InputBar onSend={handleSave} disabled={loading} />
      </div>
    </div>
  );
}
