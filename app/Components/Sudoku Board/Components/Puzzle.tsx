import { getCellSize } from "../Functions/BoardFunctions";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const Puzzle = (props: any) => {
  const { board, renderCell } = props;
  const cellSize = getCellSize();

  console.log(board);

  return (
    <View style={styles(cellSize).hintAndPuzzleContainer}>
      <View style={styles().boardContainer}>
        {board
          .get("puzzle")
          .map((row: any, i: any) => (
            <View key={i}>
              {row.map((cell: any, j: any) => renderCell(cell, i, j)).toArray()}
            </View>
          ))
          .toArray()}
      </View>
    </View>
  );
};

const styles = (cellSize?: number, themeColor?: any) =>
  StyleSheet.create({
    hintAndPuzzleContainer: {
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    boardContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
    },
  });

Puzzle.propTypes = {
  board: PropTypes.any,
  inHintMode: PropTypes.bool,
  renderCell: PropTypes.func.isRequired,
  rightArrowClicked: PropTypes.func.isRequired,
  leftArrowClicked: PropTypes.func.isRequired,
  checkMarkClicked: PropTypes.func.isRequired,
  onFirstStep: PropTypes.bool,
  onFinalStep: PropTypes.bool,
};

export default Puzzle;
