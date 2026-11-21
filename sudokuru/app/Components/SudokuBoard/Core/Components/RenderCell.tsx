import React from "react";
import {
  ActiveHintState,
  CellLocation,
  BoardObjectProps,
} from "../../../../Functions/LocalDatabase";
import Cell from "./Cell";
import {
  useCellBackgroundColor,
  getCellBackgroundNotesColor,
  getCellNotesColor,
} from "../Functions/RenderCellFunctions";
import { isBoardDisabled } from "../../SudokuBoardFunctions";
import { toggleSelectCell } from "../Functions/CellFunctions";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";
import { Theme } from "../../../../Styling/theme";
import {
  FOCUS_BACKGROUND_FOG,
  getFocusBackgroundOption,
} from "../../../../Functions/FocusBackgrounds";

const RenderCell = (
  sudokuBoard: BoardObjectProps,
  setBoardSelectedCells: (cells: CellLocation[]) => void,
  sudokuHint: ActiveHintState | null,
  r: number,
  c: number,
  boardMethods: SudokuVariantMethods,
  theme: Theme,
  focusBackground?: string,
) => {
  const cell = sudokuBoard.puzzleState[r][c];
  const displayHint = boardMethods.getDisplayHint(sudokuBoard);
  const cellBackgroundColor = useCellBackgroundColor(
    sudokuBoard,
    displayHint,
    r,
    c,
    boardMethods.doesCellHaveConflict,
    theme,
  );
  const disable: boolean = isBoardDisabled(sudokuHint);
  const noteColor: string[] = getCellNotesColor(displayHint, r, c, theme);
  const backgroundNotesColor: string[] =
    getCellBackgroundNotesColor(cellBackgroundColor);

  const backgroundOption = getFocusBackgroundOption(focusBackground);
  return (
    <Cell
      masked={!boardMethods.isCellExposed(sudokuBoard, r, c)}
      maskedBackgroundColor={
        backgroundOption.style === "plain"
          ? FOCUS_BACKGROUND_FOG[backgroundOption.color].fog
          : "transparent"
      }
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
