import { getKeyString } from "../../../Functions/AsyncStorage/token";
import { makeBoard } from "../sudoku";
import {
  getDrillSolutionCells,
  parseApiAndAddNotes,
  strPuzzleToArray,
} from "./BoardFunctions";
import { List } from "immutable";
import { Puzzles, Drills, drill } from "sudokuru";

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
    ).then((game) => {
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
    gameData = await Puzzles.getGame(url, token).then((game) => {
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
    let token: string = "";
    await getKeyString("access_token").then((result) => {
      token = result ? result : "";
    });

    let { board, originalBoard, puzzleSolution }: any = await Drills.getGame(
      url,
      props.strategies,
      token
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
