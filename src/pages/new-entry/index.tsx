import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputBar from "components/InputBar";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";
import { getEffectiveEntryDate } from "functions/date";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { MOODS } from "constants/message";

export default function NewEntry() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSave = async (text: string) => {
    if (!text.trim() || !user.user_uuid) return;
    setLoading(true);
    const finalText = selectedMood ? `${t(`newEntry.moods.${selectedMood}`)}: ${text.trim()}` : text.trim()
    try {
      await mindumpApi.sendMessage({
        content: finalText,
        date: getEffectiveEntryDate(),
        timezone: user.timezone || "UTC",
        user_uuid: user.user_uuid,
      });
      navigate("/diary");
    } catch (error) {
      console.error("Error saving entry", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectedMood = (mood: string) => {
    if (selectedMood === mood) setSelectedMood(null)
    else setSelectedMood(mood)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col h-screen px-4 pt-6 pb-[24px] relative bg-white">
        {/* Botón atrás */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Encabezado */}
        <div className="pt-8 mb-2 shrink-0">
          <h1 className="text-lg font-light text-black">{t("newEntry.title")}</h1>
        </div>

        {/* Selector de emociones */}
        <div className="mb-2 shrink-0">
          <div className="flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                onClick={() => toggleSelectedMood(mood.key)}
                className={`px-3 py-1 rounded-full border text-sm transition ${
                  selectedMood === mood.key
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                {mood.emoji} {t(`newEntry.moods.${mood.key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Input que ocupa el resto de la pantalla */}
        <div className="flex-1">
          <InputBar
            onSend={handleSave}
            disabled={loading}
            placeholder={
              selectedMood
                ? t("newEntry.moodPlaceholder", { mood: t(`newEntry.moods.${selectedMood}`).toLowerCase() })
                : t("newEntry.placeholder")
            }
          />
        </div>
      </div>
    </div>
  );
}
