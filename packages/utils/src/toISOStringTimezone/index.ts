// Pad a number to 2 digits
const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
// Get timezone offset in ISO format (+hh:mm or -hh:mm)
const getTimezoneOffset = (date: Date) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  return `${diff + pad(tzOffset / 60)}:${pad(tzOffset % 60)}`;
};

export function toISOStringTimezone(date: Date) {
  // biome-ignore format: For beautiful
  return (
    `${date.getFullYear()}
    -${pad(date.getMonth() + 1)}
    -${pad(date.getDate())}
    T${pad(date.getHours())}
    :${pad(date.getMinutes())}
    :${pad(date.getSeconds())}
    ${getTimezoneOffset(date)}`
  );
}
