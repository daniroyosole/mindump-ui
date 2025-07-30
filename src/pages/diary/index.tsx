import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Calendar, { type Summary } from "components/Calendar";
import { mindumpApi, type Message } from "api/mindumpApi";
import { useUser } from "contexts/UserContext";
import { getEffectiveEntryDate, remainingHours } from "functions/date";
import { titleize } from "functions/text";
import CollapsibleFooter from "components/CollapsibleFooter";
import { useTranslation } from "react-i18next";
import SummarySection from "./SummarySection";

export type SummaryObject = {[key: string]: Summary | null}

export default function DiaryPage() {
  const { user } = useUser();
  const [isoString, setIsoString] = useState(getEffectiveEntryDate());
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (user.user_uuid && isoString) {
      const promiseArray = [
        mindumpApi.getMessages(isoString, user.user_uuid),
        mindumpApi.getSummary(user.user_uuid, isoString)
      ]
      const callbackArray = [
        (response: Message[]) => {
          if (response) setMessages(response);
          else setMessages([])
        }, 
        (response: Summary[]) => {
          if (response && response.length) setSummary(response[0]);
          else setSummary(null)
        }
      ]
      Promise.all(promiseArray).then((responses) => {
        responses.forEach((response, index) => callbackArray[index](response))
      })
    }
  }, [user.user_uuid, isoString]);

  const handleSelectDate = (newIso: string) => {
    setIsoString(newIso);
  };

  const getRemainingHours = () => {
    const diff = remainingHours();
    if (diff === 1) return t("diary.remainingHours.oneHour");
    if (diff < 1) return t("diary.remainingHours.lessThanOneHour");
    return `${Math.floor(diff)} ${t("diary.remainingHours.hours")}`;
  };
  
  useEffect(() => {
    const todaysSummary = summaries.find((s) => s.date === isoString) || null;
    setSummary(todaysSummary)
  }, [summaries, isoString]);

  const shouldShowMessages = !!messages.length;

  return (
    <div style={{ height: "calc(100vh - 64px)", maxHeight: "calc(100vh - 64px)" }} className="flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {titleize(dayjs(isoString + "T12:00:00").format('dddd, LL'))}
          </h1>
        </div>
      </header>
  
      <main className="flex-1 p-4 flex flex-col gap-6 justify-start items-center overflow-auto">
        {shouldShowMessages && (
          <section className="w-full max-w-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 select-none">
            {t("diary.dailySummary")}
          </h2>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {messages.map((msg, idx) => (
              <li
                key={idx}
                className="
                  text-base text-gray-700
                  leading-relaxed
                  select-text
                  transition-colors duration-300 ease-in-out
                "
              >
                {titleize(msg.content)}
              </li>
            ))}
          </ul>
        </section>
        
        )}
        {summary ? (
          <SummarySection summary={summary} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="bg-orange-50 p-6 rounded-xl text-center">
              <p className="text-md font-semibold mb-2">{t("diary.noContentTitle")}</p>
              <p className="text-sm text-zinc-600 mb-4" dangerouslySetInnerHTML={{ __html: t("diary.remainingHours.title", { hours: getRemainingHours() }) }} />
              <button
                onClick={() => navigate("/new-entry")}
                className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full hover:bg-blue-200 transition"
              >
                {t("diary.addEvent")}
              </button>
            </div>
          </div>
        )}
      </main>
  
      <CollapsibleFooter>
        <Calendar
          selectedDate={isoString}
          onSelectDay={handleSelectDate}
          summaries={summaries}
          setSummaries={setSummaries}
        />
      </CollapsibleFooter>
    </div>
  );  
}
