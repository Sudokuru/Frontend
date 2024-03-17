import { Puzzles } from "../../../Api/Puzzles";
import { SudokuObjectProps } from "../../../Functions/LocalDatabase";
import { SudokuBoardProps } from "../SudokuBoard";

export async function generateGame(props: SudokuBoardProps) {
  let gameData = null;

  if (props.action === "StartGame") {
    gameData = await Puzzles.startGame().then((game: SudokuObjectProps) => {
      return game;
    });
  } else if (props.action === "ResumeGame") {
    gameData = await Puzzles.getGame().then((game: SudokuObjectProps[]) => {
      // If game object is not returned, you get redirected to Main Page
      if (game == null) {
        //navigation.navigate("Home");
        return;
      }
      return game[0];
    });
  }
  return gameData;
}
