import { useState } from "react";
import { VoiceInput } from "./VoiceInput";

export default function InputBar({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState("");

  const onSendAudio = (transcript: string) => {
    if (transcript) {
      setText(transcript)
    }
  }

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
      <input
        className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe aquí lo que quieras contarme..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
      >
        Enviar
      </button>
      <VoiceInput onSend={onSendAudio}/>
    </div>
  );
}
