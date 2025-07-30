import { useUser } from "contexts/UserContext";
import { useEffect, useRef, useState } from "react";

const langMap: Record<string, string> = {
  ca: "ca-ES", // Catalán (España)
  es: "es-ES", // Español (España)
  en: "en-US", // Inglés (Estados Unidos)
};

export function VoiceInput({ onSend }: { onSend: (text: string) => void }) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const { user } = useUser()

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[user.language || "es"];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onSend(transcript);
    };

    recognition.onerror = (e: any) => {
      console.error("Error en el reconocimiento:", e);
    };

    recognitionRef.current = recognition;
  }, [onSend]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  return (
    <div>
      <button
        onClick={startListening}
        disabled={listening}
        className="w-12 h-12 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-xl hover:bg-gray-50 disabled:opacity-50 transition"
      >
        {listening ? "🎙️" : "🎤"}
      </button>
    </div>
  );
}
