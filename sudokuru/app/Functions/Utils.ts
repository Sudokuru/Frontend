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

// A segment is included when it is non-zero or any larger unit is included,
// so only leading zero units are omitted i.e. 3600 -> "01:00:00".
const formatTimeSegment = (value: number, hasLargerUnit = false) => {
  if (value > 0 || hasLargerUnit) return `${String(value).padStart(2, "0")}:`;
  return "";
};

/**
 * Returns the seconds converted to a time format i.e. days, hours, minutes and seconds separated by colons, omitting leading zero units
 * @param inputSeconds - the number of seconds to convert
 * @returns the formatted time string
 */
// https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
export const formatTime = (inputSeconds: number) => {
  const days = Math.floor(inputSeconds / (3600 * 24));
  const hours = Math.floor((inputSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((inputSeconds % 3600) / 60);
  const seconds = Math.floor(inputSeconds % 60);
  const isZeroDuration =
    days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  const paddedDays = formatTimeSegment(days);
  const paddedHours = formatTimeSegment(hours, days > 0);
  const paddedMinutes = formatTimeSegment(minutes, days > 0 || hours > 0);
  const paddedSeconds = isZeroDuration ? "0" : String(seconds).padStart(2, "0");

  return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
};
