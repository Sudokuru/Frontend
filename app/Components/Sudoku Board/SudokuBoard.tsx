// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Set } from "immutable";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { saveGame } from "./Functions/BoardFunctions";

import {
  highlightBox,
  highlightColumn,
  highlightRow,
  isPeer as areCoordinatePeers,
} from "./sudoku";

import { useFocusEffect } from "@react-navigation/core";
import { ActivityIndicator, useTheme } from "react-native-paper";
import NumberControl from "./Components/NumberControl";
import {
  checkSolution,
  formatTime,
  getCausesFromHint,
  getCellNumber,
  getCellSize,
  getGroupsFromHint,
  getNumberOfGroupsAssignedForNumber,
  getPlacementsFromHint,
  getRemovalsFromHint,
  updateBoardWithNumber,
  getNextHint,
} from "./Functions/BoardFunctions";
import Cell from "./Components/Cell";
import ActionRow from "./Components/ActionRow";
import HintSection from "./Components/HintSection";
import { generateGame } from "./Functions/generateGame";
import Puzzle from "./Components/Puzzle";
import { gameResults } from "sudokuru";
import { Puzzles } from "../../Functions/Api/Puzzles";
import PauseButton from "./Components/PauseButton";
import {
  addEveryRemovalNoteToBoard,
  getHintObject,
} from "./Functions/HintsParsing";
import Hint from "./Functions/Hint";

let fallbackHeight = 30;

const styles = (cellSize, sizeConst, theme) =>
  StyleSheet.create({
    bottomActions: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    headerControlRow: {
      alignSelf: "center",
      width: cellSize ? cellSize * 9 : fallbackHeight * 9,
      height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      marginTop: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
    },
    headerFont: {
      fontFamily: "Inter_400Regular",
      fontSize: cellSize
        ? cellSize * (1 / 3) + 1
        : fallbackHeight * (1 / 3) + 1,
      color: theme,
    },
    submitButtonView: {
      width: cellSize ? cellSize * (50 / 30) : fallbackHeight * (50 / 30),
      height: cellSize ? cellSize * (3 / 4) : fallbackHeight * (3 / 4),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F2CA7E",
      borderRadius: cellSize
        ? cellSize * (10 / 60)
        : fallbackHeight * (10 / 60),
      marginTop: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
    },
    submitButtonText: {
      fontFamily: "Inter_700Bold",
      fontSize: cellSize
        ? cellSize * (1 / 3) + 1
        : fallbackHeight * (1 / 3) + 1,
      color: "#FFFFFF",
    },
  });

const DrillSubmitButton = (props) => {
  const { isDrillSolutionCorrect, navigation } = props;
  const cellSize = getCellSize();

  return (
    <Pressable
      onPress={() => {
        if (isDrillSolutionCorrect()) navigation.navigate("DrillPage");
      }}
    >
      <View style={styles(cellSize).submitButtonView}>
        <Text style={styles(cellSize).submitButtonText}>Submit</Text>
      </View>
    </Pressable>
  );
};

DrillSubmitButton.propTypes = {
  isDrillSolutionCorrect: PropTypes.func.isRequired,
};

const HeaderRow = (props) => {
  //  Header w/ timer and pause button
  const { currentTime, activeGame, timer, setTimer } = props;
  const cellSize = getCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      let interval = null;
      interval = setInterval(() => {
        if (currentTime && currentTime >= timer) {
          setTimer(currentTime + 1);
        } else {
          setTimer(timer + 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    })
  );

  const handlePause = () => {
    saveGame(activeGame, timer);
    navigation.replace("PlayPage");
  };

  return (
    <View style={styles(cellSize).headerControlRow}>
      <Text
        style={styles(cellSize, null, theme.colors.onBackground).headerFont}
      >
        Time: {formatTime(currentTime > timer ? currentTime : timer)}
      </Text>
      <PauseButton handlePause={handlePause} isPaused={false} />
    </View>
  );
};

HeaderRow.propTypes = {
  paused: PropTypes.bool.isRequired,
};

HeaderRow.defaultProps = {
  paused: false,
};

//todo convert this class component into a functional component
const SudokuBoard = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);

  // shared states
  const [board, setBoard] = useState();
  const [history, setHistory] = useState<any>();
  const [historyOffSet, setHistoryOffSet] = useState<number>();
  const [solution, setSolution] = useState();
  const [activeGame, setActiveGame] = useState();

  const setTimer = (timer: number) => useTimer(timer);
  const [timer, useTimer] = useState<number>(0);

  // drill states
  // These could probably stay as props since these values are constant and not altered.
  const [drillSolutionCells, setDrillSolutionCells] = useState();
  const [originalBoard, setOriginalBoard] = useState();

  const autoHint = () => {
    if (!board.get("inHintMode")) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (
            !checkSolution(
              activeGame[0].puzzleSolution,
              i,
              j,
              board.get("puzzle").getIn([i, j]).get("value")
            )
          ) {
            toggleHintMode();
            return;
          }
        }
      }
      // previous board was filled, so now get new board
      generateGame(props).then((result) => {
        setBoard(result.board);
        setHistory(result.history);
        setHistoryOffSet(result.historyOffSet);
        setSolution(result.solution);
        setActiveGame(result.activeGame);
      });
    } else {
      // if you're on the final index of the hint
      if (board.get("currentStep") + 1 === board.get("hintSteps").length) {
        checkMarkClicked();
      }
      // if you're not on the final step
      else {
        rightArrowClicked();
      }
    }
  };

  useEffect(() => {
    generateGame(props).then((result) => {
      setBoard(result.board);
      setHistory(result.history);
      setHistoryOffSet(result.historyOffSet);
      setSolution(result.solution);
      setActiveGame(result.activeGame);

      if (props.gameType == "StartDrill") {
        setDrillSolutionCells(result.drillSolutionCells);
        setOriginalBoard(result.originalBoard);
      }

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (props.gameType == "Demo" && board) {
      const interval = setInterval(() => {
        autoHint();
      }, 2000);
      return () => clearInterval(interval);
    }
  });

  // if we are loading then we return the loading icon
  if (isLoading) return <ActivityIndicator animating={true} color="red" />;

  const getSelectedCell = () => {
    const selected = board.get("selected");
    return selected && board.get("puzzle").getIn([selected.x, selected.y]);
  };

  const getNumberValueCount = (number) => {
    const rows = board.getIn(["choices", "rows"]);
    const columns = board.getIn(["choices", "columns"]);
    const squares = board.getIn(["choices", "squares"]);
    return Math.min(
      getNumberOfGroupsAssignedForNumber(number, squares),
      Math.min(
        getNumberOfGroupsAssignedForNumber(number, rows),
        getNumberOfGroupsAssignedForNumber(number, columns)
      )
    );
  };

  const addNumberAsNote = (number) => {
    let newBoard = board;
    let selectedCell = getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get("prefilled");
    if (prefilled) return;
    const { x, y } = newBoard.get("selected");
    const currentValue = selectedCell.get("value");
    if (currentValue) {
      newBoard = updateBoardWithNumber({
        x,
        y,
        number: currentValue,
        fill: false,
        board: newBoard,
      });
    }
    let notes = selectedCell.get("notes") || Set();
    let actualValue = solution ? solution[x][y] : -1;
    if (notes.has(number)) {
      if (number !== actualValue) notes = notes.delete(number);
    } else {
      notes = notes.add(number);
    }
    selectedCell = selectedCell.set("notes", notes);
    selectedCell = selectedCell.delete("value");
    newBoard = newBoard.setIn(["puzzle", x, y], selectedCell);
    updateBoard(newBoard);
  };

  const updateBoard = (newBoard) => {
    let newHistory = history;
    newHistory = newHistory.slice(0, historyOffSet + 1);
    newHistory = newHistory.push(newBoard);

    setHistoryOffSet(newHistory.size - 1);
    setHistory(newHistory);
    setBoard(newBoard);
  };

  const updateBoardInPlace = () => {
    let newHistory = history;
    newHistory = newHistory.slice(0, historyOffSet + 1);
    newHistory = newHistory.push(board);
    setHistory(newHistory);
    setHistoryOffSet(newHistory.size - 1);
  };

  const undo = () => {
    let newHistoryOffSet = historyOffSet;
    let newBoard = board;
    if (history.size) {
      newHistoryOffSet = Math.max(0, newHistoryOffSet - 1);
      newBoard = history.get(newHistoryOffSet);
      setHistoryOffSet(newHistoryOffSet);
      setBoard(newBoard);
    }
  };

  const toggleNoteMode = () => {
    let newBoard = board;
    let currNoteMode = newBoard.get("inNoteMode");
    newBoard = newBoard.set("inNoteMode", !currNoteMode);
    setBoard(newBoard);
  };

  const toggleHintMode = () => {
    let newBoard = board;
    let newHintMode = !newBoard.get("inHintMode");
    newBoard = newBoard.set("inHintMode", newHintMode);

    // Increment global hint value by one
    if (props.gameType != "StartDrill" && newHintMode) {
      if (activeGame[0].numHintsUsed == null) {
        activeGame[0].numHintsUsed = 1;
      } else {
        activeGame[0].numHintsUsed++;
      }
    }

    if (!newHintMode) {
      let hintStepsLength = newBoard.get("hintSteps").length;
      let currentStep = newBoard.get("currentStep");

      // if they prematurely exit hint mode, undo the hint
      if (currentStep < hintStepsLength - 1) {
        undo();
      }

      newBoard = newBoard.set("currentStep", -1);
      newBoard = newBoard.set("hintSteps", []);

      // if they are on the final step, push the hint operation to the history stack
      if (currentStep == hintStepsLength - 1) updateBoard(newBoard);
      else setBoard(newBoard);
      return;
    }
    newBoard = newBoard.set("currentStep", 0);
    let hint = solution
      ? getNextHint(newBoard, solution, props.strategies)
      : getNextHint(newBoard, null, props.strategies);

    if (!hint) return;
    const words = hint.strategy.toLowerCase().replaceAll("_", " ").split(" ");
    for (let i = 0; i < words.length; i++)
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    let hintStratName = words.join(" ");
    newBoard = newBoard.set("hintStratName", hintStratName);
    const hintInfo = hint.info;
    newBoard = newBoard.set("hintInfo", hintInfo);
    const hintAction = hint.action;
    newBoard = newBoard.set("hintAction", hintAction);

    let causes = [];
    let groups = [];
    let placements = [];
    let removals = [];
    if (hint) {
      if (hint.cause) causes = getCausesFromHint(hint);
      if (hint.groups) groups = getGroupsFromHint(hint);
      if (hint.placements) placements = getPlacementsFromHint(hint);
      if (hint.removals) removals = getRemovalsFromHint(board, hint);
    }

    let boxGroups = [];
    let nonBoxGroups = [];

    let hintSteps = [];
    let hintObject: Hint;
    switch (hint.strategy) {
      case "AMEND_NOTES": // ...done? TODO: try to get weird undo stuff worked out
        newBoard = addEveryRemovalNoteToBoard(newBoard, removals);
        hintObject = getHintObject(2, groups, causes, removals, [
          "highlight",
          "delete",
        ]);
        hintSteps = hintObject.getHintSteps();
        break;
      case "SIMPLIFY_NOTES": // DONE
        // two steps, two objects
        hintSteps.push({});
        hintSteps.push({});

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "NAKED_SINGLE": // DONE
        // two steps, two objects
        hintSteps.push({});
        hintSteps.push({});

        // highlight the cause and placement
        hintSteps[0].causes = causes;
        hintSteps[0].placements = { ...placements[0], mode: "highlight" };

        // highlight the cause and insert the placement
        hintSteps[1].causes = causes;
        hintSteps[1].placements = { ...placements[0], mode: "place" };
        break;
      case "NAKED_PAIR": // DONE
      case "NAKED_TRIPLET": // DONE
      case "NAKED_QUADRUPLET": // DONE
        // two steps, two objects
        hintSteps.push({});
        hintSteps.push({});

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "HIDDEN_SINGLE": // DONE
      case "HIDDEN_PAIR": // DONE
      case "HIDDEN_TRIPLET": // DONE
      case "HIDDEN_QUADRUPLET": // DONE
        // two steps, two objects
        hintSteps.push({});
        hintSteps.push({});

        // highlight the groups, causes, and removals
        hintSteps[0].groups = groups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[0].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the groups, causes, and delete the removals
        hintSteps[1].groups = groups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "POINTING_PAIR":
      case "POINTING_TRIPLET":
        // three steps, three objects
        hintSteps.push({}); // box and causes
        hintSteps.push({}); // row/col and rem highlight
        hintSteps.push({}); // row/col and rem delete

        // seperate the groups which are boxes and which are not boxes
        for (let i = groups.length - 2; i < groups.length; i++)
          if (groups[i].type == "box") boxGroups.push(groups[i]);
          else nonBoxGroups.push(groups[i]);

        // highlight the boxGroups and causes
        hintSteps[0].groups = boxGroups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];

        // highlight the nonBoxGroups, causes, and removals
        hintSteps[1].groups = nonBoxGroups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the nonBoxGroups, causes, and removals
        hintSteps[2].groups = nonBoxGroups;
        hintSteps[2].causes = causes;
        hintSteps[2].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[2].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "BOX_LINE_REDUCTION": // DONE
        // three steps, three objects
        hintSteps.push({}); // box and causes
        hintSteps.push({}); // row/col and rem highlight
        hintSteps.push({}); // row/col and rem delete

        // seperate the groups which are boxes and which are not boxes
        for (let i = 0; i < groups.length; i++)
          if (groups[i].type == "box") boxGroups.push(groups[i]);
          else nonBoxGroups.push(groups[i]);

        // highlight the nonBoxGroups and causes
        hintSteps[0].groups = nonBoxGroups;
        hintSteps[0].causes = causes;
        hintSteps[0].removals = [];

        // highlight the boxGroups, causes, and removals
        hintSteps[1].groups = boxGroups;
        hintSteps[1].causes = causes;
        hintSteps[1].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[1].removals.push({ ...removals[i], mode: "highlight" });

        // highlight the nonBoxGroups, causes, and removals
        hintSteps[2].groups = nonBoxGroups;
        hintSteps[2].causes = causes;
        hintSteps[2].removals = [];
        for (let i = 0; i < removals.length; i++)
          hintSteps[2].removals.push({ ...removals[i], mode: "delete" });
        break;
      case "X_WING":
        console.log("X Wing");
        break;
      case "SWORDFISH":
        console.log("Swordfish");
        break;
      case "SINGLES_CHAINING":
        console.log("Singles Chaining");
        break;
      default:
        console.log("the switch statement matched none of the strategies :(");
        break;
    }
    newBoard = newBoard.set("hintSteps", hintSteps);
    setBoard(newBoard);
  };

  const addValueFromPlacement = (x, y, valueToAdd, currentStep) => {
    let newBoard = board;
    newBoard = newBoard.set("currentStep", currentStep);
    newBoard = updateBoardWithNumber({
      x,
      y,
      number: valueToAdd,
      fill: true,
      board: newBoard,
    });
    return newBoard;
  };

  const deleteValueFromPlacement = (x, y, valueToRemove, currentStep) => {
    let newBoard = board;
    newBoard = newBoard.set("currentStep", currentStep);
    newBoard = updateBoardWithNumber({
      x,
      y,
      number: valueToRemove,
      fill: false,
      board: newBoard,
    });
    newBoard = newBoard.setIn(["puzzle", x, y, "notes"], Set.of(valueToRemove));
    return newBoard;
  };

  const addNotesFromRemovals = (x, y, notesToAdd, currentStep, board) => {
    let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
    board = board.set("currentStep", currentStep);
    for (let i = 0; i < notesToAdd.length; i++) {
      if (!notes.has(notesToAdd[i])) {
        notes = notes.add(notesToAdd[i]);
      }
    }
    board = board.setIn(["puzzle", x, y, "notes"], notes);
    return board;
  };

  const deleteNotesFromRemovals = (x, y, notesToRemove, currentStep, board) => {
    board = board.set("currentStep", currentStep);
    let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
    for (let i = 0; i < notesToRemove.length; i++) {
      if (notes.has(notesToRemove[i])) {
        notes = notes.delete(notesToRemove[i]);
      }
    }
    board = board.setIn(["puzzle", x, y, "notes"], notes);
    return board;
  };

  /*
   * Called when the user hits the 'erase' button
   * If notes are present in selected cell, removes all notes
   * If value is present in selected cell, removes value if value is incorrect
   */
  const eraseSelected = () => {
    let selectedCell = getSelectedCell();
    if (!selectedCell) return;

    const { x, y } = board.get("selected");
    const currentValue = selectedCell.get("value");

    let actualValue = solution ? solution[x][y] : -1;
    if (currentValue) {
      if (currentValue !== actualValue) {
        fillNumber(false);
      } else {
        // User has attempted to remove a correct value
        return;
      }
    } else {
      let newBoard = board;
      selectedCell = selectedCell.set("notes", Set());
      newBoard = newBoard.setIn(["puzzle", x, y], selectedCell);
      updateBoard(newBoard);
    }
  };

  const fillNumber = (number) => {
    let newBoard = board;
    const selectedCell = getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get("prefilled");
    if (prefilled) return;
    const { x, y } = board.get("selected");
    const currentValue = selectedCell.get("value");
    if (currentValue) {
      newBoard = updateBoardWithNumber({
        x,
        y,
        number: currentValue,
        fill: false,
        board: newBoard,
      });
    }
    const setNumber = currentValue !== number && number;
    if (setNumber) {
      newBoard = updateBoardWithNumber({
        x,
        y,
        number,
        fill: true,
        board: newBoard,
      });

      if (
        props.gameType != "StartDrill" &&
        !checkSolution(activeGame[0].puzzleSolution, x, y, number)
      ) {
        if (activeGame[0].numWrongCellsPlayed === null) {
          activeGame[0].numWrongCellsPlayed = 1;
        } else {
          activeGame[0].numWrongCellsPlayed++;
        }
      }
    }
    updateBoard(newBoard);
  };

  const selectCell = (x, y) => {
    setBoard(board.set("selected", { x, y }));
  };

  const isConflict = (i, j) => {
    const { value } = board.getIn(["puzzle", i, j]).toJSON();
    if (!value) return false;

    let cellNum = getCellNumber(j, i); // Flipping x and y because of how the solution string is formatted
    let solutionValue = solution.charAt(cellNum);

    return !(solutionValue == value || value == null);
  };

  const boardHasConflict = () => {
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++) if (isConflict(i, j)) return true;

    return false;
  };

  const renderCell = (cell, x, y) => {
    const selected = getSelectedCell();
    const { value, prefilled, notes } = cell.toJSON();
    const conflict = isConflict(x, y);
    const peer = areCoordinatePeers({ x, y }, board.get("selected"));
    const box = highlightBox({ x, y }, board.get("selected"));
    const row = highlightRow({ x, y }, board.get("selected"));
    const column = highlightColumn({ x, y }, board.get("selected"));
    const sameValue = !!(
      selected &&
      selected.get("value") &&
      value === selected.get("value")
    );
    const isSelected = cell === selected;
    let inHintMode = board.get("inHintMode");
    let hintSteps = board.get("hintSteps");
    let currentStep = board.get("currentStep");

    let game = null;
    if (props.gameType != "StartDrill") game = activeGame[0];

    return (
      <Cell
        prefilled={prefilled}
        notes={notes}
        sameValue={sameValue}
        isSelected={isSelected}
        isPeer={peer}
        isBox={box}
        isRow={row}
        isColumn={column}
        value={value}
        onClick={(x, y) => {
          selectCell(x, y);
        }}
        key={y}
        x={x}
        y={y}
        conflict={conflict}
        eraseSelected={eraseSelected}
        inHintMode={inHintMode}
        hintSteps={hintSteps}
        currentStep={currentStep}
        game={game}
        showResults={props.showGameResults}
        gameType={props.gameType}
        landingMode={props.gameType == "Demo"}
        drillMode={props.gameType == "StartDrill"}
        timer={timer}
      />
    );
  };

  const renderTopBar = () => {
    return (
      <HeaderRow
        currentTime={activeGame[0].currentTime}
        activeGame={activeGame[0]}
        timer={timer}
        setTimer={setTimer}
      />
    );
  };

  const rightArrowClicked = () => {
    let newBoard = board;
    let hintSteps = newBoard.get("hintSteps");
    let currentStep = newBoard.get("currentStep") + 1;
    if (currentStep == undefined || currentStep == hintSteps.length) return;
    newBoard = newBoard.set("currentStep", currentStep);
    if (hintSteps[currentStep].removals) {
      for (let i = hintSteps[currentStep].removals.length - 1; i >= 0; i--) {
        if (hintSteps[currentStep].removals[i].mode === "delete") {
          let x = hintSteps[currentStep].removals[i].position[0];
          let y = hintSteps[currentStep].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep].removals[i].values;
          newBoard = deleteNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            newBoard
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep].placements.mode === "place") {
        let x = hintSteps[currentStep].placements.position[0];
        let y = hintSteps[currentStep].placements.position[1];
        let valueToAdd = hintSteps[currentStep].placements.value;
        newBoard = addValueFromPlacement(x, y, valueToAdd, currentStep);
      }
    }
    setBoard(newBoard);
  };

  const leftArrowClicked = () => {
    let newBoard = board;
    let hintSteps = newBoard.get("hintSteps");
    let currentStep = newBoard.get("currentStep") - 1;
    if (currentStep == undefined || currentStep < 0) return;
    newBoard = newBoard.set("currentStep", currentStep);
    if (hintSteps[currentStep].removals) {
      for (let i = 0; i < hintSteps[currentStep].removals.length; i++) {
        if (hintSteps[currentStep + 1].removals[i].mode === "delete") {
          let x = hintSteps[currentStep + 1].removals[i].position[0];
          let y = hintSteps[currentStep + 1].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep + 1].removals[i].values;
          newBoard = addNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            newBoard
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep + 1].placements.mode === "place") {
        let x = hintSteps[currentStep + 1].placements.position[0];
        let y = hintSteps[currentStep + 1].placements.position[1];
        let valueToRemove = hintSteps[currentStep + 1].placements.value;
        newBoard = deleteValueFromPlacement(x, y, valueToRemove, currentStep);
      }
    }
    setBoard(newBoard);
  };

  const checkMarkClicked = () => {
    toggleHintMode();
  };

  const handleKeyDown = (event) => {
    let inHintMode = board.get("inHintMode");
    let inNoteMode = board.get("inNoteMode");
    const inputValue = event.nativeEvent.key;
    if (
      /^[1-9]$/.test(inputValue) &&
      !inHintMode &&
      !(props.gameType == "Demo")
    ) {
      // check if input is a digit from 1 to 9
      if (inNoteMode) {
        addNumberAsNote(parseInt(inputValue, 10));
      } else {
        fillNumber(parseInt(inputValue, 10));
      }
    }
    if ((inputValue == "Delete" || inputValue == "Backspace") && !inHintMode)
      eraseSelected();
  };

  const renderPuzzle = () => {
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get("hintSteps") != undefined) {
      let currentStep = board.get("currentStep");
      let numHintSteps = board.get("hintSteps").length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    return (
      <Puzzle
        inHintMode={board.get("inHintMode")}
        renderCell={renderCell}
        board={board}
        rightArrowClicked={rightArrowClicked}
        leftArrowClicked={leftArrowClicked}
        checkMarkClicked={checkMarkClicked}
        onFirstStep={onFirstStep}
        onFinalStep={onFinalStep}
      />
    );
  };

  const renderNumberControl = () => {
    const selectedCell = getSelectedCell();
    const prefilled = selectedCell && selectedCell.get("prefilled");
    const inNoteMode = board.get("inNoteMode");
    const inHintMode = board.get("inHintMode");
    return (
      <NumberControl
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        getNumberValueCount={getNumberValueCount}
        fillNumber={fillNumber}
        addNumberAsNote={addNumberAsNote}
        inHintMode={inHintMode}
      />
    );
  };

  const renderActions = () => {
    const selectedCell = getSelectedCell();
    const prefilled = selectedCell && selectedCell.get("prefilled");
    const inNoteMode = board.get("inNoteMode");
    const inHintMode = board.get("inHintMode");

    return (
      <ActionRow
        history={history}
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        toggleHintMode={toggleHintMode}
        updateBoardInPlace={updateBoardInPlace}
        inHintMode={inHintMode}
        boardHasConflict={boardHasConflict}
      />
    );
  };

  // todo fix this
  const renderSubmitButton = () => {
    const { navigation } = props;
    const isDrillSolutionCorrect = () => {
      let newBoard = board;
      for (let i = 0; i < drillSolutionCells.length; i++) {
        let x = drillSolutionCells[i].x;
        let y = drillSolutionCells[i].y;
        let solutionNotes = drillSolutionCells[i].notes;
        let solutionPlacement = drillSolutionCells[i].value;
        if (solutionNotes) {
          let boardNotes = newBoard.getIn(["puzzle", x, y, "notes"]) || Set();
          if (!boardNotes.equals(solutionNotes)) {
            newBoard = originalBoard;
            setBoard(newBoard);
            return false;
          }
        } else if (solutionPlacement) {
          let boardValue = newBoard.getIn(["puzzle", x, y, "value"]) || -1;
          if (boardValue != solutionPlacement) {
            newBoard = originalBoard;
            setBoard(newBoard);
            return false;
          }
        }
      }
      return true;
    };

    return (
      <DrillSubmitButton
        isDrillSolutionCorrect={isDrillSolutionCorrect}
        navigation={navigation}
      />
    );
  };

  const renderHintSection = () => {
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get("hintSteps") != undefined) {
      let currentStep = board.get("currentStep");
      let numHintSteps = board.get("hintSteps").length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    let hintStratName = board ? board.get("hintStratName") : "Hint";
    let currentStep = board ? board.get("currentStep") : -1;
    let hintInfo = board ? board.get("hintInfo") : "Info";
    let hintAction = board ? board.get("hintAction") : "Action";
    return (
      <HintSection
        hintStratName={hintStratName}
        hintInfo={hintInfo}
        hintAction={hintAction}
        currentStep={currentStep}
        rightArrowClicked={rightArrowClicked}
        leftArrowClicked={leftArrowClicked}
        checkMarkClicked={checkMarkClicked}
        onFirstStep={onFirstStep}
        onFinalStep={onFinalStep}
      />
    );
  };

  let inHintMode = board ? board.get("inHintMode") : false;

  return (
    <View
      testID={
        props.gameType == "Demo"
          ? "sudokuDemoBoard"
          : props.gameType == "StartDrill"
          ? "sudokuDrillBoard"
          : "sudokuBoard"
      }
      onKeyDown={handleKeyDown}
      styles={{ borderWidth: 1 }}
    >
      {board &&
        !(props.gameType == "Demo") &&
        !(props.gameType == "StartDrill") &&
        renderTopBar()}
      {board && renderPuzzle()}
      {board && (
        <View style={styles().bottomActions}>
          {!(props.gameType == "Demo") && renderActions()}
          {!(props.gameType == "Demo") && !inHintMode && renderNumberControl()}
          {props.gameType == "StartDrill" &&
            !inHintMode &&
            renderSubmitButton()}
          {!(props.gameType == "Demo") && inHintMode && renderHintSection()}
        </View>
      )}
    </View>
  );
};

export default SudokuBoard;

interface SudokuBoardProps {
  gameType: string;
  strategies: string[];
  difficulty?: number;
  navigation?: any;
  showGameResults?: any;
}
