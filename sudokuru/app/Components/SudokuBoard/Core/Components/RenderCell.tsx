import React from "react";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import Cell from "./Cell";
import {
  getCellBackgroundColor,
  getCellBackgroundNotesColor,
  getCellNotesColor,
} from "../Functions/RenderCellFunctions";
import { HintObjectProps } from "../../SudokuBoard";
import { isBoardDisabled, toggleSelectCell } from "../../SudokuBoardFunctions";

const RenderCell = (
  sudokuBoard: SudokuObjectProps,
  setSudokuBoard: React.Dispatch<
    React.SetStateAction<SudokuObjectProps | undefined>
  >,
  sudokuHint: HintObjectProps | undefined,
  r: number,
  c: number
) => {
  const cell = sudokuBoard.puzzle[r][c];
  const cellBackgroundColor = getCellBackgroundColor(
    sudokuBoard,
    sudokuHint,
    r,
    c
  );
  const disable: boolean = isBoardDisabled(sudokuHint);
  const noteColor: string[] = getCellNotesColor(sudokuHint, r, c);
  const backgroundNotesColor: string[] =
    getCellBackgroundNotesColor(cellBackgroundColor);

  return (
    <Cell
      disable={disable}
      onClick={(r: number, c: number, event: any) => {
        toggleSelectCell(sudokuBoard, setSudokuBoard, sudokuHint, r, c, event);
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
