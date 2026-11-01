import { describe, expect, test } from "bun:test";
import { formatTime } from "./Utils";

describe("formatTime", () => {
  // Zero units are zero-padded once any larger unit is included; only leading
  // zero units are omitted.
  const cases = [
    { seconds: 0, formatted: "0" },
    { seconds: 1, formatted: "01" },
    { seconds: 9, formatted: "09" },
    { seconds: 10, formatted: "10" },
    { seconds: 59, formatted: "59" },
    { seconds: 60, formatted: "01:00" },
    { seconds: 61, formatted: "01:01" },
    { seconds: 3599, formatted: "59:59" },
    { seconds: 3600, formatted: "01:00:00" },
    { seconds: 3601, formatted: "01:00:01" },
    { seconds: 3660, formatted: "01:01:00" },
    { seconds: 86399, formatted: "23:59:59" },
    { seconds: 86400, formatted: "01:00:00:00" },
    { seconds: 86401, formatted: "01:00:00:01" },
    { seconds: 90000, formatted: "01:01:00:00" },
    { seconds: 90060, formatted: "01:01:01:00" },
    { seconds: 90061, formatted: "01:01:01:01" },
    { seconds: 864000, formatted: "10:00:00:00" },
  ];

  for (const { seconds, formatted } of cases) {
    test(`formats ${seconds} seconds`, () => {
      expect(formatTime(seconds)).toBe(formatted);
    });
  }
});
