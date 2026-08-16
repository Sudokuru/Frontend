import { View } from "react-native";
import React, { JSX } from "react";
import {
  ActiveHintState,
  CellLocation,
  BoardObjectProps,
} from "../../../../Functions/LocalDatabase";
import { SudokuVariantMethods } from "../../SudokuBoardSharedFunctionsController";
import { Theme } from "../../../../Styling/theme";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface PuzzleProps {
  RenderCell: (
    sudokuBoard: BoardObjectProps,
    setBoardSelectedCells: (cells: CellLocation[]) => void,
    sudokuHint: ActiveHintState | null,
    r: number,
    c: number,
    boardMethods: SudokuVariantMethods,
    theme: Theme,
  ) => JSX.Element | undefined;
  sudokuBoard: BoardObjectProps;
  setBoardSelectedCells: (cells: CellLocation[]) => void;
  sudokuHint: ActiveHintState | null;
  boardMethods: SudokuVariantMethods;
}

const Puzzle = (props: PuzzleProps) => {
  const { theme } = useTheme();
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
          theme,
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
