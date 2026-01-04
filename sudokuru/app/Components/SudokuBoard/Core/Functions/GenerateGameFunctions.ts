import { getGame } from "../../../../Api/Puzzles";
import { AMATEUR_PUZZLES } from "../../../../Data/puzzles/amateur_puzzles";
import { GRANDMASTER_PUZZLES } from "../../../../Data/puzzles/grandmaster_puzzles";
import { LAYMAN_PUZZLES } from "../../../../Data/puzzles/layman_puzzles";
import { MASTER_PUZZLES } from "../../../../Data/puzzles/master_puzzles";
import { NOVICE_PUZZLES } from "../../../../Data/puzzles/novice_puzzles";
import { PROFESSIONAL_PUZZLES } from "../../../../Data/puzzles/professional_puzzles";
import { PROTEGE_PUZZLES } from "../../../../Data/puzzles/protege_puzzles";
import { PUNDIT_PUZZLES } from "../../../../Data/puzzles/pundit_puzzles";
import { TRAINEE_PUZZLES } from "../../../../Data/puzzles/trainee_puzzles";
import {
  InputPuzzle,
  BoardObjectProps,
  ClassicObjectProps,
} from "../../../../Functions/LocalDatabase";
import { ClassicBoard } from "../../SudokuBoard";
import { GameDifficulty } from "./DifficultyFunctions";
import { getSudokuHint } from "./HintFunctions";

export async function generateGame(
  props: ClassicBoard,
  initializeNotes: boolean,
): Promise<BoardObjectProps | null> {
  if (props.action === "StartGame") {
    // !uncomment below for dev testing
    // return returnGameOfDifficulty("dev", initializeNotes);
    return returnGameOfDifficulty(props.difficulty, initializeNotes);
  } else if (props.action === "ResumeGame") {
    const gameData: BoardObjectProps[] = await getGame(props.type);
    // If game object is not returned, you get redirected to Main Page
    if (gameData == null) {
      // If resume game data is invalid, we start a novice game
      return returnGameOfDifficulty("novice", initializeNotes);
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
const retrieveRandomPuzzle = (PUZZLES: InputPuzzle[]): InputPuzzle => {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @returns A Puzzle object
 */
export const returnPuzzleOfDifficulty = (
  difficulty: GameDifficulty | "dev",
): InputPuzzle => {
  switch (difficulty) {
    // "dev" difficulty is a custom difficulty that always returns the same puzzle.
    case "dev":
      return NOVICE_PUZZLES[0];
    case "novice":
      return retrieveRandomPuzzle(NOVICE_PUZZLES);
    case "amateur":
      return retrieveRandomPuzzle(AMATEUR_PUZZLES);
    case "layman":
      return retrieveRandomPuzzle(LAYMAN_PUZZLES);
    case "trainee":
      return retrieveRandomPuzzle(TRAINEE_PUZZLES);
    case "protege":
      return retrieveRandomPuzzle(PROTEGE_PUZZLES);
    case "professional":
      return retrieveRandomPuzzle(PROFESSIONAL_PUZZLES);
    case "pundit":
      return retrieveRandomPuzzle(PUNDIT_PUZZLES);
    case "master":
      return retrieveRandomPuzzle(MASTER_PUZZLES);
    case "grandmaster":
      return retrieveRandomPuzzle(GRANDMASTER_PUZZLES);
  }
};

/**
 * This function takes in the requested difficulty and returns a puzzle matching the difficulty.
 * @param difficulty The difficulty classification of the puzzle. (string)
 * @param initializeNotes Boolean to determine if notes should be initialized.
 * @returns A puzzle object that is readable by the Sudoku component.
 */
export const returnGameOfDifficulty = (
  difficulty: GameDifficulty | "dev",
  initializeNotes: boolean,
): BoardObjectProps => {
  const puzzles = returnPuzzleOfDifficulty(difficulty);
  if (difficulty === "dev") {
    difficulty = "novice";
  }
  return convertPuzzleToSudokuObject(puzzles, difficulty, initializeNotes);
};

/**
 * This function takes in a Puzzle object and returns a BoardObjectProps object.
 * @param puzzle Puzzle object
 */
export const convertPuzzleToSudokuObject = (
  puzzle: InputPuzzle,
  difficulty: GameDifficulty,
  initializeNotes: boolean,
): ClassicObjectProps => {
  let game: ClassicObjectProps = {
    variant: "classic",
    version: 1,
    selectedCells: [],
    puzzleState: [],
    puzzleSolution: [],
    statistics: {
      difficulty: difficulty,
      internalDifficulty: puzzle.d,
      numHintsUsed: 0,
      numHintsUsedPerStrategy: [],
      numWrongCellsPlayed: 0,
      score: 0,
      time: 0,
    },
    inNoteMode: false,
    actionHistory: [],
  };

  for (let i = 0; i < 9; i++) {
    game.puzzleState.push([]);
    game.puzzleSolution.push([]);
    for (let j = 0; j < 9; j++) {
      let charValuePuzzle = puzzle.p.charAt(i * 9 + j);
      let numValuePuzzle = Number(charValuePuzzle);
      if (numValuePuzzle === 0) {
        game.puzzleState[i][j] = { type: "value", entry: 0 };
      } else {
        game.puzzleState[i][j] = { type: "given", entry: numValuePuzzle };
      }

      let charValueSolution = puzzle.s.charAt(i * 9 + j);
      let numValueSolution = Number(charValueSolution);
      game.puzzleSolution[i][j] = numValueSolution;
    }
  }

  // Initialize the board with notes filled in
  if (initializeNotes) {
    const ALL_NOTES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    while (true) {
      try {
        let hint = getSudokuHint(
          game.puzzleState,
          ["AMEND_NOTES"],
          game.puzzleSolution,
        );
        // hint.removals structure: [row, col, note1, note2, ...]
        // slice(2) skips row and col to get just the notes to remove
        // Filter to keep only notes that shouldn't be removed
        const notesToAdd = ALL_NOTES.filter(
          (x) => !hint.removals[0].slice(2).includes(x),
        );
        game.puzzleState[hint.removals[0][0]][hint.removals[0][1]] = {
          type: "note",
          entry: notesToAdd,
        };
      } catch {
        // If getSudokuHint throws an exception, we've initialized
        // all possible notes and can exit the loop
        break;
      }
    }
  }

  // Return a clone here so that this is a clone.
  return JSON.parse(JSON.stringify(game));
};
