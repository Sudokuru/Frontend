import { SudokuStrategy } from "sudokuru";
import { DrillObjectProps } from "../../../../Functions/LocalDatabase";
import { getSudokuHint } from "../../Core/Functions/HintFunctions";

/**
 * Retrieves a hint for the current drill puzzle and resets the puzzle state to the initial state.
 * The hint is generated using the initial puzzle state and the drill's difficulty level as the strategy.
 * The puzzle state is reset to allow the user to practice solving from the beginning with the hint guidance.
 * @param sudokuBoard - current drill board state including initial puzzle state and statistics
 * @param strategyArray - strategy array (not used for drill hints, difficulty is used instead)
 * @returns Object containing the hint information and the updated board with reset puzzle state and hintUsed flag
 */
export const getSudokuBoardHint = (
  sudokuBoard: DrillObjectProps,
  strategyArray: SudokuStrategy[],
) => {
  const hint = getSudokuHint(sudokuBoard.initialPuzzleState, [
    sudokuBoard.statistics.difficulty,
  ]);
  sudokuBoard.statistics.hintUsed = true;

  return {
    hint,
    updatedBoard: {
      ...sudokuBoard,
      puzzleState: JSON.parse(JSON.stringify(sudokuBoard.initialPuzzleState)),
    },
  };
};
