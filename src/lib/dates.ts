// Dates in the data files are plain YYYY-MM-DD strings. Format them in UTC so a
// Sunday never shows up as the Saturday before.
const long = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const short = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const month = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const formatLong = (iso: string) => long.format(toDate(iso));
export const formatShort = (iso: string) => short.format(toDate(iso));
export const formatMonth = (iso: string) => month.format(toDate(iso));

export function formatRange(start: string, end?: string) {
  return end && end !== start ? `${formatShort(start)} – ${formatShort(end)}` : formatLong(start);
}

// Groups items that share a date, keeping date order.
export function groupByDate<T extends { date: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(item.date, [...(groups.get(item.date) ?? []), item]);
  return [...groups.entries()].map(([date, items]) => ({ date, items }));
}
