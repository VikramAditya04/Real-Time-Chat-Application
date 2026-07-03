export const getInitials = (name, fallback = "User") =>
  (name || fallback)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const formatMessageTime = (value) =>
  new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export const formatRelativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat([], { numeric: "auto" });
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, amount] of units) {
    if (Math.abs(seconds) >= amount) return formatter.format(Math.round(seconds / amount), unit);
  }
  return "now";
};
