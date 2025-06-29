import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { OBVIOUS_SINGLE_DRILLS } from "../../../../Data/drills/obvious_single_drills";
import { HIDDEN_SINGLE_DRILLS } from "./../../../../Data/drills/hidden_single_drills";
import {
  BoardObjectProps,
  DrillObjectProps,
} from "../../../../Functions/LocalDatabase";
import { DrillBoard } from "../../SudokuBoard";
import { getSudokuHint } from "../../Core/Functions/HintFunctions";

export async function generateGame(props: DrillBoard, initializeNotes = true) {
  let gameData = null;

  if (props.action === "StartGame") {
    return returnDrillOfStrategy(props.strategy);
    // !uncomment below for dev testing
    // return returnDrillOfType("dev");
  }
  return gameData;
}

/**
 * Returns a random puzzle from an array of puzzles
 * @param PUZZLES An array of puzzles
 * @returns a random puzzle from an array of puzzles
 */
const retrieveRandomDrillPuzzle = (PUZZLES: string[]): string => {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @returns A Puzzle object
 */
export const returnDrillOfType = (strategy: SudokuStrategy | "dev"): string => {
  console.log(strategy);
  switch (strategy) {
    case "dev":
      return retrieveRandomDrillPuzzle(OBVIOUS_SINGLE_DRILLS);
    // case "AMEND_NOTES":
    //   return retrieveRandomDrillPuzzle(AMEND_NOTES_DRILLS);
    // case "SIMPLIFY_NOTES":
    //   return retrieveRandomDrillPuzzle(SIMPLIFY_NOTES_DRILLS);
    case "OBVIOUS_SINGLE":
      return retrieveRandomDrillPuzzle(OBVIOUS_SINGLE_DRILLS);
    // case "OBVIOUS_PAIR":
    //   return retrieveRandomDrillPuzzle(OBVIOUS_PAIR_DRILLS);
    // case "OBVIOUS_TRIPLET":
    //   return retrieveRandomDrillPuzzle(OBVIOUS_TRIPLET_DRILLS);
    // case "OBVIOUS_QUADRUPLET":
    //   return retrieveRandomDrillPuzzle(OBVIOUS_QUADRUPLET_DRILLS);
    case "HIDDEN_SINGLE":
      return retrieveRandomDrillPuzzle(HIDDEN_SINGLE_DRILLS);
    // case "HIDDEN_PAIR":
    //   return retrieveRandomDrillPuzzle(HIDDEN_PAIR_DRILLS);
    // case "HIDDEN_TRIPLET":
    //   return retrieveRandomDrillPuzzle(HIDDEN_TRIPLET_DRILLS);
    // case "HIDDEN_QUADRUPLET":
    //   return retrieveRandomDrillPuzzle(HIDDEN_QUADRUPLET_DRILLS);
    // case "POINTING_PAIR":
    //   return retrieveRandomDrillPuzzle(POINTING_PAIR_DRILLS);
    // case "POINTING_TRIPLET":
    //   return retrieveRandomDrillPuzzle(POINTING_TRIPLET_DRILLS);
  }
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @param initializeNotes Boolean to determine if notes should be initialized.
 * @returns A puzzle object that is readable by the Sudoku component.
 */
export const returnDrillOfStrategy = (
  strategy: SudokuStrategy | "dev",
): BoardObjectProps => {
  const puzzles = returnDrillOfType(strategy);
  if (strategy === "dev") {
    strategy = "OBVIOUS_SINGLE";
  }
  console.log("Hello, strategies ", strategy, " puzzles ", puzzles);
  return convertPuzzleToSudokuObject(puzzles, strategy);
};

/**
 * This function takes in a Puzzle object and returns a BoardObjectProps object.
 * @param puzzle Puzzle object
 */
export const convertPuzzleToSudokuObject = (
  puzzle: string,
  strategy: SudokuStrategy,
): DrillObjectProps => {
  let game: DrillObjectProps = {
    variant: "drill",
    version: 1,
    selectedCells: [],
    initialPuzzleState: [],
    puzzleState: [],
    puzzleSolution: [],
    statistics: {
      difficulty: strategy,
      hintUsed: false,
      numWrongCellsPlayed: 0,
      time: 0,
    },
    inNoteMode: false,
    actionHistory: [],
  };

  console.log(puzzle);

  for (let i = 0; i < 9; i++) {
    game.puzzleState.push([]);
    game.puzzleSolution.push([]);
    game.initialPuzzleState.push([]);
    for (let j = 0; j < 9; j++) {
      let charValuePuzzle = puzzle.charAt(i * 9 + j);
      let numValuePuzzle = Number(charValuePuzzle);
      if (numValuePuzzle === 0) {
        game.puzzleState[i][j] = { type: "value", entry: 0 };
        game.puzzleSolution[i][j] = { type: "value", entry: 0 };
        game.initialPuzzleState[i][j] = { type: "value", entry: 0 };
      } else {
        game.puzzleState[i][j] = { type: "given", entry: numValuePuzzle };
        game.puzzleSolution[i][j] = { type: "given", entry: numValuePuzzle };
        game.initialPuzzleState[i][j] = {
          type: "given",
          entry: numValuePuzzle,
        };
      }
    }
  }

  // Initialize the board with notes filled in
  if (strategy !== "AMEND_NOTES") {
    const ALL_NOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    while (true) {
      try {
        let hint = getSudokuHint(game.puzzleState, SUDOKU_STRATEGY_ARRAY);

        if (hint.strategy === strategy) {
          break;
        }

        // hint.removals structure: [row, col, note1, note2, ...]
        // slice(2) skips row and col to get just the notes to remove
        // Filter to keep only notes that shouldn't be removed

        let notes: number[] = [];

        if (hint.strategy === "AMEND_NOTES") {
          notes = ALL_NOTES.filter(
            (x) => !hint.removals[0].slice(2).includes(x),
          );
        } else {
          if (
            game.puzzleState[hint.removals[0][0]][hint.removals[0][1]].type ===
            "note"
          ) {
            //
            notes = (
              game.puzzleState[hint.removals[0][0]][hint.removals[0][1]]
                .entry as number[]
            ).filter((x) => !hint.removals[0].slice(2).includes(x));
          } else {
            console.log("This shouldn't happen");
          }
        }

        game.puzzleState[hint.removals[0][0]][hint.removals[0][1]] = {
          type: "note",
          entry: notes,
        };
        game.puzzleSolution[hint.removals[0][0]][hint.removals[0][1]] = {
          type: "note",
          entry: notes,
        };
        game.initialPuzzleState[hint.removals[0][0]][hint.removals[0][1]] = {
          type: "note",
          entry: notes,
        };
      } catch {
        // If getSudokuHint throws an exception, we've initialized
        // all possible notes and can exit the loop
        break;
      }
    }
  }

  // Finalize solution
  let hint = getSudokuHint(game.puzzleState, [strategy]);

  if (strategy === "OBVIOUS_SINGLE") {
    game.puzzleSolution[hint.placements[0][0]][hint.placements[0][1]] = {
      type: "value",
      entry: hint.placements[0][2],
    };
    while (true) {
      try {
        let hint = getSudokuHint(game.puzzleSolution, ["SIMPLIFY_NOTES"]);
        for (const removals of hint.removals) {
          let notes = (
            game.puzzleSolution[removals[0]][removals[1]].entry as number[]
          ).filter((x) => !removals.slice(2).includes(x));
          console.log("HELLO", notes);
          game.puzzleSolution[removals[0]][removals[1]] = {
            type: "note",
            entry: notes,
          };
        }
      } catch {
        break;
      }
    }
  } else {
    let notes: number[] = [];
    if (
      game.puzzleState[hint.removals[0][0]][hint.removals[0][1]].type === "note"
    ) {
      notes = (
        game.puzzleState[hint.removals[0][0]][hint.removals[0][1]]
          .entry as number[]
      ).filter((x) => !hint.removals[0].slice(2).includes(x));
    } else {
      console.log("This shouldn't happen");
    }
    game.puzzleSolution[hint.removals[0][0]][hint.removals[0][1]] = {
      type: "note",
      entry: notes,
    };
  }

  console.log(game);

  // Return a clone here so that this is a clone.
  return JSON.parse(JSON.stringify(game));
};
