import { describe, expect, test } from "bun:test";
import { parseMonthYear } from "./ReleaseNoteFunctions";

describe("parseMonthYear", () => {
  test("parses a valid changelog month and year", () => {
    expect(parseMonthYear("September 2026")).toEqual(new Date(2026, 8, 1));
  });

  test("rejects an invalid month", () => {
    expect(() => parseMonthYear("Sept 2026")).toThrow(
      'Invalid changelog month and year: "Sept 2026"',
    );
  });

  test("rejects an invalid format", () => {
    expect(() => parseMonthYear("September twenty twenty-six")).toThrow(
      'Invalid changelog month and year: "September twenty twenty-six"',
    );
  });
});
