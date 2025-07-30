import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

export type DailyEvent = {
  date: string;
  events: string[];
};

export default function EventHistory({
  eventHistory,
  onAddEvent,
}: {
  eventHistory: DailyEvent[];
  onAddEvent: (date: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [eventHistory]);

  // Cierre al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Scrollable event list */}
      <div
        ref={listRef}
        className="absolute inset-0 overflow-y-auto p-4 pr-6 pb-28 space-y-6"
      >
        {eventHistory.map((entry, index) => (
          <div key={index} className="space-y-2">
            <h2 className="text-sm text-gray-500 font-semibold">
              {new Date(entry.date).toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-800 text-[15px] leading-snug">
              {entry.events.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
