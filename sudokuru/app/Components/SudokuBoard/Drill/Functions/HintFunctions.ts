import { SudokuStrategy } from "sudokuru";
import { DrillObjectProps } from "../../../../Functions/LocalDatabase";
import { getSudokuHint } from "../../Core/Functions/HintFunctions";
import { clonePuzzleState } from "../../Core/Functions/CloneFunctions";

/**
 * Retrieves a hint using the initial puzzle state and drill difficulty.
 * Returns a new board with a copied initial state and new statistics marked as having used a hint.
 * The input board is not mutated.
 * @param sudokuBoard - current drill board state including initial puzzle state and statistics
 * @param strategyArray - strategy array (not used for drill hints, difficulty is used instead)
 * @returns The hint and a new board reset for hint guidance
 */
export const getSudokuBoardHint = (
  sudokuBoard: DrillObjectProps,
  strategyArray: SudokuStrategy[],
) => {
  const hint = getSudokuHint(sudokuBoard.initialPuzzleState, [
    sudokuBoard.statistics.difficulty,
  ]);

  return {
    hint,
    updatedBoard: {
      ...sudokuBoard,
      puzzleState: clonePuzzleState(sudokuBoard.initialPuzzleState),
      statistics: {
        ...sudokuBoard.statistics,
        hintUsed: true,
      },
    },
  };
};
