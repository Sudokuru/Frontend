import { z } from "zod";
import {
  PENDING_CHANGELOG_DATE,
  parseChangelogDate,
} from "./ReleaseNoteFunctions";

const releaseNoteSchema = z
  .object({
    version: z.string().min(1),
    date: z.string().min(1),
    summary: z.string().min(1),
    features: z.array(z.string()).optional(),
    "preview features": z.array(z.string()).optional(),
    "bug fixes": z.array(z.string()).optional(),
    targets: z.array(z.enum(["web", "mobile", "desktop"])),
    contributors: z.array(z.string()),
  })
  .strict();

export type ReleaseNoteInterface = z.infer<typeof releaseNoteSchema>;

const getEntryLabel = (value: unknown, index: number): string => {
  const versionResult = z.object({ version: z.string() }).safeParse(value);
  return versionResult.success
    ? `version ${versionResult.data.version}`
    : `at index ${index}`;
};

export const parseReleaseNotes = (value: unknown): ReleaseNoteInterface[] => {
  const entries = z.array(z.unknown()).parse(value);

  return entries.map((entry, index) => {
    const result = releaseNoteSchema.safeParse(entry);
    const label = getEntryLabel(entry, index);

    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".") || "entry"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid changelog entry ${label}: ${issues}`);
    }

    if (result.data.date === PENDING_CHANGELOG_DATE) {
      if (index !== 0) {
        throw new Error(
          `Invalid changelog entry ${label}: ${PENDING_CHANGELOG_DATE} is only allowed on the first entry`,
        );
      }
    } else {
      try {
        parseChangelogDate(result.data.date);
      } catch {
        throw new Error(
          `Invalid changelog entry ${label}: date "${result.data.date}" is invalid`,
        );
      }
    }

    return result.data;
  });
};
