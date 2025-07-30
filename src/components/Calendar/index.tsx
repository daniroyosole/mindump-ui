import { useEffect, useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { useUser } from "contexts/UserContext";
import { mindumpApi } from "api/mindumpApi";
import { getEffectiveEntryDate, getLocalDateISO } from "functions/date";

export type Summary = {
  haiku: string;
  date: string; // "YYYY-MM-DD"
  percent: number; // 0 to 1
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
  const { user } = useUser()
  const [currentMonth, setCurrentMonth] = useState(dayjs(getEffectiveEntryDate()).startOf("month"));
  
  const startDay = currentMonth.startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");
  let date = startDay.clone();
  const days: dayjs.Dayjs[] = [];

  const maxDays = 100; // límite de seguridad
  let i = 0;
  
  while (date.isBefore(endDay, "day") && i < maxDays) {
    days.push(date.clone());
    date = date.add(1, "day");
    i++;
  }
  

  const getColor = (percent: number | undefined) => {
    if (percent == null) return "";
    if (percent < 0.4) return "bg-red-200";
    if (percent < 0.7) return "bg-yellow-200";
    return "bg-green-200";
  };

  const getPercentForDate = (date: dayjs.Dayjs) => {
    if (summaries && summaries.length) {
      const summary = summaries.find((s) => dayjs(s.date).isSame(dayjs(date), "day"));
      return summary?.percent;
    }
    return null
  };

  useEffect(() => {
    if (user.user_uuid) {
      mindumpApi.getSummaries({ user_uuid: user.user_uuid, min: getLocalDateISO(currentMonth.toISOString()), max: getLocalDateISO(currentMonth.endOf("month").toISOString()) })
        .then((res) => setSummaries(res));
    }
  }, [currentMonth, user.user_uuid]);


  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ←
        </button>
        <h2 className="text-sm font-medium text-gray-700">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const iso = getLocalDateISO(d.toISOString());
          const percent = getPercentForDate(d);
          const isToday = d.isSame(dayjs(getEffectiveEntryDate()), "day");
          
          const isSelected = dayjs(iso).isSame(dayjs(selectedDate), "day")
          const hasData = percent != null;
          const isClickable = hasData || isToday

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
                  "cursor-pointer hover:bg-gray-100": hasData,
                }
              )}
              disabled={!isClickable}
            >
              {d.date()}
              {hasData && (
                <span
                  className={clsx(
                    "absolute bottom-1 h-2 w-2 rounded-full",
                    getColor(percent)
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
