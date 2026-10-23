/**
 * Returns the string converted to a title format i.e. replaces _ with spaces and capitalizes only the first letter of each word
 * @param str - the string to convert
 * @returns the converted string
 */
export const toTitle = (str: string) => {
  return str
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatTimeSegment = (value: number, precedingUnit = 0) => {
  if (value > 0) return `${String(value).padStart(2, "0")}:`;
  if (value === 0 && precedingUnit !== 0) return "00:";
  return "";
};

export const formatTime = (inputSeconds: number) => {
  const days = Math.floor(inputSeconds / (3600 * 24));
  const hours = Math.floor((inputSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((inputSeconds % 3600) / 60);
  const seconds = Math.floor(inputSeconds % 60);
  const paddedDays = formatTimeSegment(days);
  const paddedHours = formatTimeSegment(hours, days);
  const paddedMinutes = formatTimeSegment(minutes, hours);
  let paddedSeconds = "0";
  if (seconds > 0) paddedSeconds = String(seconds).padStart(2, "0");
  else if (seconds === 0 && minutes !== 0) paddedSeconds = "00";

  return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
};
