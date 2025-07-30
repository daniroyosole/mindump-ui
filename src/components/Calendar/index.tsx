import { useEffect, useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";
import { getEffectiveEntryDate, getLocalDateISO } from "functions/date";

export const getPercentColor = (percent: number | undefined) => {
  if (percent == null) return { className: "", hex: "" };
  if (percent <= 0.4) return { className: "bg-red-200", hex: "#fecaca" };      // rojo suave
  if (percent < 0.7) return { className: "bg-yellow-300", hex: "#fde68a" };   // amarillo suave más visible
  return { className: "bg-green-200", hex: "#bbf7d0" };                      // verde suave
};

export type Summary = {
  haiku: string;
  date: string; // "YYYY-MM-DD"
  percent: number; // 0 to 1
  summary?: string
};

export default function Calendar({
  summaries,
  setSummaries,
  onSelectDay,
  selectedDate,
}: {
  summaries: Summary[];
  setSummaries: (summary: Summary[]) => void;
  onSelectDay: (iso: string) => void;
  selectedDate: string;
}) {
  const { user } = useUser();
  const [currentMonth, setCurrentMonth] = useState(
    dayjs(getEffectiveEntryDate()).startOf("month")
  );

  const formattedSummaries: {[key: string]: Summary} = (summaries || []).reduce((total, s) => ({...total, [s.date]: s}), {});

  const startDay = currentMonth.startOf("isoWeek");
  const endDay = currentMonth.endOf("month").endOf("isoWeek");
  let date = startDay.clone();
  const days: dayjs.Dayjs[] = [];

  const maxDays = 100; // límite de seguridad
  let i = 0;

  while ((date.isBefore(endDay, "day") || date.isSame(endDay, "day")) && i < maxDays) {
    days.push(date.clone());
    date = date.add(1, "day");
    i++;
  }

  const getPercentForDate = (date: dayjs.Dayjs) => {
    const summary = formattedSummaries[getLocalDateISO(date.toISOString())]
    return summary?.percent;
  };

  useEffect(() => {
    if (user.user_uuid && !currentMonth.isAfter(dayjs(getEffectiveEntryDate()).startOf("month"))) {
      mindumpApi
        .getSummaries({
          user_uuid: user.user_uuid,
          min: getLocalDateISO(currentMonth.startOf("month").startOf("isoWeek").toISOString()),
          max: getLocalDateISO(currentMonth.endOf("month").endOf("isoWeek").toISOString()),
        })
        .then((res) => setSummaries(res));
    }
  }, [currentMonth, user.user_uuid]);


  return (
    <div className="pt-2 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
          className="text-sm text-black hover:text-gray-800"
        >
          ←
        </button>
        <h2 className="text-sm text-black">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
          className="text-sm text-black hover:text-gray-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-center text-black mb-2">
        {dayjs.weekdaysMin(true).map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const iso = getLocalDateISO(d.toISOString());
          const percent = getPercentForDate(d);
          const isToday = d.isSame(dayjs(getEffectiveEntryDate()), "day");

          const isSelected = dayjs(iso).isSame(dayjs(selectedDate), "day");
          const hasData = percent != null;
          const isClickable = hasData || isToday;

          return (
            <button
              key={iso}
              onClick={() => isClickable && onSelectDay(iso)}
              className={clsx(
                "aspect-square w-full rounded-lg relative text-xs flex items-center justify-center",
                {
                  "text-gray-400": !d.isSame(currentMonth, "month"),
                  "border border-blue-400": isSelected,
                  "font-semibold text-black": isToday,
                  "cursor-pointer hover:bg-gray-100": isClickable,
                }
              )}
              disabled={!isClickable}
            >
              {d.date()}
              {hasData && (
                <span
                  className={clsx(
                    "absolute bottom-1 h-2 w-2 rounded-full",
                    getPercentColor(percent).className
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
