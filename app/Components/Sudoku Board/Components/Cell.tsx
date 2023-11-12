import {
  finishGame,
  getCellNumber,
  getCellSize,
  replaceChar,
  saveGame,
} from "../Functions/BoardFunctions";
import React from "react";
import { PreferencesContext } from "../../../Contexts/PreferencesContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Set } from "immutable";
import {
  highlightCauses,
  highlightGroups,
  setPlacementHighlights,
  setRemovalHighlights,
} from "../Functions/HintsParsing";
import {
  NOT_SELECTED_CONFLICT_COLOR,
  PEER_SELECTED_COLOR,
  PLACE_NOTE_TEXT_COLOR,
  REMOVE_NOTE_TEXT_COLOR,
  SELECTED_COLOR,
  SELECTED_CONFLICT_COLOR,
  IDENTICAL_VALUE_COLOR,
} from "../../../Styling/HighlightColors";

let puzzleString = "";
let notesString = "";

const Cell = (props: any) => {
  const {
    value,
    onClick,
    isPeer,
    isBox,
    isRow,
    isColumn,
    isSelected,
    sameValue,
    prefilled,
    // notes,
    conflict,
    c,
    r,
    // inHintMode,
    // hintSteps,
    // currentStep,
    // game,
    // showResults,
    // gameType,
    // landingMode,
    // drillMode,
    // timer,
  } = props;
  const cellSize = getCellSize();

  let bgColor = "#808080";
  let isRemovalHighlight = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  let isPlacementHighlight = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const {
    isHighlightIdenticalValues,
    isHighlightBox,
    isHighlightRow,
    isHighlightColumn,
  } = React.useContext(PreferencesContext);

  const highlightPeers = isHighlightBox && isHighlightRow && isHighlightColumn;

  // if (inHintMode && currentStep > -1) {
  //   let currentHint = hintSteps[currentStep];

  //   // Highlight the cell if it is part of the hint
  //   if (highlightGroups(currentHint, y, x)) {
  //     bgColor = "white";
  //   }
  //   // Highlight the cell if it is part of the cause of the hint
  //   if (highlightCauses(currentHint, y, x)) {
  //     // If the hint is a placement, highlight the cell white, otherwise highlight it yellow
  //     // i.e. if the hint is a naked single, highlight the cell white, otherwise highlight it yellow
  //     if (currentHint.placements) {
  //       bgColor = "white";
  //     } else {
  //       bgColor = "#F2CA7E";
  //     }
  //   }
  //   // This handles just the styling, note deletion is not possible since the state would change during a render
  //   // Sets what notes should be highlighted for removal based on hint
  //   setRemovalHighlights(isRemovalHighlight, currentHint, y, x);

  //   // Sets what notes should be highlighted for placement based on hint
  //   setPlacementHighlights(isPlacementHighlight, currentHint, y, x);
  // }

  // if (!drillMode && !landingMode) {
  //   // Check and see if getCellNumber(x, y) is 0, if so, clear the puzzleString and notesString strings and then add the value of the cell to the puzzleString string, if null, add a 0
  //   if (getCellNumber(x, y) === 0) {
  //     puzzleString = "";
  //     notesString = "";
  //   }

  //   puzzleString += value ? value : 0;

  //   // Get the set of the notes for the cell, if null, add a 0, otherwise, add a 1 if the number is in the set, otherwise, add a 0.
  //   if (notes === null) {
  //     notesString += "000000000";
  //   } else {
  //     for (let i = 1; i <= 9; i++) {
  //       notesString += notes.has(i) ? 1 : 0;
  //     }
  //   }

  //   // Check and see if getCellNumber(x, y) is 80, if so, add the puzzleString and notesString strings to the activeGameData.moves array
  //   if (getCellNumber(x, y) === 80) {
  //     let flippedPuzzleString =
  //       "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

  //     // flip the puzzleString so it is correct orientation.
  //     for (let i = 0; i < puzzleString.length / 9; i++)
  //       for (let j = 0; j < puzzleString.length / 9; j++)
  //         flippedPuzzleString = replaceChar(
  //           flippedPuzzleString,
  //           puzzleString.charAt(j * 9 + i),
  //           j + i * 9
  //         );

  //     // If there's no moves in the moves array, add the current move to the moves array
  //     if (game.moves.length === 0) {
  //       game.moves.push({
  //         puzzleCurrentState: flippedPuzzleString,
  //         puzzleCurrentNotesState: notesString,
  //       });
  //       saveGame(game, timer);
  //     }

  //     // If there's a difference between the last move and the current move, replace previous move with current move
  //     else if (
  //       game.moves[0].puzzleCurrentState !== flippedPuzzleString ||
  //       game.moves[0].puzzleCurrentNotesState !== notesString
  //     ) {
  //       game.moves[0].puzzleCurrentState = flippedPuzzleString;
  //       game.moves[0].puzzleCurrentNotesState = notesString;
  //       saveGame(game, timer);
  //     }

  //     // If all cells are filled in with the correct values, we want to finish the game
  //     if (flippedPuzzleString == game.puzzleSolution && gameType != "Demo") {
  //       finishGame(showResults);
  //     }
  //   }
  // }

  // const getNoteContents = (noteVal: any) => {
  //   if (notes.has(noteVal)) {
  //     let styleVal = styles(cellSize).noteText;
  //     if (isRemovalHighlight[noteVal - 1])
  //       styleVal = styles(cellSize).removalNoteText;
  //     else if (isPlacementHighlight[noteVal - 1])
  //       styleVal = styles(cellSize).placementNoteText;

  //     return <Text style={styleVal}>{noteVal}</Text>;
  //   }
  // };

  // const getCellContents = () => {
  //   var contents = "";
  //   if (notes) {
  //     contents += "notes:";
  //     for (let i = 1; i <= 9; i++) {
  //       if (notes.has(i)) {
  //         contents += i.toString();
  //       }
  //     }
  //   } else if (value) {
  //     contents += "value:";
  //     contents += value.toString();
  //   }
  //   return contents;
  // };

  return (
    // Sudoku Cells
    <Pressable
      onPress={() => onClick(r, c)}
      // disabled={landingMode}
      style={{ outline: "none" }}
    >
      <View
        // testID={"cellr" + y + "c" + x + getCellContents()}
        style={[
          {
            height: cellSize ? cellSize : fallbackHeight,
            width: cellSize ? cellSize : fallbackHeight,
            display: "flex",
            justifyContent: "center",
            borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
            backgroundColor: "white",
          },
          r % 3 === 0 && {
            borderLeftWidth: cellSize ? cellSize * (3 / 40) : 40,
          },
          c % 3 === 0 && {
            borderTopWidth: cellSize ? cellSize * (3 / 40) : 40,
          },
          r === 8 && { borderRightWidth: cellSize ? cellSize * (3 / 40) : 40 },
          c === 8 && { borderBottomWidth: cellSize ? cellSize * (3 / 40) : 40 },

          // Border Highlighting
          // inHintMode && bgColor && { backgroundColor: bgColor },

          // !inHintMode && conflict && {styles(cellSize).conflict},
          // !inHintMode &&
          !conflict &&
            highlightPeers &&
            isPeer && {
              color: "#000000",
              backgroundColor: PEER_SELECTED_COLOR,
            },
          // !inHintMode &&
          !conflict &&
            !highlightPeers &&
            isHighlightBox &&
            isBox &&
            isPeer && {
              color: "#000000",
              backgroundColor: PEER_SELECTED_COLOR,
            },
          // !inHintMode &&
          //   !conflict &&
          !highlightPeers &&
            isHighlightRow &&
            isRow &&
            isPeer && {
              color: "#000000",
              backgroundColor: PEER_SELECTED_COLOR,
            },
          // !inHintMode &&
          //   !conflict &&
          !highlightPeers &&
            isHighlightColumn &&
            isColumn &&
            isPeer && {
              color: "#000000",
              backgroundColor: PEER_SELECTED_COLOR,
            },
          // !inHintMode &&
          //   !conflict &&
          //   sameValue &&
          //   isHighlightIdenticalValues &&
          //   styles(cellSize).sameValue,
          // !inHintMode &&
          //   conflict &&
          //   isSelected &&
          //   styles(cellSize).selectedConflict,
          // !inHintMode && !conflict && isSelected && styles(cellSize).selected,
        ]}
      >
        {/* {notes ? (
          <View style={styles(cellSize).noteViewParent}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <View style={styles(cellSize).noteViewElement} testID={"note1"}>
                  {getNoteContents(1)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note4"}>
                  {getNoteContents(4)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note7"}>
                  {getNoteContents(7)}
                </View>
              </View>
              <View>
                <View style={styles(cellSize).noteViewElement} testID={"note2"}>
                  {getNoteContents(2)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note5"}>
                  {getNoteContents(5)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note8"}>
                  {getNoteContents(8)}
                </View>
              </View>
              <View>
                <View style={styles(cellSize).noteViewElement} testID={"note3"}>
                  {getNoteContents(3)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note6"}>
                  {getNoteContents(6)}
                </View>
                <View style={styles(cellSize).noteViewElement} testID={"note9"}>
                  {getNoteContents(9)}
                </View>
              </View>
            </View>
          </View>
        ) : ( */}
        {/* value && ( */}
        {value != 0 ? (
          <Text
            style={[
              {
                fontFamily: "Inter_400Regular",
                fontSize: cellSize
                  ? cellSize * (3 / 4) + 1
                  : fallbackHeight * (3 / 4) + 1,
                textAlign: "center",
                lineHeight: cellSize ? cellSize : fallbackHeight,
              },
              conflict &&
                !isSelected && {
                  color: "#000000",
                  backgroundColor: NOT_SELECTED_CONFLICT_COLOR,
                },
              conflict &&
                isSelected && {
                  color: "#000000",
                  backgroundColor: SELECTED_CONFLICT_COLOR,
                },
            ]}
          >
            {value}
          </Text>
        ) : (
          <></>
        )}
        {/* ) */}
        {/* )} */}
      </View>
    </Pressable>
  );
};

let fallbackHeight = 30;

const styles = (cellSize?: number, themeColor?: any) =>
  StyleSheet.create({
    sameValue: {
      // styles for cells with sameValue prop
      color: "#000000",
      backgroundColor: IDENTICAL_VALUE_COLOR,
    },
    selected: {
      // styles for cells with isSelected prop
      color: "#000000",
      backgroundColor: SELECTED_COLOR,
    },
    noteViewParent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noteViewElement: {
      width: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
      height: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
      paddingLeft: cellSize ? cellSize / 20 : fallbackHeight / 20,
    },
    noteText: {
      fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
      fontFamily: "Inter_200ExtraLight",
    },
    removalNoteText: {
      fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
      fontFamily: "Inter_300Light",
      color: REMOVE_NOTE_TEXT_COLOR,
    },
    placementNoteText: {
      fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
      fontFamily: "Inter_300Light",
      color: PLACE_NOTE_TEXT_COLOR,
    },
  });

// Cell.propTypes = {
//   value: PropTypes.number,
//   onClick: PropTypes.func.isRequired,
//   isPeer: PropTypes.bool.isRequired,
//   isSelected: PropTypes.bool.isRequired,
//   sameValue: PropTypes.bool.isRequired,
//   prefilled: PropTypes.bool.isRequired,
//   notes: PropTypes.instanceOf(Set),
//   conflict: PropTypes.bool.isRequired,
//   eraseSelected: PropTypes.func.isRequired,
//   inHintMode: PropTypes.bool,
//   hintSteps: PropTypes.any,
//   currentStep: PropTypes.number,
// };

// Cell.defaultProps = {
//   notes: null,
//   value: null,
//   inHintMode: false,
// };

export default Cell;
