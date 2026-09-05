import { ReleaseNoteInterface } from "./ReleaseNote";

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

export const parseChangelogDate = (value: string): Date => {
  const [monthName, dayWithSuffix, yearWithComma] = value.split(" ");
  const month = MONTH_NAMES.indexOf(monthName as (typeof MONTH_NAMES)[number]);
  const day = Number.parseInt(dayWithSuffix ?? "", 10);
  const year = Number.parseInt(yearWithComma ?? "", 10);

  if (month < 0 || Number.isNaN(day) || Number.isNaN(year)) {
    return new Date(Number.NaN);
  }

  return new Date(year, month, day);
};

export const parseMonthYear = (value: string): Date => {
  const separatorIndex = value.lastIndexOf(" ");
  const monthName = value.slice(0, separatorIndex);
  const month = MONTH_NAMES.indexOf(monthName as (typeof MONTH_NAMES)[number]);
  const year = Number(value.slice(separatorIndex + 1));

  if (separatorIndex < 0 || month < 0 || Number.isNaN(year)) {
    return new Date(Number.NaN);
  }

  return new Date(year, month, 1);
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

  const releaseDate = parseChangelogDate(note.date);
  if (Number.isNaN(releaseDate.getTime())) return false;

  const isBeforeStart = startDate != null && releaseDate < startDate;
  const isAfterEnd = endDate != null && releaseDate > endDate;
  return !isBeforeStart && !isAfterEnd;
};
