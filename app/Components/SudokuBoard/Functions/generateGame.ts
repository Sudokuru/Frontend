import { getGame, startGame } from "../../../Api/Puzzles";
import { SudokuObjectProps } from "../../../Functions/LocalDatabase";
import { SudokuBoardProps } from "../SudokuBoard";

export async function generateGame(props: SudokuBoardProps) {
  let gameData = null;

  if (props.action == "StartGame") {
    return startGame(props.difficulty);
  } else if (props.action == "ResumeGame") {
    gameData = await getGame().then((game: SudokuObjectProps[]) => {
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
