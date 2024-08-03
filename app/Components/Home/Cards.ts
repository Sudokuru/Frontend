import {
  EASY_COLOR,
  HARD_COLOR,
  INTERMEDIATE_COLOR,
  VERY_EASY_COLOR,
  VERY_HARD_COLOR,
} from "../../Styling/HighlightColors";

export const CARD_WIDTH: number = 300;
const CARD_HEIGHT: number = 600;
export const CARD_PADDING: number = 20;
export const CARD_IMAGE_WIDTH: number = (CARD_WIDTH * 2) / 3;
export const CARD_IMAGE_HEIGHT: number = CARD_HEIGHT / 2;

/**
 * Given window width calculates how many cards should be on each row
 * @param width - window width
 * @param count - number of cards
 * @param shrinkage - optional parameter specifying how much to shrink CARD_WIDTH by (0.1 should shrink by 10%, defaults to 0)
 * @returns number of cards that can fit on each row
 */
export function calculateCardsPerRow(
  width: number,
  count: number,
  shrinkage = 0
): number {
  let columnCount: number = Math.floor(
    width / (CARD_WIDTH * (1 - shrinkage) + 100)
  );
  console.log(
    "width: " + width + ", count: " + count + ", columnCount: " + columnCount
  );
  // If we cannot fix a single card fully per row we just try to best we can anyways
  if (columnCount === 0) {
    return 1;
  }
  // Decrease the number of columns to the smallest number that is greater than or equal to the number of rows
  while (columnCount - 1 >= Math.ceil(count / (columnCount - 1))) {
    columnCount--;
  }
  return columnCount;
}

export type difficulty =
  | "Very Easy"
  | "Easy"
  | "Intermediate"
  | "Hard"
  | "Very Hard";

/**
 * Given a difficulty returns the corresponding color
 */
export function getDifficultyColor(difficulty: difficulty): string {
  switch (difficulty) {
    case "Very Easy":
      return VERY_EASY_COLOR;
    case "Easy":
      return EASY_COLOR;
    case "Intermediate":
      return INTERMEDIATE_COLOR;
    case "Hard":
      return HARD_COLOR;
    default:
      return VERY_HARD_COLOR;
  }
}
