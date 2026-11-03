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