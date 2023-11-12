import { View } from "react-native";
import React from "react";
import { SudokuBoardProps } from "../../../Functions/LocalStore/DataStore/LocalDatabase";

interface PuzzleProps {
  renderCell: any;
  sudokuBoard: SudokuBoardProps;
  rightArrowClicked: any;
  leftArrowClicked: any;
  checkMarkClicked: any;
}

const Puzzle = (props: PuzzleProps) => {
  const { sudokuBoard, renderCell } = props;

  console.log(sudokuBoard.puzzle);

  const renderAllRows = [];
  for (let i = 0; i < 9; i++) {
    const rows = [];
    for (let j = 0; j < 9; j++) {
      console.log(i, j, sudokuBoard.puzzle[i][j]);
      rows.push(renderCell(sudokuBoard.puzzle[i][j], i, j));
    }
    renderAllRows.push(rows);
  }

  return (
    <View
      style={{
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {renderAllRows.map((rows, index) => (
          <View key={index}>{rows}</View>
        ))}
      </View>
    </View>
  );
};

export default Puzzle;
