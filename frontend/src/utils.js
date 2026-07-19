export function fmtDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDayLabel(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toIso(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function dateRange(startIso, endIso) {
  const days = [];
  const end = new Date(`${endIso}T00:00:00`);
  for (let d = new Date(`${startIso}T00:00:00`); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(toIso(d));
  }
  return days;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function money(n) {
  return usd.format(n ?? 0);
}

// Boarding-pass style 3-letter code for a destination ("Lisbon" -> "LIS")
export function routeCode(name) {
  return name.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "???";
}

export const BUDGET_CATEGORIES = ["lodging", "food", "transport", "activities", "other"];
