import { calculateNotes, sudokuStrategy, sudokuStrategyArray } from "sudokuru";
import { activeGame, puzzle } from "../../Types/Puzzle.Types";
import { drill } from "../../Types/Puzzle.Types";
import { returnLocalDrillGame } from "../LocalStore/LocalDatabase";

const GET_DRILL_GAME: string = "api/v1/drillGames?drillStrategies[]=";

export interface drillOfflineMode {
  mode: getDrillMode.Offline;
  strategy: sudokuStrategy;
}

export interface drillOnlineMode {
  mode: getDrillMode.Online;
  strategy: sudokuStrategy;
  url: string;
  token: string;
}

export enum getDrillMode {
  Offline,
  Online,
}

let value: drillOfflineMode | drillOnlineMode = {
  mode: getDrillMode.Offline,
  strategy: "AMEND_NOTES",
};

/**
 * Functions to handle requesting drills
 */
export class Drills {
  /**
   * Drills.getGame retrieves the requested drill game either from a remote database or from the device's local storage.
   * @param args can either by of type drillOfflineMode or drillOnlineMode, parameters for retrieving drills.
   * @returns a drill object corresponding to the drill type being requested.
   */
  public static async getGame(
    args: drillOfflineMode | drillOnlineMode
  ): Promise<drill> {
    // retrieve drill if we are in online mode
    if (args.mode === getDrillMode.Online) {
      console.log("ONLINE MODE");
      const res: Response = await fetch(
        args.url + GET_DRILL_GAME + args.strategy,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + args.token,
          },
        }
      );

      if (res.status === 200) {
        let data: activeGame[] = await res.json();
        let boardString: string = data[0].puzzle;
        let notes: string = calculateNotes(boardString);
        return {
          puzzleCurrentState: boardString,
          puzzleCurrentNotesState: notes,
          puzzleSolution: data[0].puzzleSolution,
        };
      } else if (res.status === 404) {
        return JSON.parse("{}");
      } else {
        console.log(
          "Error: " + GET_DRILL_GAME + " GET request has status " + res.status
        );
        return JSON.parse("{}");
      }
    }

    // retrieve drill if we are in offline mode
    else if (args.mode === getDrillMode.Offline) {
      console.log("OFFLINE MODE!");
      console.log(args.strategy.toString());
      let strategy = args.strategy;
      let data: puzzle = returnLocalDrillGame(args.strategy);
      console.log("HIII");
      let boardString: string = data.puzzle;
      console.log(boardString);
      let notes: string = calculateNotes(boardString);
      console.log("GREETINGS");
      return {
        puzzleCurrentState: boardString,
        puzzleCurrentNotesState: notes,
        puzzleSolution: data.puzzleSolution,
      };
    }
    return JSON.parse("{}");
  }
}
