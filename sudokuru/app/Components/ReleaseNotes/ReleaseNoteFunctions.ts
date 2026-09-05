import type { ReleaseNoteInterface } from "./ReleaseNoteValidation";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const PENDING_CHANGELOG_DATE = "#{date}#";

type MonthName = (typeof MONTH_NAMES)[number];

const isMonthName = (value: string): value is MonthName =>
  MONTH_NAMES.some((monthName) => monthName === value);

const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const parseChangelogDate = (value: string): Date => {
  const match = /^(\w+) (\d{1,2})(st|nd|rd|th), (\d{4})$/.exec(value);
  if (!match) throw new Error(`Invalid changelog date: "${value}"`);

  const [, monthName, dayValue, suffix, yearValue] = match;
  if (!isMonthName(monthName)) {
    throw new Error(`Invalid changelog date: "${value}"`);
  }

  const month = MONTH_NAMES.indexOf(monthName);
  const day = Number(dayValue);
  const year = Number(yearValue);
  const date = new Date(year, month, day);

  if (
    suffix !== getDaySuffix(day) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid changelog date: "${value}"`);
  }

  return date;
};

export const parseMonthYear = (value: string): Date => {
  const match = /^(\w+) (\d{4})$/.exec(value);
  if (!match) throw new Error(`Invalid changelog month and year: "${value}"`);

  const [, monthName, yearValue] = match;
  if (!isMonthName(monthName)) {
    throw new Error(`Invalid changelog month and year: "${value}"`);
  }

  const month = MONTH_NAMES.indexOf(monthName);
  const year = Number(yearValue);
  const date = new Date(year, month, 1);

  if (date.getFullYear() !== year) {
    throw new Error(`Invalid changelog month and year: "${value}"`);
  }

  return date;
};

export const matchesKeyword = (
  note: ReleaseNoteInterface,
  keyword: string,
): boolean => {
  if (keyword.length === 0) return true;

  return [
    note.version,
    note.date,
    note.summary,
    ...note.targets,
    ...note.contributors,
    ...(note.features ?? []),
    ...(note["preview features"] ?? []),
    ...(note["bug fixes"] ?? []),
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
};

export const matchesSelection = <T extends string>(
  values: T[],
  selected: Set<T>,
): boolean =>
  selected.size === 0 || values.some((value) => selected.has(value));

export const matchesDateRange = (
  note: ReleaseNoteInterface,
  startDate: Date | null,
  endDate: Date | null,
): boolean => {
  if (!startDate && !endDate) return true;

  if (note.date === PENDING_CHANGELOG_DATE) return false;
  const releaseDate = parseChangelogDate(note.date);

  const isBeforeStart = startDate != null && releaseDate < startDate;
  const isAfterEnd = endDate != null && releaseDate > endDate;
  return !isBeforeStart && !isAfterEnd;
};
