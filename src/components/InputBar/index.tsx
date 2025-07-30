import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
export default function InputBar({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="relative h-full flex flex-col">
      <textarea
        ref={textareaRef}
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="flex-1 resize-none p-6 bg-orange-50 rounded-2xl text-base text-gray-700 leading-relaxed placeholder-gray-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300"
        placeholder={placeholder || t("newEntry.placeholder")}
      />

      {/* Enviar */}
      <div className="absolute bottom-0 left-0 w-full px-4 pb-6 pt-6 bg-white">
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full bg-orange-400 text-white py-4 rounded-full text-base font-semibold shadow-md hover:bg-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
