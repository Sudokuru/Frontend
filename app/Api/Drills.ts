import { calculateNotes, sudokuStrategy } from "sudokuru";

import { puzzle, drill } from "./Puzzle.Types";
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
  public static async getGame(strategy: sudokuStrategy): Promise<drill> {
    const data: puzzle = returnLocalDrillGame(strategy);
    const boardString: string = data.puzzle;
    const notes: string = calculateNotes(boardString);
    return {
      puzzleCurrentState: boardString,
      puzzleCurrentNotesState: notes,
      puzzleSolution: data.puzzleSolution,
    };
  }
}
