import { Puzzles } from "../../../Functions/Api/Puzzles";
import { SudokuBoardProps } from "../../../Functions/LocalStore/DataStore/LocalDatabase";

export async function generateGame(props: any) {
  let gameData = null;

  if (props.gameType == "StartGame") {
    gameData = await Puzzles.startGame(props.difficulty, props.strategies).then(
      (game: SudokuBoardProps) => {
        // If game object is not returned, you get redirected to Main Page
        if (game == null) {
          //navigation.navigate("Home");
          return;
        }
        return game;
      }
    );
  } else if (props.gameType == "ResumeGame") {
    gameData = await Puzzles.getGame().then((game: SudokuBoardProps[]) => {
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
