// @ts-nocheck
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Set } from "immutable";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

import {
  highlightBox,
  highlightColumn,
  highlightRow,
  isPeer as areCoordinatePeers,
  makeBoard,
} from "./sudoku";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getKeyString } from "../../Functions/Auth0/token";
import { USERACTIVEGAMESBFFURL } from "@env";
import { useFocusEffect } from "@react-navigation/core";
import { useTheme } from "react-native-paper";
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
  getHint,
} from "./Functions/BoardFunctions";
import Cell from "./Components/Cell";
import ActionRow from "./Components/ActionRow";
import HintSection from "./Components/HintSection";
import { generateGame } from "./Functions/generateGame";
import Puzzle from "./Components/Puzzle";
import { Puzzles } from "sudokuru";

// startGame - https://www.npmjs.com/package/sudokuru#:~:text=sudokuru.Puzzles%3B-,Puzzles.startGame(),-Description%3A%20Returns%20puzzle
let url = USERACTIVEGAMESBFFURL;

let drillMode = false;

let landingMode = false;

let fallbackHeight = 30;

// Global variables for activeGame elements
let globalTime = 0;

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

//todo this function cannot be moved until globalTime situation is handled
export async function saveGame(activeGame) {
  let token: string = "";

  await getKeyString("access_token").then((result) => {
    if (result) {
      token = result;
    }
  });

  activeGame.currentTime = globalTime;

  Puzzles.saveGame(url, activeGame, activeGame.puzzle, token).then((res) => {
    if (res) {
      console.log("Game progress was saved successfully!");
    }
  });
}

export async function finishGame(activeGame, showResults) {
  let token = null;

  await getKeyString("access_token").then((result) => {
    token = result;
  });

  Puzzles.finishGame(url, activeGame.puzzle, token).then((res) => {
    if (res) {
      showResults(
        res.score,
        res.solveTime,
        res.numHintsUsed,
        res.numWrongCellsPlayed,
        res.difficulty
      );
    }
  });
}

const DrillSubmitButton = (props) => {
  const { isDrillSolutionCorrect, navigation } = props;
  const cellSize = getCellSize();

  return (
    <Pressable
      onPress={() => {
        if (isDrillSolutionCorrect()) navigation.navigate("Main Page");
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

const PauseButton = ({ handlePause, isPaused }) => {
  const cellSize = getCellSize();
  const sizeConst = Platform.OS == "web" ? 1.5 : 1;
  const theme = useTheme();

  return (
    <Pressable onPress={handlePause}>
      {isPaused ? (
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="play"
          size={cellSize / sizeConst}
        />
      ) : (
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="pause"
          size={cellSize / sizeConst}
        />
      )}
    </Pressable>
  );
};

//todo this function cannot be moved until globalTime situation is handled
const HeaderRow = (props) => {
  //  Header w/ timer and pause button
  const { currentTime, activeGame } = props;
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cellSize = getCellSize();
  const navigation = useNavigation();

  const theme = useTheme();

  // If we are resuming game, set starting time to currentTime
  if (time == 0 && currentTime != 0) {
    setTime(currentTime);
  }
  // if we are starting a new game, reset globalTime
  else if (time == 0 && globalTime != 0) {
    globalTime = 0;
  }

  useFocusEffect(
    React.useCallback(() => {
      let interval = null;
      if (!isPaused) {
        interval = setInterval(() => {
          setTime((time) => time + 1);
          globalTime = globalTime + 1;
        }, 1000);
      } else {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [isPaused])
  );

  const handlePause = () => {
    // setIsPaused(prevState => !prevState);
    // saveGame(activeGame).then(() => {
    //   navigation.replace('Home');
    // });
    saveGame(activeGame);
    navigation.replace("Home");
  };

  return (
    <View style={styles(cellSize).headerControlRow}>
      <Text
        style={styles(cellSize, null, theme.colors.onBackground).headerFont}
      >
        Time: {formatTime(time)}
      </Text>
      <PauseButton handlePause={handlePause} isPaused={isPaused} />
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
export default class SudokuBoard extends React.Component<SudokuBoardProps> {
  constructor(props) {
    super(props);
  }
  state = generateGame(USERACTIVEGAMESBFFURL, this.props);

  getSelectedCell = () => {
    const { board } = this.state;
    const selected = board.get("selected");
    return selected && board.get("puzzle").getIn([selected.x, selected.y]);
  };

  getNumberValueCount = (number) => {
    const rows = this.state.board.getIn(["choices", "rows"]);
    const columns = this.state.board.getIn(["choices", "columns"]);
    const squares = this.state.board.getIn(["choices", "squares"]);
    return Math.min(
      getNumberOfGroupsAssignedForNumber(number, squares),
      Math.min(
        getNumberOfGroupsAssignedForNumber(number, rows),
        getNumberOfGroupsAssignedForNumber(number, columns)
      )
    );
  };

  addNumberAsNote = (number) => {
    let { board, solution } = this.state;
    let selectedCell = this.getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get("prefilled");
    if (prefilled) return;
    const { x, y } = board.get("selected");
    const currentValue = selectedCell.get("value");
    if (currentValue) {
      board = updateBoardWithNumber({
        x,
        y,
        number: currentValue,
        fill: false,
        board: this.state.board,
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
    board = board.setIn(["puzzle", x, y], selectedCell);
    this.updateBoard(board);
  };

  updateBoard = (newBoard) => {
    let { history } = this.state;
    const { historyOffSet } = this.state;
    history = history.slice(0, historyOffSet + 1);
    history = history.push(newBoard);
    this.setState({
      board: newBoard,
      history,
      historyOffSet: history.size - 1,
    });
  };

  updateBoardInPlace = () => {
    let { board, history } = this.state;
    const { historyOffSet } = this.state;
    history = history.slice(0, historyOffSet + 1);
    history = history.push(board);
    this.setState({ board, history, historyOffSet: history.size - 1 });
  };

  canUndo = () => this.state.historyOffSet > 0;

  redo = () => {
    const { history } = this.state;
    let { historyOffSet } = this.state;
    if (history.size) {
      historyOffSet = Math.min(history.size - 1, historyOffSet + 1);
      const board = history.get(historyOffSet);
      this.setState({ board, historyOffSet });
    }
  };

  undo = () => {
    const { history } = this.state;
    let { historyOffSet, board } = this.state;
    if (history.size) {
      historyOffSet = Math.max(0, historyOffSet - 1);
      board = history.get(historyOffSet);
      this.setState({ board, historyOffSet, history });
    }
  };

  toggleNoteMode = () => {
    let { board } = this.state;
    let currNoteMode = board.get("inNoteMode");
    board = board.set("inNoteMode", !currNoteMode);
    this.setState({ board });
  };

  toggleHintMode = () => {
    let { board, solution } = this.state;
    let newHintMode = !board.get("inHintMode");
    board = board.set("inHintMode", newHintMode);

    // Increment global hint value by one
    if (this.props.gameType != "StartDrill" && newHintMode) {
      this.state.activeGame[0].numHintsUsed++;
    }

    if (!newHintMode) {
      let hintStepsLength = board.get("hintSteps").length;
      let currentStep = board.get("currentStep");

      // if they prematurely exit hint mode, undo the hint
      if (currentStep < hintStepsLength - 1) {
        this.undo();
      }

      board = board.set("currentStep", -1);
      board = board.set("hintSteps", []);

      // if they are on the final step, push the hint operation to the history stack
      if (currentStep == hintStepsLength - 1) this.updateBoard(board);
      else this.setState({ board });
      return;
    }
    board = board.set("currentStep", 0);
    let hint = solution
      ? getHint(board, solution, this.props.strategies)
      : getHint(board, null, this.props.strategies);

    if (!hint) return;
    const words = hint.strategy.toLowerCase().replaceAll("_", " ").split(" ");
    for (let i = 0; i < words.length; i++)
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    hintStratName = words.join(" ");
    board = board.set("hintStratName", hintStratName);
    const hintInfo = hint.info;
    board = board.set("hintInfo", hintInfo);
    const hintAction = hint.action;
    board = board.set("hintAction", hintAction);

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
    switch (hint.strategy) {
      case "AMEND_NOTES": // ...done? TODO: try to get weird undo stuff worked out
        for (let i = 0; i < removals.length; i++)
          board = this.addEveryNote(
            removals[i].position[0],
            removals[i].position[1],
            board
          );

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
    board = board.set("hintSteps", hintSteps);
    this.setState({ board });
  };

  addValueFromPlacement = (x, y, valueToAdd, currentStep) => {
    let { board } = this.state;
    board = board.set("currentStep", currentStep);
    board = updateBoardWithNumber({
      x,
      y,
      number: valueToAdd,
      fill: true,
      board,
    });
    return board;
  };

  deleteValueFromPlacement = (x, y, valueToRemove, currentStep) => {
    let { board } = this.state;
    board = board.set("currentStep", currentStep);
    board = updateBoardWithNumber({
      x,
      y,
      number: valueToRemove,
      fill: false,
      board,
    });
    board = board.setIn(["puzzle", x, y, "notes"], Set.of(valueToRemove));
    return board;
  };

  addEveryNote = (x, y, board) => {
    // let { board } = this.state;
    let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
    for (let i = 1; i <= 9; i++) {
      if (!notes.has(i)) {
        notes = notes.add(i);
      }
    }
    board = board.setIn(["puzzle", x, y, "notes"], notes);
    return board;
  };

  addNotesFromRemovals = (x, y, notesToAdd, currentStep, board) => {
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

  deleteNotesFromRemovals = (x, y, notesToRemove, currentStep, board) => {
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
  eraseSelected = () => {
    let { board, solution } = this.state;
    let selectedCell = this.getSelectedCell();
    if (!selectedCell) return;

    const { x, y } = board.get("selected");
    const currentValue = selectedCell.get("value");

    let actualValue = solution ? solution[x][y] : -1;
    if (currentValue) {
      if (currentValue !== actualValue) {
        this.fillNumber(false);
      } else {
        // User has attempted to remove a correct value
        return;
      }
    } else {
      selectedCell = selectedCell.set("notes", Set());
      board = board.setIn(["puzzle", x, y], selectedCell);
      this.updateBoard(board);
    }
  };

  fillNumber = (number) => {
    let { board, game } = this.state;
    const selectedCell = this.getSelectedCell();
    if (!selectedCell) return;
    const prefilled = selectedCell.get("prefilled");
    if (prefilled) return;
    const { x, y } = board.get("selected");
    const currentValue = selectedCell.get("value");
    if (currentValue) {
      board = updateBoardWithNumber({
        x,
        y,
        number: currentValue,
        fill: false,
        board: this.state.board,
      });
    }
    const setNumber = currentValue !== number && number;
    if (setNumber) {
      board = updateBoardWithNumber({
        x,
        y,
        number,
        fill: true,
        board,
      });

      if (
        this.props.gameType != "StartDrill" &&
        !checkSolution(this.state.activeGame[0].puzzleSolution, x, y, number)
      ) {
        this.state.activeGame[0].numWrongCellsPlayed++;
      }
    }
    this.updateBoard(board);
  };

  selectCell = (x, y) => {
    let { board } = this.state;
    board = board.set("selected", { x, y });
    this.setState({ board });
  };

  isConflict = (i, j) => {
    const { value } = this.state.board.getIn(["puzzle", i, j]).toJSON();
    if (!value) return false;

    let cellNum = getCellNumber(j, i); // Flipping x and y because of how the solution string is formatted
    let solutionValue = this.state.solution.charAt(cellNum);

    if (solutionValue == value || value == null) return false;
    else return true;
  };

  boardHasConflict = () => {
    for (let i = 0; i < 9; i++)
      for (let j = 0; j < 9; j++) if (this.isConflict(i, j)) return true;

    return false;
  };

  renderCell = (cell, x, y) => {
    const { board } = this.state;
    const selected = this.getSelectedCell();
    const { value, prefilled, notes } = cell.toJSON();
    const conflict = this.isConflict(x, y);
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
    if (this.props.gameType != "StartDrill") game = this.state.activeGame[0];

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
          this.selectCell(x, y);
        }}
        key={y}
        x={x}
        y={y}
        conflict={conflict}
        eraseSelected={this.eraseSelected}
        inHintMode={inHintMode}
        hintSteps={hintSteps}
        currentStep={currentStep}
        game={game}
        showResults={this.props.showGameResults}
        gameType={this.props.gameType}
        landingMode={landingMode}
        drillMode={drillMode}
      />
    );
  };

  renderTopBar = () => {
    return (
      <HeaderRow
        currentTime={this.state.activeGame[0].currentTime}
        activeGame={this.state.activeGame[0]}
      />
    );
  };

  rightArrowClicked = () => {
    let { board } = this.state;
    let hintSteps = board.get("hintSteps");
    let currentStep = board.get("currentStep") + 1;
    if (currentStep == undefined || currentStep == hintSteps.length) return;
    board = board.set("currentStep", currentStep);
    this.setState({ board });
    if (hintSteps[currentStep].removals) {
      for (let i = hintSteps[currentStep].removals.length - 1; i >= 0; i--) {
        if (hintSteps[currentStep].removals[i].mode === "delete") {
          let x = hintSteps[currentStep].removals[i].position[0];
          let y = hintSteps[currentStep].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep].removals[i].values;
          board = this.deleteNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            board
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep].placements.mode === "place") {
        let x = hintSteps[currentStep].placements.position[0];
        let y = hintSteps[currentStep].placements.position[1];
        let valueToAdd = hintSteps[currentStep].placements.value;
        board = this.addValueFromPlacement(x, y, valueToAdd, currentStep);
      }
    }
    this.setState({ board });
  };

  leftArrowClicked = () => {
    let { board } = this.state;
    let hintSteps = board.get("hintSteps");
    let currentStep = board.get("currentStep") - 1;
    if (currentStep == undefined || currentStep < 0) return;
    board = board.set("currentStep", currentStep);
    if (hintSteps[currentStep].removals) {
      for (let i = 0; i < hintSteps[currentStep].removals.length; i++) {
        if (hintSteps[currentStep + 1].removals[i].mode === "delete") {
          let x = hintSteps[currentStep + 1].removals[i].position[0];
          let y = hintSteps[currentStep + 1].removals[i].position[1];
          let notesToRemove = hintSteps[currentStep + 1].removals[i].values;
          board = this.addNotesFromRemovals(
            x,
            y,
            notesToRemove,
            currentStep,
            board
          );
        }
      }
    }
    if (hintSteps[currentStep].placements) {
      if (hintSteps[currentStep + 1].placements.mode === "place") {
        let x = hintSteps[currentStep + 1].placements.position[0];
        let y = hintSteps[currentStep + 1].placements.position[1];
        let valueToRemove = hintSteps[currentStep + 1].placements.value;
        board = this.deleteValueFromPlacement(x, y, valueToRemove, currentStep);
      }
    }
    this.setState({ board });
  };

  checkMarkClicked = () => {
    this.toggleHintMode();
  };

  handleKeyDown = (event) => {
    const { board } = this.state;
    let inHintMode = board.get("inHintMode");
    let inNoteMode = board.get("inNoteMode");
    const inputValue = event.nativeEvent.key;
    if (/^[1-9]$/.test(inputValue) && !inHintMode && !landingMode) {
      // check if input is a digit from 1 to 9
      if (inNoteMode) this.addNumberAsNote(parseInt(inputValue, 10));
      else this.fillNumber(parseInt(inputValue, 10));
    }
    if ((inputValue == "Delete" || inputValue == "Backspace") && !inHintMode)
      this.eraseSelected();
  };

  renderPuzzle = () => {
    const { board } = this.state;
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
        renderCell={this.renderCell}
        board={board}
        rightArrowClicked={this.rightArrowClicked}
        leftArrowClicked={this.leftArrowClicked}
        checkMarkClicked={this.checkMarkClicked}
        onFirstStep={onFirstStep}
        onFinalStep={onFinalStep}
      />
    );
  };

  renderNumberControl = () => {
    const { board } = this.state;
    const selectedCell = this.getSelectedCell();
    const prefilled = selectedCell && selectedCell.get("prefilled");
    const inNoteMode = board.get("inNoteMode");
    const inHintMode = board.get("inHintMode");
    return (
      <NumberControl
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        getNumberValueCount={this.getNumberValueCount}
        fillNumber={this.fillNumber}
        addNumberAsNote={this.addNumberAsNote}
        inHintMode={inHintMode}
      />
    );
  };

  renderActions = () => {
    const { board, history } = this.state;
    const selectedCell = this.getSelectedCell();
    const prefilled = selectedCell && selectedCell.get("prefilled");
    const inNoteMode = board.get("inNoteMode");
    const inHintMode = board.get("inHintMode");
    const undo = this.undo;
    const toggleNoteMode = this.toggleNoteMode;
    const eraseSelected = this.eraseSelected;

    return (
      <ActionRow
        history={history}
        prefilled={prefilled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        toggleHintMode={this.toggleHintMode}
        updateBoardInPlace={this.updateBoardInPlace}
        inHintMode={inHintMode}
        boardHasConflict={this.boardHasConflict}
      />
    );
  };

  renderSubmitButton = () => {
    const { navigation } = this.props;
    const isDrillSolutionCorrect = () => {
      const { drillSolutionCells, originalBoard } = this.state;
      let { board } = this.state;
      for (let i = 0; i < drillSolutionCells.length; i++) {
        let x = drillSolutionCells[i].x;
        let y = drillSolutionCells[i].y;
        let solutionNotes = drillSolutionCells[i].notes;
        let solutionPlacement = drillSolutionCells[i].value;
        if (solutionNotes) {
          let boardNotes = board.getIn(["puzzle", x, y, "notes"]) || Set();
          if (!boardNotes.equals(solutionNotes)) {
            board = originalBoard;
            this.setState({ board }, () => {
              this.toggleHintMode();
            });
            return false;
          }
        } else if (solutionPlacement) {
          let boardValue = board.getIn(["puzzle", x, y, "value"]) || -1;
          if (boardValue != solutionPlacement) {
            board = originalBoard;
            this.setState({ board }, () => {
              this.toggleHintMode();
            });
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

  renderHintSection = () => {
    const { board } = this.state;
    let onFirstStep = false;
    let onFinalStep = false;
    if (board.get("hintSteps") != undefined) {
      let currentStep = board.get("currentStep");
      let numHintSteps = board.get("hintSteps").length;
      if (currentStep + 1 == 1) onFirstStep = true;
      if (currentStep + 1 == numHintSteps) onFinalStep = true;
    }
    hintStratName = board ? board.get("hintStratName") : "Hint";
    currentStep = board ? board.get("currentStep") : -1;
    hintInfo = board ? board.get("hintInfo") : "Info";
    hintAction = board ? board.get("hintAction") : "Action";
    return (
      <HintSection
        hintStratName={hintStratName}
        hintInfo={hintInfo}
        hintAction={hintAction}
        currentStep={currentStep}
        rightArrowClicked={this.rightArrowClicked}
        leftArrowClicked={this.leftArrowClicked}
        checkMarkClicked={this.checkMarkClicked}
        onFirstStep={onFirstStep}
        onFinalStep={onFinalStep}
      />
    );
  };

  autoHint = () => {
    const { board } = this.state;
    if (!board.get("inHintMode")) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (
            !checkSolution(
              this.state.activeGame[0].puzzleSolution,
              i,
              j,
              board.get("puzzle").getIn([i, j]).get("value")
            )
          ) {
            this.toggleHintMode();
            return;
          }
        }
      }
      // no value did not match the solution, so stop trying to get new steps
      clearInterval(this.interval);
    } else {
      // if you're on the final index of the hint
      if (board.get("currentStep") + 1 === board.get("hintSteps").length) {
        this.checkMarkClicked();
      }
      // if you're not on the final step
      else {
        this.rightArrowClicked();
      }
    }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  initAutoHintTimer = () => {
    if (this.props.gameType == "Demo") {
      this.interval = setInterval(this.autoHint, 1500);
    }
  };

  render = () => {
    const { board } = this.state;
    if (!board) {
      generateGame(USERACTIVEGAMESBFFURL, this.props).then((game) => {
        this.setState(game, this.initAutoHintTimer);
      });
    }

    drillMode = this.props.gameType == "StartDrill";
    landingMode = this.props.gameType == "Demo";
    inHintMode = board ? board.get("inHintMode") : false;

    return (
      <View onKeyDown={this.handleKeyDown} styles={{ borderWidth: 1 }}>
        {board && !landingMode && !drillMode && this.renderTopBar()}
        {board && this.renderPuzzle()}
        {board && (
          <View style={styles().bottomActions}>
            {!landingMode && this.renderActions()}
            {!landingMode && !inHintMode && this.renderNumberControl()}
            {drillMode && !inHintMode && this.renderSubmitButton()}
            {!landingMode && inHintMode && this.renderHintSection()}
          </View>
        )}
      </View>
    );
  };
}

interface SudokuBoardProps {
  gameType: string;
  strategies: string[];
  difficulty?: number;
  navigation?: any;
  showGameResults?: any;
}
