import { View } from "react-native";
import React from "react";
import { SudokuObjectProps } from "../../../../Functions/LocalDatabase";
import { HintObjectProps } from "../../SudokuBoard";

interface PuzzleProps {
  RenderCell: (
    sudokuBoard: SudokuObjectProps,
    setSudokuBoard: React.Dispatch<
      React.SetStateAction<SudokuObjectProps | undefined>
    >,
    sudokuHint: HintObjectProps | undefined,
    r: number,
    c: number
  ) => JSX.Element | undefined;
  sudokuBoard: SudokuObjectProps;
  setSudokuBoard: React.Dispatch<
    React.SetStateAction<SudokuObjectProps | undefined>
  >;
  sudokuHint: HintObjectProps | undefined;
}

const Puzzle = (props: PuzzleProps) => {
  const { RenderCell, sudokuBoard, setSudokuBoard, sudokuHint } = props;

  const renderAllRows = [];
  for (let r = 0; r < 9; r++) {
    const rows = [];
    for (let c = 0; c < 9; c++) {
      rows.push(RenderCell(sudokuBoard, setSudokuBoard, sudokuHint, r, c));
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
