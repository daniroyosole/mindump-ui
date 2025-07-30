import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import dayjs from "dayjs";
import { mindumpApi, type Message } from "api/mindumpApi";
import { useUser } from "contexts/UserContext";

export default function MessagesPage() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const date = searchParams.get("date") || "";
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user.user_uuid && date) {
      mindumpApi.getMessages(date, user.user_uuid).then((response: Message[]) => {
        if (response) setMessages(response);
        else setMessages([]);
      });
    }
  }, [user.user_uuid, date]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="p-4 bg-white shadow-md flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-zinc-500 hover:text-zinc-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">
          Mensajes del {dayjs(date + "T12:00:00").format("D [de] MMMM")}
        </h1>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {messages.length ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-zinc-200 text-sm text-zinc-700"
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-center text-zinc-500 mt-8">
            No hay mensajes para este día.
          </p>
        )}
      </main>
    </div>
  );
}
