export interface lessonOfflineMode {
  mode: getLessonMode.Offline;
}

export interface lessonOnlineMode {
  mode: getLessonMode.Online;
}

export enum getLessonMode {
  Offline,
  Online,
}

/**
 * Functions to handle requesting lessons
 */
export class Lessons {
  /**
   * Returns a list of all the strategies that have lessons
   * @returns string array of strategy names that getSteps can be called with
   */
  public static async getStrategies(
    args: lessonOfflineMode | lessonOnlineMode,
  ): Promise<string[]> {
    if (args.mode === getLessonMode.Online) {
      const response: Response = await fetch(
        "https://sudokuru.s3.amazonaws.com/Lessons/strategies.json",
        { cache: "no-cache" },
      );
      const json = await response.json();
      return json;
    } else {
      return [
        "SUDOKU_101",
        "AMEND_NOTES",
        "NAKED_SINGLE",
        "SIMPLIFY_NOTES",
        "NAKED_SET",
        "HIDDEN_SINGLE",
        "HIDDEN_SET",
        "POINTING_SET",
      ];
    }
  }

  /**
   * Given a strategy string (from getStrategies()) returns a 2d string array of steps for the strategy
   * @param strategy - name of the strategy
   * @returns 2d string array of steps with first value in each array being text and second being link to s3 image
   */
  public static async getSteps(
    strategy: string,
    args: lessonOfflineMode | lessonOnlineMode,
  ): Promise<string[][]> {
    if (args.mode === getLessonMode.Online) {
      const response: Response = await fetch(
        "https://sudokuru.s3.amazonaws.com/Lessons/" + strategy + ".json",
        { cache: "no-cache" },
      );
      const json = await response.json();
      return json;
    } else {
      if (strategy === "SUDOKU_101") {
        return [
          [
            "Welcome to Sudokuru! As your Sudoku Guru I will teach you how to solve Sudoku puzzles. Shown above is a Sudoku puzzle. All Sudoku puzzles are made of 81 cells in a 9x9 grid.",
            require("../../.assets/Lessons/SUDOKU_101_STEP_1.png"),
          ],
          [
            "Each puzzle can be divided into 9 horizontal rows. Every row needs to have the numbers 1 through 9 exactly once. For example, the 2nd row is highlighted in the puzzle above and is only missing 3, 6, and 7 which will go in the remaining three cells.",
            require("../../.assets/Lessons/SUDOKU_101_STEP_2.png"),
          ],
          [
            "Each puzzle can be divided into 9 vertical columns. Every column needs to have the numbers 1 through 9 exactly once. For example, the 1st column is highlighted in the puzzle above and needs 1, 3, and 5-9 still.",
            require("../../.assets/Lessons/SUDOKU_101_STEP_3.png"),
          ],
          [
            "Each puzzle can be divided into 9 3x3 boxes as denoted by the bolder grid lines. Every box needs to have the numbers 1 through 9 exactly once. The 4th box (counting left to right, top to bottom) is highlighted above and still needs 1, 2-5, and 7-9.",
            require("../../.assets/Lessons/SUDOKU_101_STEP_4.png"),
          ],
          [
            "By making sure each row, column, and box has all nine numbers you can deduce the one valid solution to the puzzle.",
            require("../../.assets/Lessons/SUDOKU_101_STEP_5.png"),
          ],
        ];
      } else if (strategy === "AMEND_NOTES") {
        return [
          [
            "Notes are the list of remaining possibilities for a cell. To solve a puzzle we will start by filling in notes for each cell for each value that doesn't conflict with an already placed value.",
            require("../../.assets/Lessons/AMEND_NOTES_STEP_1.png"),
          ],
          [
            "We will start by adding notes to the cell in the top left. We will add every number between 1 and 9 that hasn't already been placed in the cell's row, column or box.",
            require("../../.assets/Lessons/AMEND_NOTES_STEP_2.png"),
          ],
          [
            "The small black numbers in the cell are the numbers that should be added as notes. The small red numbers are the numbers that shouldn't be added because they are already in the row, column, or box as shown in the gold highlighted cells.",
            require("../../.assets/Lessons/AMEND_NOTES_STEP_3.png"),
          ],
          [
            "We've now finished entering all of the valid notes to the top left cell.",
            require("../../.assets/Lessons/AMEND_NOTES_STEP_4.png"),
          ],
          [
            "You have now learned how to amend notes! If you ever make a mistake in a cell you can always erase the notes from it and amend again.",
            require("../../.assets/Lessons/AMEND_NOTES_STEP_4.png"),
          ],
        ];
      } else if (strategy === "NAKED_SINGLE") {
        return [
          [
            "To solve a Sudoku puzzle you have to correctly fill in all of the empty cells. You can do this by utilizing the naked single strategy. To use the naked single strategy you first have to find a cell with only one note left.",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_1.png"),
          ],
          [
            "The highlighted cell in the top middle of the above puzzle is an example of a naked single. Since it only has an 8 left as a note you can fill the cell in with the value 8.",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_2.png"),
          ],
          [
            "You have now learned how to use the naked single strategy to solve Sudoku puzzles!",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_3.png"),
          ],
        ];
      } else if (strategy === "SIMPLIFY_NOTES") {
        return [
          [
            "Using a placed value, simplify notes lets you to eliminate it from the notes of any cell that shares a row, column, and/or box with the placed value cell.",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_4.png"),
          ],
          [
            "You can remove the red 8 as a note from the cell directly to the left of the highlighted placed 8 because they share a row (and box).",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_5.png"),
          ],
          [
            "You have now learned how to use the simplify notes strategy to solve Sudoku puzzles! Part of what makes simplify notes so effective is that they can have a domino effect. For instance, the cell we just removed an 8 from is now a naked single.",
            require("../../.assets/Lessons/NAKED_SINGLE_STEP_7.png"),
          ],
        ];
      } else if (strategy === "NAKED_SET") {
        return [
          [
            "If you recall from a previous lesson naked singles are cells with only one possible value, which must be placed there, resulting in its removal from notes of cells sharing the same group.",
            require("../../.assets/Lessons/NAKED_SET_STEP_1.png"),
          ],
          [
            "This rule can be extended to naked pairs, triplets, and quadruplets, where x cells have only x remaining combined possibilities, allowing for removal of these possibilities from the notes of cells in shared groups.",
            require("../../.assets/Lessons/NAKED_SET_STEP_1.png"),
          ],
          [
            "Above we highlighted in gold a naked pair made up of the numbers 2 and 9. They form a naked pair because they are two cells that can only be filled with a combined two shared numbers.",
            require("../../.assets/Lessons/NAKED_SET_STEP_2.png"),
          ],
          [
            "Therefore, one of them will eventually be filled with a 2 while the other will be filled with a 9. This lets you remove both 2 and a 9 from every cell in the column and box the cells share.",
            require("../../.assets/Lessons/NAKED_SET_STEP_2.png"),
          ],
          [
            "We've now finished removing all of the notes from applying the naked pair.",
            require("../../.assets/Lessons/NAKED_SET_STEP_3.png"),
          ],
          [
            "You've now learned how to use the naked set strategies! While you can't directly place values with naked sets other than singles you can remove lots of notes which lead to placing values like in the case of the 6 naked single revealed in the leftmost column by the naked pair we just applied.",
            require("../../.assets/Lessons/NAKED_SET_STEP_4.png"),
          ],
        ];
      } else if (strategy === "HIDDEN_SINGLE") {
        return [
          [
            "Hidden singles are when a single note is only left in a single cell in a row, column, or box. When you find a hidden single you can remove all of the notes other than the hidden single itself from the cell.",
            require("../../.assets/Lessons/HIDDEN_SINGLE_STEP_1.png"),
          ],
          [
            "In the highlighted column above the number 9 is absent from all of the gold highlighted cells appearing only in one cell. Since only one cell in the column has a nine left you can remove all of the other notes from it as shown highlighted red.",
            require("../../.assets/Lessons/HIDDEN_SINGLE_STEP_2.png"),
          ],
          [
            "We've now finished removing all of the excess notes from the hidden single cell.",
            require("../../.assets/Lessons/HIDDEN_SINGLE_STEP_3.png"),
          ],
          [
            "You've now learned how to use the hidden single strategy! Hidden singles are particularly useful because they always result in naked singles which can be used to place the value.",
            require("../../.assets/Lessons/HIDDEN_SINGLE_STEP_4.png"),
          ],
        ];
      } else if (strategy === "HIDDEN_SET") {
        return [
          [
            "If you recall from a previous lesson hidden singles are based on the fact that if a row, column, or box only has a single location to place a value than it must be placed there. This idea can be generalized to any set size.",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_1.png"),
          ],
          [
            "For instance, you can have hidden pairs, triplets, and quadruplets. All hidden sets rely on there only being x places that x values can be placed in a given row, column, or box leading to each of them having to be placed in one of them eventually. This results in all other notes being removed from them.",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_1.png"),
          ],
          [
            "Above we have highlighted a hidden triplet made up of 1, 5, and 9. They are a hidden triplet because they are three cells containing a combined three numbers that are absent from every other cell in their shared column (other cells are highlighted in gold).",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_2.png"),
          ],
          [
            "Therefore, each of them will eventually be filled with one of those three numbers. This lets you remove every other number from their notes as highlighted in red.",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_2.png"),
          ],
          [
            "We've now finished removing all of the notes from applying the hidden triplet.",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_3.png"),
          ],
          [
            "You've now learned how to use the hidden set strategies! While you can't directly place values with hidden sets you can remove lots of notes which lead to placing values like in the case of the 1 naked single revealed in the column by the hidden triplet we just applied.",
            require("../../.assets/Lessons/HIDDEN_SET_STEP_4.png"),
          ],
        ];
      } else if (strategy === "POINTING_SET") {
        return [
          [
            "Pointing sets are when all cells containing a specific note in a box share the same row or column. When you find a pointing set you can remove the note from every cell in the shared row or column except those in the box itself.",
            require("../../.assets/Lessons/POINTING_SET_1.png"),
          ],
          [
            "The cells highlighted in gold in the above puzzle form a pointing pair since they are the only cells in the highlighted box containing the note 4 and they share a column.",
            require("../../.assets/Lessons/POINTING_SET_2.png"),
          ],
          [
            "Since you know one of the gold cells will eventually have a 4 placed in it you can remove the 4 from the notes of the other cells in the column as highlighted in red.",
            require("../../.assets/Lessons/POINTING_SET_3.png"),
          ],
          [
            "You've now learned how to use the pointing pair strategy!",
            require("../../.assets/Lessons/POINTING_SET_4.png"),
          ],
          [
            "There are also pointing triplets like the one highlighted in gold which contain the only 8's in the box letting you remove all other 8's from the shared row.",
            require("../../.assets/Lessons/POINTING_SET_5.png"),
          ],
          [
            "You've now learned how to use pointing sets!",
            require("../../.assets/Lessons/POINTING_SET_6.png"),
          ],
        ];
      }
    }
  }

  /**
   * Returns a tutorial to teach new users the basics of Sudoku via the first few lessons
   * @returns 2d string array of steps from the first few lessons with first value in each array being text and second being link to s3 image
   */
  public static async getTutorial(): Promise<string[][]> {
    const sudoku_101: Response = await fetch(
      "https://sudokuru.s3.amazonaws.com/Lessons/SUDOKU_101.json",
      { cache: "no-cache" },
    );
    const lesson1 = await sudoku_101.json();
    const amend_notes: Response = await fetch(
      "https://sudokuru.s3.amazonaws.com/Lessons/AMEND_NOTES.json",
      { cache: "no-cache" },
    );
    const lesson2 = await amend_notes.json();
    const naked_single = await fetch(
      "https://sudokuru.s3.amazonaws.com/Lessons/NAKED_SINGLE.json",
      { cache: "no-cache" },
    );
    const lesson3 = await naked_single.json();
    const simplify_notes = await fetch(
      "https://sudokuru.s3.amazonaws.com/Lessons/SIMPLIFY_NOTES.json",
      { cache: "no-cache" },
    );
    const lesson4 = await simplify_notes.json();
    const tutorial = lesson1.concat(lesson2, lesson3, lesson4);
    return tutorial;
  }
}
