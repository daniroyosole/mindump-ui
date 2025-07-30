import { useState, useRef, useEffect } from "react";
import { VoiceInput } from "./VoiceInput";

export default function InputBar({
  onSend,
  disabled
}: {
  onSend: (msg: string) => void;
  disabled: boolean
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ajusta la altura automáticamente hasta un máximo
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // reinicia
      const maxHeight = 5 * 24; // aprox. 5 líneas de 24px (ajusta si usás otro tamaño)
      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    }
  }, [text]);

  const onSendAudio = (transcript: string) => {
    if (transcript) {
      setText(transcript);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex flex-col gap-2">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          disabled={disabled}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 resize-none overflow-y-auto max-h-[120px] px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe aquí lo que quieras contarme..."
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        >
          Enviar
        </button>
        <VoiceInput onSend={onSendAudio} />
      </div>
    </div>
  );
}
