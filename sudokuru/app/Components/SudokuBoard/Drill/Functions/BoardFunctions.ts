import { saveGame } from "../../../../Api/Puzzles";
import { removeData } from "../../../../Functions/AsyncStorage";
import {
  BoardObjectProps,
  DrillGameStatistics,
  DrillObjectProps,
  GameVariant,
} from "../../../../Functions/LocalDatabase";
import { clonePuzzleState } from "../../Core/Functions/CloneFunctions";

// This function does nothing to override default classic function
export function finishSudokuGame(
  statistics: DrillGameStatistics,
  variant: GameVariant,
): DrillGameStatistics {
  removeData(`active_${variant}_game`);
  return statistics;
}

export function handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
  saveGame(sudokuBoard);
  navigation.navigate("DrillPage");
}

export function getInitialPuzzleState(sudokuBoard: DrillObjectProps) {
  return clonePuzzleState(sudokuBoard.initialPuzzleState);
}
