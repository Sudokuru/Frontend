import { getGame, startGame } from "../../../../Api/Puzzles";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { Board } from "../../SudokuBoard";

// todo break this up into multiple functions instead of the if statement based on board type
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
  } else {
    // temporary, will fix later.
    return startGame("novice", initializeNotes);
  }
  return gameData;
}
