import { View } from "react-native";
import PropTypes from "prop-types";
import React from "react";

const Puzzle = (props: any) => {
  const { board, renderCell } = props;

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
