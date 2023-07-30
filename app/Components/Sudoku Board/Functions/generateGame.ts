import { getKeyString } from "../../../Functions/AsyncStorage/AsyncStorage";
import { activeGame, drill, puzzle } from "../../../Types/Puzzle.Types";
import {
  Drills,
  drillOfflineMode,
  drillOnlineMode,
  getDrillMode,
} from "../../../Functions/Api/Drills";
import { Puzzles } from "../../../Functions/Api/Puzzles";
import { makeBoard } from "../sudoku";
import {
  getDrillSolutionCells,
  parseApiAndAddNotes,
  strPuzzleToArray,
} from "./BoardFunctions";
import { List } from "immutable";

export async function generateGame(url: any, props: any) {
  let token: string = "";

  await getKeyString("access_token").then((result) => {
    if (result) {
      token = result;
    }
  });

  let gameData = null;

  if (props.gameType == "StartGame") {
    gameData = await Puzzles.startGame(
      url,
      props.difficulty,
      props.strategies,
      token
    ).then((game: puzzle[]) => {
      // If game object is not returned, you get redirected to Main Page
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(strPuzzleToArray(game[0].puzzle), game[0].puzzle);
      return {
        board,
        history: List.of(board),
        historyOffSet: 0,
        solution: game[0].puzzleSolution,
        activeGame: game,
      };
    });
  } else if (props.gameType == "ResumeGame") {
    gameData = await Puzzles.getGame(url, token).then((game: activeGame[]) => {
      // If game object is not returned, you get redirected to Main Page
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(
        strPuzzleToArray(
          game[0].moves[game[0].moves.length - 1].puzzleCurrentState
        ),
        game[0].puzzle
      );
      board = parseApiAndAddNotes(
        board,
        game[0].moves[game[0].moves.length - 1].puzzleCurrentNotesState,
        false
      );
      return {
        board,
        history: List.of(board),
        historyOffSet: 0,
        solution: game[0].puzzleSolution,
        activeGame: game,
      };
    });
  } else if (props.gameType == "StartDrill") {
    // by default we are in offline mode for retrieving drills.
    let DRILL_MODE = getDrillMode.Offline;
    let drillGetGameArgs: drillOfflineMode | drillOnlineMode;

    // initializing value to be offline by default
    drillGetGameArgs = {
      mode: getDrillMode.Offline,
      strategy: props.strategies.toString(),
    };

    // retrieve necessary values if we are in online mode for the Drill request.
    if (DRILL_MODE.valueOf() === getDrillMode.Online) {
      let token: string = "";
      await getKeyString("access_token").then((result) => {
        token = result ? result : "";
      });

      drillGetGameArgs = {
        mode: getDrillMode.Online,
        strategy: props.strategies.toString(),
        token: token,
        url: url,
      };
    }

    console.log(drillGetGameArgs);

    let { board, originalBoard, puzzleSolution }: any = await Drills.getGame(
      drillGetGameArgs
    ).then((game: drill) => {
      // null check to verify that game is loaded in.
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(
        strPuzzleToArray(game.puzzleCurrentState),
        game.puzzleCurrentState
      );
      board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState, true);
      let originalBoard = makeBoard(
        strPuzzleToArray(game.puzzleCurrentState),
        game.puzzleCurrentState
      );
      originalBoard = parseApiAndAddNotes(
        originalBoard,
        game.puzzleCurrentNotesState,
        true
      );
      let puzzleSolution = game.puzzleSolution;
      return { board, originalBoard, puzzleSolution };
    });

    let drillSolutionCells = getDrillSolutionCells(
      board,
      puzzleSolution,
      props.strategies
    );

    return {
      board,
      history: List.of(board),
      historyOffSet: 0,
      drillSolutionCells,
      originalBoard,
      solution: puzzleSolution,
    };
  } else if (props.gameType == "Demo") {
    let game = Puzzles.getRandomGame();
    let board = makeBoard(strPuzzleToArray(game[0].puzzle), game[0].puzzle);
    return {
      board,
      history: List.of(board),
      historyOffSet: 0,
      solution: game[0].puzzleSolution,
      activeGame: game,
    };
  }

  return gameData;
}
