import { saveGame } from "../../../../Api/Puzzles";
import { removeData } from "../../../../Functions/AsyncStorage";
import {
  BoardObjectProps,
  DrillGameStatistics,
  DrillObjectProps,
  GameVariant,
} from "../../../../Functions/LocalDatabase";
import { isEqual } from "./CellFunctions";

// This function does nothing to override default classic function
export function finishSudokuGame(
  statistics: DrillGameStatistics,
  variant: GameVariant,
): DrillGameStatistics {
  removeData(`active_${variant}_game`);
  return statistics;
}

export const isCellCorrect = (
  sudokuBoard: DrillObjectProps,
  r: number,
  c: number,
): boolean => {
  return (
    sudokuBoard.puzzleState[r][c].type ===
      sudokuBoard.puzzleSolution[r][c].type &&
    isEqual(
      sudokuBoard.puzzleState[r][c].entry,
      sudokuBoard.puzzleSolution[r][c].entry,
    )
  );
};

export function handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
  saveGame(sudokuBoard);
  navigation.navigate("DrillPage");
}
