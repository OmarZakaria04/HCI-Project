// Fixtures use day-month-year school-local times; avoid locale-dependent parsing.
export default function submissionDate(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)$/.exec(value);
  if (!match) return null;
  const [, day, month, year, hour, minute, period] = match;
  if (Number(hour) < 1 || Number(hour) > 12 || Number(minute) > 59) return null;
  const hours = Number(hour) % 12 + (period === "PM" ? 12 : 0);
  const date = new Date(Number(year), Number(month) - 1, Number(day), hours, Number(minute));
  if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) return null;
  return {
    order: date.getTime(),
    iso: `${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${minute}`,
    label: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(date),
    dayLabel: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date),
    timeLabel: `${hour}:${minute} ${period}`,
  };
}
