import React from "react";
import { View } from "react-native";

import { CellProps, SudokuObjectProps } from "../../../Functions/LocalDatabase";

interface PuzzleProps {
  renderCell: (
    cell: CellProps,
    r: number,
    c: number,
  ) => JSX.Element | undefined;
  sudokuBoard: SudokuObjectProps;
}

const Puzzle = (props: PuzzleProps) => {
  const { sudokuBoard, renderCell } = props;

  const renderAllRows = [];
  for (let r = 0; r < 9; r++) {
    const rows = [];
    for (let c = 0; c < 9; c++) {
      rows.push(renderCell(sudokuBoard.puzzle[r][c], r, c));
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
