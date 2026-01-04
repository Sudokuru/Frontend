import { SUDOKU_STRATEGY_ARRAY, SudokuStrategy } from "sudokuru";
import { OBVIOUS_SINGLE_DRILLS } from "../../../../Data/drills/obvious_single_drills";
import { HIDDEN_SINGLE_DRILLS } from "./../../../../Data/drills/hidden_single_drills";
import {
  BoardObjectProps,
  DrillObjectProps,
} from "../../../../Functions/LocalDatabase";
import { DrillBoard } from "../../SudokuBoard";
import { getSudokuHint } from "../../Core/Functions/HintFunctions";
import { DrillStrategy } from "../../../Home/DrillPanel";
import { OBVIOUS_PAIR_DRILLS } from "../../../../Data/drills/obvious_pair_drills";
import { OBVIOUS_TRIPLET_DRILLS } from "../../../../Data/drills/obvious_triplet_drills";
import { OBVIOUS_QUADRUPLET_DRILLS } from "../../../../Data/drills/obvious_quadruplet_drills";
import { HIDDEN_TRIPLET_DRILLS } from "../../../../Data/drills/hidden_triplet_drills";
import { HIDDEN_QUADRUPLET_DRILLS } from "../../../../Data/drills/hidden_quadruplet_drills";
import { getGame } from "../../../../Api/Puzzles";
import { HIDDEN_PAIR_DRILLS } from "../../../../Data/drills/hidden_pair_drills";
import { POINTING_PAIR_DRILLS } from "../../../../Data/drills/pointing_pair_drills";
import { POINTING_TRIPLET_DRILLS } from "../../../../Data/drills/pointing_triplet_drills";

export async function generateGame(
  props: DrillBoard,
  _initializeNotes = true,
): Promise<BoardObjectProps | null> {
  if (props.action === "StartGame") {
    return returnDrillOfStrategy(props.strategy);
    // !uncomment below for dev testing
    // return returnDrillOfType("dev");
  } else if (props.action === "ResumeGame") {
    const gameData: BoardObjectProps[] = await getGame(props.type);
    // If game object is not returned, you get redirected to Main Page
    if (gameData == null) {
      // If resume game data is invalid, we start a novice game
      return returnDrillOfStrategy("OBVIOUS_SINGLE");
    }
    return gameData[0];
  }
  return null;
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
export const returnDrillOfType = (strategy: DrillStrategy | "dev"): string => {
  switch (strategy) {
    case "dev":
      return retrieveRandomDrillPuzzle(OBVIOUS_SINGLE_DRILLS);
    case "OBVIOUS_SINGLE":
      return retrieveRandomDrillPuzzle(OBVIOUS_SINGLE_DRILLS);
    case "OBVIOUS_PAIR":
      return retrieveRandomDrillPuzzle(OBVIOUS_PAIR_DRILLS);
    case "OBVIOUS_TRIPLET":
      return retrieveRandomDrillPuzzle(OBVIOUS_TRIPLET_DRILLS);
    case "OBVIOUS_QUADRUPLET":
      return retrieveRandomDrillPuzzle(OBVIOUS_QUADRUPLET_DRILLS);
    case "HIDDEN_SINGLE":
      return retrieveRandomDrillPuzzle(HIDDEN_SINGLE_DRILLS);
    case "HIDDEN_PAIR":
      return retrieveRandomDrillPuzzle(HIDDEN_PAIR_DRILLS);
    case "HIDDEN_TRIPLET":
      return retrieveRandomDrillPuzzle(HIDDEN_TRIPLET_DRILLS);
    case "HIDDEN_QUADRUPLET":
      return retrieveRandomDrillPuzzle(HIDDEN_QUADRUPLET_DRILLS);
    case "POINTING_PAIR":
      return retrieveRandomDrillPuzzle(POINTING_PAIR_DRILLS);
    case "POINTING_TRIPLET":
      return retrieveRandomDrillPuzzle(POINTING_TRIPLET_DRILLS);
  }
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @param initializeNotes Boolean to determine if notes should be initialized.
 * @returns A puzzle object that is readable by the Sudoku component.
 */
export const returnDrillOfStrategy = (
  strategy: DrillStrategy | "dev",
): BoardObjectProps => {
  const puzzles = returnDrillOfType(strategy);
  if (strategy === "dev") {
    strategy = "OBVIOUS_SINGLE";
  }
  return convertPuzzleToSudokuObject(puzzles, strategy);
};

/**
 * Creates an empty drill game object with initialized structure
 */
const createEmptyDrillGame = (strategy: DrillStrategy): DrillObjectProps => {
  return {
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
};

/**
 * Parses a puzzle string and populates the game board
 * @param puzzle String representation of the puzzle (81 characters, 0 = empty, 1-9 = given)
 * @param game The game object to populate
 */
const parsePuzzleStringIntoBoard = (
  puzzle: string,
  game: DrillObjectProps,
): void => {
  for (let row = 0; row < 9; row++) {
    game.puzzleState.push([]);
    game.puzzleSolution.push([]);
    game.initialPuzzleState.push([]);

    for (let col = 0; col < 9; col++) {
      const charValue = puzzle.charAt(row * 9 + col);
      const numValue = Number(charValue);

      if (numValue === 0) {
        // Empty cell
        game.puzzleState[row][col] = { type: "value", entry: 0 };
        game.puzzleSolution[row][col] = { type: "value", entry: 0 };
        game.initialPuzzleState[row][col] = { type: "value", entry: 0 };
      } else {
        // Given cell
        game.puzzleState[row][col] = { type: "given", entry: numValue };
        game.puzzleSolution[row][col] = { type: "given", entry: numValue };
        game.initialPuzzleState[row][col] = { type: "given", entry: numValue };
      }
    }
  }
};

/**
 * Creates strategy array with the target drill strategy positioned correctly
 * The drill strategy is placed immediately after AMEND_NOTES and SIMPLIFY_NOTES
 */
const createDrillStrategyArray = (
  strategy: DrillStrategy,
): SudokuStrategy[] => {
  const drillArray = SUDOKU_STRATEGY_ARRAY.filter((s) => s !== strategy);
  const insertIndex = drillArray.indexOf("OBVIOUS_SINGLE");
  drillArray.splice(insertIndex, 0, strategy);
  return drillArray;
};

/**
 * Calculates remaining notes after removing specified notes from a cell
 */
const calculateRemainingNotes = (
  game: DrillObjectProps,
  removal: number[],
  allNotes: number[],
): number[] => {
  const [row, col, ...notesToRemove] = removal;
  const currentCell = game.puzzleState[row][col];

  if (currentCell.type === "note") {
    return currentCell.entry.filter((note) => !notesToRemove.includes(note));
  }

  // For AMEND_NOTES strategy, start with all notes
  return allNotes.filter((note) => !notesToRemove.includes(note));
};

/**
 * Applies note removals to all affected cells in the game state
 */
const applyNoteRemovals = (
  game: DrillObjectProps,
  removals: number[][],
  notes: number[],
): void => {
  for (const removal of removals) {
    const [row, col] = removal;
    const noteCell = { type: "note" as const, entry: notes };

    game.puzzleState[row][col] = noteCell;
    game.puzzleSolution[row][col] = noteCell;
    game.initialPuzzleState[row][col] = noteCell;
  }
};

/**
 * Progressively fills in notes by applying hints until reaching the target strategy
 */
const initializeBoardWithNotes = (
  game: DrillObjectProps,
  strategy: DrillStrategy,
): void => {
  const drillArray = createDrillStrategyArray(strategy);
  const ALL_NOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  while (true) {
    try {
      const hint = getSudokuHint(game.puzzleState, drillArray);

      // Stop when we reach the target drill strategy
      if (hint.strategy === strategy) {
        break;
      }

      // Calculate notes for the first removal cell
      const notes = calculateRemainingNotes(game, hint.removals[0], ALL_NOTES);

      // Apply the note removals to all affected cells
      applyNoteRemovals(game, hint.removals, notes);
    } catch (e) {
      // Exception means all possible notes have been initialized
      console.log("Note initialization complete:", e);
      break;
    }
  }
};

/**
 * Finalizes the solution for OBVIOUS_SINGLE strategy
 * Places the value and simplifies surrounding notes
 */
const finalizeSolutionForObviousSingle = (
  game: DrillObjectProps,
  hint: any,
): void => {
  const [row, col, value] = hint.placements[0];
  game.puzzleSolution[row][col] = { type: "value", entry: value };

  // Simplify notes in cells affected by the placement
  while (true) {
    try {
      const simplifyHint = getSudokuHint(game.puzzleSolution, [
        "SIMPLIFY_NOTES",
      ]);

      for (const removal of simplifyHint.removals) {
        const [r, c, ...notesToRemove] = removal;
        const currentNotes = game.puzzleSolution[r][c].entry as number[];
        const filteredNotes = currentNotes.filter(
          (note) => !notesToRemove.includes(note),
        );

        game.puzzleSolution[r][c] = { type: "note", entry: filteredNotes };
      }
    } catch {
      // No more notes to simplify
      break;
    }
  }
};

/**
 * Finalizes the solution for note-based strategies (pairs, triplets, etc.)
 * Removes the notes identified by the strategy
 */
const finalizeSolutionForNoteStrategy = (
  game: DrillObjectProps,
  hint: any,
): void => {
  for (const removal of hint.removals) {
    const [row, col, ...notesToRemove] = removal;
    const currentCell = game.puzzleState[row][col];

    if (currentCell.type === "note") {
      const filteredNotes = currentCell.entry.filter(
        (note) => !notesToRemove.includes(note),
      );
      game.puzzleSolution[row][col] = { type: "note", entry: filteredNotes };
    } else {
      console.warn(
        `Unexpected cell type at [${row}, ${col}]: expected 'note', got '${currentCell.type}'`,
      );
    }
  }
};

/**
 * Finalizes the puzzle solution based on the strategy type
 */
const finalizeDrillSolution = (
  game: DrillObjectProps,
  strategy: DrillStrategy,
): void => {
  const hint = getSudokuHint(game.puzzleState, [strategy]);

  if (strategy === "OBVIOUS_SINGLE") {
    finalizeSolutionForObviousSingle(game, hint);
  } else {
    finalizeSolutionForNoteStrategy(game, hint);
  }
};

/**
 * Converts a puzzle string into a complete drill game object
 * @param puzzle String representation of the puzzle (81 characters)
 * @param strategy The drill strategy to train
 * @returns A complete drill game object with solution
 */
export const convertPuzzleToSudokuObject = (
  puzzle: string,
  strategy: DrillStrategy,
): DrillObjectProps => {
  const game = createEmptyDrillGame(strategy);
  parsePuzzleStringIntoBoard(puzzle, game);
  initializeBoardWithNotes(game, strategy);
  finalizeDrillSolution(game, strategy);

  // Return a deep clone to prevent mutations
  return JSON.parse(JSON.stringify(game));
};
