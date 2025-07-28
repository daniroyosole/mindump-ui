import { useEffect, useRef, useState } from "react";

export function VoiceInput({ onSend }: { onSend: (text: string) => void }) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onSend(transcript);
    };

    recognition.onerror = (e) => {
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
      <button onClick={startListening} disabled={listening}>
        {listening ? "🎙️ Escuchando..." : "🎤 Hablar"}
      </button>
    </div>
  );
}
