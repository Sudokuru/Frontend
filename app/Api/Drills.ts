import { calculateNotes, SudokuStrategy } from "sudokuru";
import { puzzle } from "./Puzzle.Types";
import { drill } from "./Puzzle.Types";
import { returnLocalDrillGame } from "../Functions/LocalDatabase";

/**
 * Functions to handle requesting drills
 */
export class Drills {
  /**
   * Drills.getGame retrieves the requested drill game from the device's local storage.
   * @param strategy the name of the sudoku strategy to retrieve the relevant drill.
   * @returns a drill object corresponding to the drill type being requested.
   */
  public static async getGame(strategy: SudokuStrategy): Promise<drill> {
    let data: puzzle = returnLocalDrillGame(strategy);
    let boardString: string = data.puzzle;
    let notes: string = calculateNotes(boardString);
    return {
      puzzleCurrentState: boardString,
      puzzleCurrentNotesState: notes,
      puzzleSolution: data.puzzleSolution,
    };
  }
}
