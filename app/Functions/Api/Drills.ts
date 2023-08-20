import { calculateNotes, sudokuStrategy, sudokuStrategyArray } from "sudokuru";
import { activeGame, puzzle } from "../../Types/Puzzle.Types";
import { drill } from "../../Types/Puzzle.Types";
import { returnLocalDrillGame } from "../LocalStore/DataStore/LocalDatabase";

/**
 * Functions to handle requesting drills
 */
export class Drills {
  /**
   * Drills.getGame retrieves the requested drill game either from a remote database or from the device's local storage.
   * @param args can either by of type drillOfflineMode or drillOnlineMode, parameters for retrieving drills.
   * @returns a drill object corresponding to the drill type being requested.
   */
  public static async getGame(strategy: sudokuStrategy): Promise<drill> {
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
