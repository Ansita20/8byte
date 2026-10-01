export function formatMoney(value: number | null) {
  if (value === null) return "-";
  return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export function formatPercent(value: number | null) {
  if (value === null) return "-";
  return value.toFixed(2) + "%";
}

export function colorClass(value: number | null) {
  if (value === null) return "";
  return value >= 0 ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold";
}

export function arrow(value: number | null) {
  if (value === null) return "";
  return value >= 0 ? "▲ " : "▼ ";
}
