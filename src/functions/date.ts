import dayjs from "dayjs";
const LIMIT_TIME = 3 // hora del dia siguiente hasta la que puedes añadir mensajes

export function getLocalDateISO(input?: string | Date): string {
  return dayjs(input).format("YYYY-MM-DD");
}

export function getEffectiveEntryDate(now = dayjs()) {
  const limit = now.hour() < LIMIT_TIME ? now.subtract(1, "day") : now
  return limit.format("YYYY-MM-DD");
}

export function remainingHours(now = dayjs()) {
  const baseTime = (now.hour() < LIMIT_TIME) ? now : now.add(1, "day")
  const limit = baseTime.set("hour", LIMIT_TIME).startOf("hour")
  return limit.diff(now, "hours")
}