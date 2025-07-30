import BatteryIndicator from "components/BatteryIndicator";
import type { Summary } from "components/Calendar";
import { useTranslation } from "react-i18next";

export default function SummarySection({ summary }: { summary: Summary }) {
  const { t } = useTranslation()
  if (!summary) return null;

  return (
    <section className="w-full px-2 flex flex-col gap-6 text-left">
      {/* Haiku */}
      <div className="bg-white border border-orange-100 shadow-sm rounded-2xl p-6 text-center">
        <p className="text-lg leading-relaxed font-medium text-gray-800 whitespace-pre-line">
          {summary.haiku?.replace(/\\n/g, "\n") || ""}
        </p>
      </div>

      {/* Resumen textual */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2 select-none">
          {t("diary.summary.title")}
        </h2>
        <p className="text-base leading-relaxed text-gray-700">
          {summary.summary}
        </p>
      </div>

      {/* Bateria simpática */}
      <div className="flex items-center gap-3 text-orange-500 font-semibold justify-center">
        <BatteryIndicator percent={summary.percent} />
      </div>
    </section>
  );
}
