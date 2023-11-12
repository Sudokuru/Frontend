import { View } from "react-native";
import React from "react";
import { SudokuBoardProps } from "../../../Functions/LocalStore/DataStore/LocalDatabase";

interface PuzzleProps {
  renderCell: any;
  sudokuBoard: SudokuBoardProps;
}

const Puzzle = (props: PuzzleProps) => {
  const { sudokuBoard, renderCell } = props;

  const renderAllRows = [];
  for (let c = 0; c < 9; c++) {
    const rows = [];
    for (let r = 0; r < 9; r++) {
      rows.push(renderCell(sudokuBoard.puzzle[c][r], r, c));
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
