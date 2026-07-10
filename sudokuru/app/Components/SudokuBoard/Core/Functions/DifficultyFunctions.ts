import type { WrongValueDemoCase } from "../../../../Data/hints/demo_wrong_value_hints";
import type { AmendNotesDemoCase } from "../../../../Data/hints/demo_amend_notes_hints";
import type { ObviousSingleDemoCase } from "../../../../Data/hints/demo_obvious_single_hints";

export type WrongValueDemoDifficulty =
  | "wrong-value-direct-conflict"
  | "wrong-value-no-direct-conflict";
export type AmendNotesDemoDifficulty =
  | "amend-notes-basic"
  | "amend-notes-corrective";
export type ObviousSingleDemoDifficulty = "obvious-single";

export type GameDifficulty =
  | "novice"
  | "amateur"
  | "layman"
  | "trainee"
  | "protege"
  | "professional"
  | "pundit"
  | "master"
  | "grandmaster"
  | WrongValueDemoDifficulty
  | AmendNotesDemoDifficulty
  | ObviousSingleDemoDifficulty;

export const WRONG_VALUE_DEMO_DIFFICULTIES: WrongValueDemoDifficulty[] = [
  "wrong-value-direct-conflict",
  "wrong-value-no-direct-conflict",
];
export const AMEND_NOTES_DEMO_DIFFICULTIES: AmendNotesDemoDifficulty[] = [
  "amend-notes-basic",
  "amend-notes-corrective",
];
export const OBVIOUS_SINGLE_DEMO_DIFFICULTIES: ObviousSingleDemoDifficulty[] = [
  "obvious-single",
];

export function isWrongValueDemoDifficulty(
  difficulty: GameDifficulty,
): difficulty is WrongValueDemoDifficulty {
  return WRONG_VALUE_DEMO_DIFFICULTIES.includes(
    difficulty as WrongValueDemoDifficulty,
  );
}

export function isAmendNotesDemoDifficulty(
  difficulty: GameDifficulty,
): difficulty is AmendNotesDemoDifficulty {
  return AMEND_NOTES_DEMO_DIFFICULTIES.includes(
    difficulty as AmendNotesDemoDifficulty,
  );
}

export function isObviousSingleDemoDifficulty(
  difficulty: GameDifficulty,
): difficulty is ObviousSingleDemoDifficulty {
  return OBVIOUS_SINGLE_DEMO_DIFFICULTIES.includes(
    difficulty as ObviousSingleDemoDifficulty,
  );
}

export function getWrongValueDemoCaseId(
  difficulty: WrongValueDemoDifficulty,
): WrongValueDemoCase["id"] {
  switch (difficulty) {
    case "wrong-value-direct-conflict":
      return "direct-row-conflict";
    case "wrong-value-no-direct-conflict":
      return "no-direct-conflict";
  }
}

export function getAmendNotesDemoCaseId(
  difficulty: AmendNotesDemoDifficulty,
): AmendNotesDemoCase["id"] {
  switch (difficulty) {
    case "amend-notes-basic":
      return "basic-amend-notes";
    case "amend-notes-corrective":
      return "corrective-amend-notes";
  }
}

export function getObviousSingleDemoCaseId(
  difficulty: ObviousSingleDemoDifficulty,
): ObviousSingleDemoCase["id"] {
  switch (difficulty) {
    case "obvious-single":
      return "single-obvious-single";
  }
}

export type GameDifficultyScore = 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40;

/**
 * Calculates the difficulty score
 * @param difficulty A string representing the difficulty of the puzzle
 * @returns A number representing the difficulty score from the puzzle
 */
function calculateDifficultyScore(
  difficulty: GameDifficulty,
): GameDifficultyScore {
  switch (difficulty) {
    case "novice":
      return 0;
    case "amateur":
      return 5;
    case "layman":
      return 10;
    case "trainee":
      return 15;
    case "protege":
      return 20;
    case "professional":
      return 25;
    case "pundit":
      return 30;
    case "master":
      return 35;
    case "grandmaster":
      return 40;
    case "wrong-value-direct-conflict":
    case "wrong-value-no-direct-conflict":
    case "amend-notes-basic":
    case "amend-notes-corrective":
    case "obvious-single":
      return 0;
  }
}

/**
 * Calculates the hint and incorrect cell score
 * Every hint and incorrect cell subtracts 5 point from 30, with a minimum score of 0 and a maximum score of 30
 * @param numWrongCellsPlayed a number representing the number of wrong cells played
 * @param numHintsUsed a number representing the number of hints used
 * @returns A number representing the hint and incorrect cell score
 */
function calculateHintAndIncorrectCellScore(
  numWrongCellsPlayed: number,
  numHintsUsed: number,
): number {
  // hints and incorrect cell placements are weighted equally
  const totalScrewups = (numWrongCellsPlayed + numHintsUsed) * 5;
  if (totalScrewups > 30) {
    return 0;
  } else {
    return 30 - totalScrewups;
  }
}

/**
 * Calculates the time score
 * If the game takes 30 minutes or longer, we return a score of 0
 * Otherwise, we return a score of 30 minus how many minutes the game took.
 * @param time The total time of the game
 * @returns A number representing the time score
 */
function calculateTimeScore(time: number): number {
  const minutes = Math.floor(time / 60);
  if (minutes > 30) {
    return 0;
  } else {
    return 30 - minutes;
  }
}

/**
 * Calculates the score from the game
 * @param numHintsUsed the number of hints used during the game
 * @param numWrongCellsPlayed the number of wrong cells played during the game
 * @param time the total time of the game
 * @param difficulty the difficulty of the game as a
 * @returns A number 0-100 which represents the score for the game
 */
export function calculateGameScore(
  numHintsUsed: number,
  numWrongCellsPlayed: number,
  time: number,
  difficulty: GameDifficulty,
): number {
  const difficultyScore: GameDifficultyScore =
    calculateDifficultyScore(difficulty);
  const hintAndIncorrectCellsScore: number = calculateHintAndIncorrectCellScore(
    numWrongCellsPlayed,
    numHintsUsed,
  );
  const timeScore: number = calculateTimeScore(time);
  return difficultyScore + hintAndIncorrectCellsScore + timeScore;
}
