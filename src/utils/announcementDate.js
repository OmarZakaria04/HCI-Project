// Fixtures use DD-MM-YYYY or DD.MM.YYYY; teacher posts use YYYY-MM-DD.
export function announcementDate(value) {
  if (typeof value !== "string") return "";
  const iso = value.replaceAll(".", "-").replace(/^(\d{2})-(\d{2})-(\d{4})$/, "$3-$2-$1");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : "";
}
