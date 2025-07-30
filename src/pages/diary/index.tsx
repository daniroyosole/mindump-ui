import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Calendar, { type Summary } from "components/Calendar";
import { FileText } from "lucide-react";
import { mindumpApi } from "api/mindumpApi";
import { useUser } from "contexts/UserContext";
import type { DailyEvent } from "components/EventHistory";
import { getEffectiveEntryDate, remainingHours } from "functions/date";

export default function DiaryPage() {
  const { user } = useUser();
  const [isoString, setIsoString] = useState(getEffectiveEntryDate());
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [summary, setSummary] = useState<Summary | null>();
  const [entry, setEntry] = useState<DailyEvent | null>();
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  console.log(isoString)

  useEffect(() => {
    if (user.user_uuid) {
      mindumpApi.getMessages(isoString, user.user_uuid).then((response: any[]) => {
        if (response) setMessages(response);
        else setMessages([])
      });

      mindumpApi.getEntry(isoString, user.user_uuid).then((response: DailyEvent[]) => {
        if (response && response.length) setEntry(response[0]);
        else setEntry(null)
      });
    }
  }, [user.user_uuid, isoString]);

  useEffect(() => {
    const todaysSummary = summaries.find((s) => s.date === isoString);
    if (todaysSummary) setSummary(todaysSummary);
    else setSummary(null)
  }, [summaries, isoString]);

  const handleSelectDate = (newIso: string) => {
    setIsoString(newIso);
  };

  const getColorByPercent = (percent: number) => {
    if (percent < 0.4) return "bg-red-100 text-red-800";
    if (percent < 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getRemainingHours = () => {
    const diff = remainingHours()
    if (diff === 1) return "1 hora";
    if (diff < 1) return "menos de una hora";
    return `${Math.floor(diff)} horas`;
  };

  const shouldShowMessages = !entry && messages.length;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {dayjs(isoString  + "T12:00:00").format("dddd, D [de] MMMM")}
          </h1>
        </div>
        <button
          onClick={() => navigate("/raw-messages?date=" + isoString)}
          className="text-zinc-500 hover:text-zinc-800"
        >
          <FileText size={20} />
        </button>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {entry ? (
          <>
            <section>
              <h2 className="font-bold text-md mb-2">Resumen diario</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {entry.events.map((event, idx) => (
                  <li key={idx}>{event}</li>
                ))}
              </ul>
            </section>

            {summary?.haiku && (
              <div
                className={`p-4 rounded-xl text-sm ${getColorByPercent(
                  summary.percent || 0
                )}`}
              >
                <pre className="whitespace-pre-wrap font-medium">{summary.haiku}</pre>
              </div>
            )}
          </>
        ) : shouldShowMessages ? (
          <>
            <section>
              <h2 className="font-bold text-md mb-2">Tu día hasta ahora</h2>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {messages.map((msg, idx) => (
                  <li key={idx}>{msg.content}</li>
                ))}
              </ul>
            </section>
            <button
              onClick={() => navigate("/new-entry")}
              className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full hover:bg-blue-200 transition"
            >
              Añadir evento
            </button>
          </>
        ) : (
          <div className="bg-orange-50 p-6 rounded-xl text-center">
            <p className="text-md font-semibold mb-2">Registra aquí tu día y emociones.</p>
            <p className="text-sm text-zinc-600 mb-4">
              aún tienes <strong>{getRemainingHours()}</strong> para escribir hoy
            </p>
            <button
              onClick={() => navigate("/new-entry")}
              className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full hover:bg-blue-200 transition"
            >
              Añadir evento
            </button>
          </div>
        )}
      </main>

      <footer className="p-4">
        <Calendar
          selectedDate={isoString}
          onSelectDay={handleSelectDate}
          summaries={summaries}
          setSummaries={setSummaries}
        />
      </footer>
    </div>
  );
}
