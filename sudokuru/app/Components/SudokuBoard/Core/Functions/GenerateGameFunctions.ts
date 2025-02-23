import { getGame, startGame } from "../../../../Api/Puzzles";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { SudokuBoardProps } from "../../SudokuBoard";

export async function generateGame(props: SudokuBoardProps) {
  let gameData = null;

  if (props.action == "StartGame") {
    return startGame(props.difficulty);
  } else if (props.action == "ResumeGame") {
    const gameData: SudokuObjectProps[] = await getGame();
    // If game object is not returned, you get redirected to Main Page
    if (gameData == null) {
      // If resume game data is invalid, we start a novice game
      return startGame("novice");
    }
    return gameData[0];
  }
  return gameData;
}
