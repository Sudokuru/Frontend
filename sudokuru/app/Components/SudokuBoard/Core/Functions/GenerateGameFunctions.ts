import { getGame, startGame } from "../../../../Api/Puzzles";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { Board } from "../../SudokuBoard";

export async function generateGame(props: Board, initializeNotes: boolean) {
  let gameData = null;

  if (props.type === "classic") {
    if (props.action === "StartGame") {
      return startGame(props.difficulty, initializeNotes);
    } else if (props.action === "ResumeGame") {
      const gameData: SudokuObjectProps[] = await getGame();
      // If game object is not returned, you get redirected to Main Page
      if (gameData == null) {
        // If resume game data is invalid, we start a novice game
        return startGame("novice", initializeNotes);
      }
      return gameData[0];
    }
  }
  return gameData;
}
