import { View } from "react-native";
import React, { JSX } from "react";
import {
  CellLocation,
  BoardObjectProps,
} from "../../../../Functions/LocalDatabase";
import { HintObjectProps } from "../../SudokuBoard";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";

interface PuzzleProps {
  RenderCell: (
    sudokuBoard: BoardObjectProps,
    setBoardSelectedCells: (cells: CellLocation[]) => void,
    sudokuHint: HintObjectProps | undefined,
    r: number,
    c: number,
    boardMethods: SudokuVariantMethods,
  ) => JSX.Element | undefined;
  sudokuBoard: BoardObjectProps;
  setBoardSelectedCells: (cells: CellLocation[]) => void;
  sudokuHint: HintObjectProps | undefined;
  boardMethods: SudokuVariantMethods;
}

const Puzzle = (props: PuzzleProps) => {
  const {
    RenderCell,
    sudokuBoard,
    setBoardSelectedCells,
    sudokuHint,
    boardMethods,
  } = props;

  const renderAllRows = [];
  for (let r = 0; r < 9; r++) {
    const rows = [];
    for (let c = 0; c < 9; c++) {
      rows.push(
        RenderCell(
          sudokuBoard,
          setBoardSelectedCells,
          sudokuHint,
          r,
          c,
          boardMethods,
        ),
      );
    }
    renderAllRows.push(rows);
  }

  return (
    <>
      {renderAllRows.map((rows, index) => (
        <View style={{ flexDirection: "row" }} key={index}>
          {rows}
        </View>
      ))}
    </>
  );
};

export default Puzzle;
