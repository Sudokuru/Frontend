import React from "react";
import {
  CellLocation,
  BoardObjectProps,
} from "../../../../Functions/LocalDatabase";
import Cell from "./Cell";
import {
  useCellBackgroundColor,
  getCellBackgroundNotesColor,
  getCellNotesColor,
} from "../Functions/RenderCellFunctions";
import { HintObjectProps } from "../../SudokuBoard";
import { isBoardDisabled } from "../../SudokuBoardFunctions";
import { toggleSelectCell } from "../Functions/CellFunctions";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";
import { Theme } from "../../../../Styling/theme";

const RenderCell = (
  sudokuBoard: BoardObjectProps,
  setBoardSelectedCells: (cells: CellLocation[]) => void,
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number,
  boardMethods: SudokuVariantMethods,
  theme: Theme,
) => {
  const cell = sudokuBoard.puzzleState[r][c];
  const cellBackgroundColor = useCellBackgroundColor(
    sudokuBoard,
    sudokuHint,
    r,
    c,
    boardMethods.doesCellHaveConflict,
    theme,
  );
  const disable: boolean = isBoardDisabled(sudokuHint);
  const noteColor: string[] = getCellNotesColor(sudokuHint, r, c, theme);
  const backgroundNotesColor: string[] =
    getCellBackgroundNotesColor(cellBackgroundColor);

  return (
    <Cell
      disable={disable}
      onClick={(r: number, c: number, event: any) => {
        toggleSelectCell(
          sudokuBoard,
          setBoardSelectedCells,
          sudokuHint,
          r,
          c,
          event,
        );
      }}
      backgroundColor={cellBackgroundColor}
      noteColor={noteColor}
      backgroundNoteColor={backgroundNotesColor}
      type={cell.type}
      entry={cell.entry}
      key={r + ":" + c}
      c={c}
      r={r}
    />
  );
};

export default RenderCell;
