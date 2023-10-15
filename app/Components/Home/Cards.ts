export const CARD_WIDTH: number = 300;
const CARD_HEIGHT: number = 600;
export const CARD_PADDING: number = 20;
export const CARD_IMAGE_WIDTH: number = (CARD_WIDTH * 2) / 3;
export const CARD_IMAGE_HEIGHT: number = CARD_HEIGHT / 2;

/**
 * Given window width calculates how many cards should be on each row
 * @param width - window width
 * @param count - number of cards
 * @returns number of cards that can fit on each row
 */
export function calculateCardsPerRow(width: number, count: number): number {
  let columnCount: number = Math.floor(width / (CARD_WIDTH + 100));
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
      return "#4CBB17";
    case "Easy":
      return "#7CFC00";
    case "Intermediate":
      return "#FFFF00";
    case "Hard":
      return "#FFA500";
    default:
      return "#FF0000";
  }
}
