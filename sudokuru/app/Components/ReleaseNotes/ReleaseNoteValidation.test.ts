import { describe, expect, test } from "bun:test";
import json from "../../../Changelog.json";
import { PENDING_CHANGELOG_DATE } from "./ReleaseNoteFunctions";
import { parseReleaseNotes } from "./ReleaseNoteValidation";

const validReleaseNote = {
  version: "1.0.0",
  date: "September 5th, 2026",
  summary: "Valid release note",
  targets: ["web"],
  contributors: ["Contributor"],
};

describe("parseReleaseNotes", () => {
  test("validates the changelog", () => {
    expect(parseReleaseNotes(json)).toEqual(json);
  });

  test("accepts the pending date on the first release note", () => {
    const pendingReleaseNote = {
      ...validReleaseNote,
      date: PENDING_CHANGELOG_DATE,
    };

    expect(parseReleaseNotes([pendingReleaseNote])).toEqual([
      pendingReleaseNote,
    ]);
  });

  test("rejects fields that do not match the release note schema", () => {
    expect(() =>
      parseReleaseNotes([{ ...validReleaseNote, targets: ["console"] }]),
    ).toThrow("Invalid changelog entry version 1.0.0: targets.0");
    expect(() =>
      parseReleaseNotes([{ ...validReleaseNote, summary: 42 }]),
    ).toThrow("Invalid changelog entry version 1.0.0: summary");
  });

  test("rejects invalid concrete dates", () => {
    expect(() =>
      parseReleaseNotes([{ ...validReleaseNote, date: "February 30th, 2026" }]),
    ).toThrow(
      'Invalid changelog entry version 1.0.0: date "February 30th, 2026" is invalid',
    );
  });

  test("rejects the pending date after the first release note", () => {
    expect(() =>
      parseReleaseNotes([
        validReleaseNote,
        {
          ...validReleaseNote,
          version: "0.9.0",
          date: PENDING_CHANGELOG_DATE,
        },
      ]),
    ).toThrow(
      `Invalid changelog entry version 0.9.0: ${PENDING_CHANGELOG_DATE} is only allowed on the first entry`,
    );
  });
});
