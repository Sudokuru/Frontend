import { activeGame, drill, puzzle } from "../../../Types/Puzzle.Types";
import { Drills } from "../../../Functions/Api/Drills";
import { Puzzles } from "../../../Functions/Api/Puzzles";
import { makeBoard } from "../sudoku";
import {
  getDrillSolutionCells,
  parseApiAndAddNotes,
  strPuzzleToArray,
} from "./BoardFunctions";
import { List } from "immutable";

export async function generateGame(props: any) {
  let gameData = null;

  if (props.gameType == "StartGame") {
    gameData = await Puzzles.startGame(props.difficulty, props.strategies).then(
      (game: puzzle[]) => {
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
      },
    );
  } else if (props.gameType == "ResumeGame") {
    gameData = await Puzzles.getGame().then((game: activeGame[]) => {
      // If game object is not returned, you get redirected to Main Page
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(
        strPuzzleToArray(
          game[0].moves[game[0].moves.length - 1].puzzleCurrentState,
        ),
        game[0].puzzle,
      );
      board = parseApiAndAddNotes(
        board,
        game[0].moves[game[0].moves.length - 1].puzzleCurrentNotesState,
        false,
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
    let { board, originalBoard, puzzleSolution }: any = await Drills.getGame(
      props.strategies.toString(),
    ).then((game: drill) => {
      // null check to verify that game is loaded in.
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      let board = makeBoard(
        strPuzzleToArray(game.puzzleCurrentState),
        game.puzzleCurrentState,
      );
      board = parseApiAndAddNotes(board, game.puzzleCurrentNotesState, true);
      let originalBoard = makeBoard(
        strPuzzleToArray(game.puzzleCurrentState),
        game.puzzleCurrentState,
      );
      originalBoard = parseApiAndAddNotes(
        originalBoard,
        game.puzzleCurrentNotesState,
        true,
      );
      let puzzleSolution = game.puzzleSolution;
      return { board, originalBoard, puzzleSolution };
    });

    let drillSolutionCells = getDrillSolutionCells(
      board,
      puzzleSolution,
      props.strategies,
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
