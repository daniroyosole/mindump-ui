import { useEffect, useState } from "react";
import InputBar from "../InputBar";
import { sendMessage, type Message } from "api/openai";
import { ADDITIONAL_DIARY_PROMPT, INITIAL_DIARY_PROMPT } from "constants/index";
import { getFromCookies } from "functions/cookies";
import EventHistory from "../EventHistory";
import { useDiary } from "contexts/DiaryContext";
import { getEffectiveEntryDate } from "functions/date";

export default function Diary() {
  const [isoString, setIsoString] = useState(getEffectiveEntryDate())
  const [isLoading, setIsLoading] = useState(false);
  const { entries, updateEntry, setEntries } = useDiary()

  const handleSend = (content: string) => {
    const todaysEntry = entries.filter(entry => entry.date === isoString)
    let prompt: Message[] = []
    if (todaysEntry?.length) {
      const todaysEvents = todaysEntry[0].events.join("//")
      prompt = [
        { role: "system", content: INITIAL_DIARY_PROMPT},
        { role: "system", content: `${ADDITIONAL_DIARY_PROMPT}, la lista actual es: ${todaysEvents ?? "-"}` },
        { role: "user", content }
      ]
    } else {
      prompt = [
        { role: "system", content: INITIAL_DIARY_PROMPT},
        { role: "user", content }
      ]
    }

    setIsLoading(true)
    sendMessage(prompt).then((response) => {
      updateEntry(isoString, JSON.parse(response.content))
      setIsLoading(false)
    })
  };

  useEffect(() => {
    const initialEntries = getFromCookies("mindump-entries")
    if (initialEntries) {
      setEntries(JSON.parse(initialEntries))
    }
  }, []);

  const handleAddEvent = (newIsoString: string) => {
    setIsoString(newIsoString)
  }
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <EventHistory eventHistory={entries} onAddEvent={handleAddEvent} />
      <InputBar onSend={handleSend} isoString={isoString} />
    </div>
  
  );
}
