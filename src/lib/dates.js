export function toISODate(date = new Date()) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(dateISO, amount) {
  const d = new Date(`${dateISO}T00:00:00`);
  d.setDate(d.getDate() + amount);
  return toISODate(d);
}

export function lastNDates(n, endISO = toISODate()) {
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) out.push(addDays(endISO, -i));
  return out;
}

export const AR_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
export const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export function weekdayIndex(iso) {
  return new Date(`${iso}T00:00:00`).getDay();
}

export function shortDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function longDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return `${AR_DAYS[d.getDay()]} ${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}

export function dayLabel(iso) {
  const today = toISODate();
  if (iso === today) return "اليوم";
  if (iso === addDays(today, -1)) return "أمس";
  if (iso === addDays(today, 1)) return "غداً";
  return longDate(iso);
}

export function daysBetween(aISO, bISO) {
  const a = new Date(`${aISO}T00:00:00`).getTime();
  const b = new Date(`${bISO}T00:00:00`).getTime();
  return Math.round((b - a) / 86400000);
}