import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { finishGame, handlePause, saveGame } from "./Functions/BoardFunctions";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
  wrapDigit,
} from "./sudoku";
import { ActivityIndicator } from "react-native-paper";
import NumberControl from "./Components/NumberControl";
import { isValueCorrect } from "./Functions/BoardFunctions";
import Cell from "./Components/Cell";
import ActionRow from "./Components/ActionRow";
import { generateGame } from "./Functions/generateGame";
import Puzzle from "./Components/Puzzle";
import {
  CellLocation,
  CellProps,
  CellType,
  GameAction,
  SudokuObjectProps,
} from "../../Functions/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import HeaderRow from "./Components/HeaderRow";
import EndGameModal from "./Components/EndGameModal";
import {
  IDENTICAL_VALUE_COLOR,
  NOT_SELECTED_CONFLICT_COLOR,
  PEER_SELECTED_COLOR,
  SELECTED_COLOR,
  SELECTED_CONFLICT_COLOR,
} from "../../Styling/HighlightColors";
import { useNavigation } from "@react-navigation/native";
import { GameDifficulty } from "./Functions/Difficulty";

export interface SudokuBoardProps {
  action: "StartGame" | "ResumeGame";
  difficulty: GameDifficulty;
}

const SudokuBoard = (props: SudokuBoardProps) => {
  const [sudokuBoard, setSudokuBoard] = useState<SudokuObjectProps>();
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    generateGame(props).then((game) => {
      if (game == null) {
        return;
      }
      setSudokuBoard(game);
    });
  }, []);

  // if we are loading then we return the loading icon
  if (sudokuBoard == null) {
    return <ActivityIndicator animating={true} color="red" />;
  }

  // Render EndGame screen when game has ended
  if (gameOver) {
    return (
      <EndGameModal
        score={sudokuBoard.statistics.score}
        time={sudokuBoard.statistics.time}
        difficulty={sudokuBoard.statistics.difficulty}
        numHintsUsed={sudokuBoard.statistics.numHintsUsed}
        numWrongCellsPlayed={sudokuBoard.statistics.numWrongCellsPlayed}
      />
    );
  }

  /**
   * Adds the previous move (most recent move stored in action history) to board
   * Example:
   * moves: r0c0 insert 5, r1c1 insert 6, r1c1 insert 7
   * actionHistory: r0c0 = 0, r1c1 = 0, r1c1 = 6
   * Undo will insert 6 into r1c1, then insert 0 into r1c1, then insert 0 into r0c0
   */
  const undo = () => {
    // Adding previous moves back to the board
    const moves = sudokuBoard.actionHistory.pop();
    if (!moves || moves.length === 0) {
      return;
    }
    for (const move of moves) {
      sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].type =
        move.cell.type;
      sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].entry =
        move.cell.entry;
    }
    // remove from move history
    setSudokuBoard({
      ...sudokuBoard,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  const toggleNoteMode = () => {
    sudokuBoard.inNoteMode = !sudokuBoard.inNoteMode;
    setSudokuBoard({
      ...sudokuBoard,
      inNoteMode: sudokuBoard.inNoteMode,
    });
  };

  /**
   * Called when the user hits the 'erase' button
   * If notes are present in selected cell, removes all notes
   * If value is present in selected cell, removes value if value is incorrect
   */
  const eraseSelected = () => {
    updateCellEntry(0);
  };

  /**
   * Inserts or removes a note or value from a selected cell
   * @param inputValue User input 0-9
   */
  const updateCellEntry = (inputValue: number) => {
    if (sudokuBoard.selectedCell.length === 0) {
      return;
    }

    const newActionHistory: GameAction[] = [];
    let cellsHaveUpdates = false;

    const currentSelectedCells = getSelectedCells();

    // We do not take action if more than one cell is selected and we are not in note mode
    if (currentSelectedCells.length > 1 && !sudokuBoard.inNoteMode) {
      return;
    }

    // We do not need to take action if this is a given value
    for (let i = 0; i < currentSelectedCells.length; i++) {
      if (currentSelectedCells[i].type === "given") {
        continue;
      }

      const r: number = sudokuBoard.selectedCell[i].r;
      const c: number = sudokuBoard.selectedCell[i].c;
      const currentEntry = currentSelectedCells[i].entry;
      const currentType = currentSelectedCells[i].type;

      // We do not need to take action if value is correct
      if (
        currentType === "value" &&
        isValueCorrect(sudokuBoard.puzzleSolution[r][c], currentEntry as number)
      ) {
        continue;
      }

      cellsHaveUpdates = true;

      // Incrementing numWrongCellsPlayed value
      if (
        !sudokuBoard.inNoteMode &&
        !isValueCorrect(sudokuBoard.puzzleSolution[r][c], inputValue)
      ) {
        sudokuBoard.statistics.numWrongCellsPlayed++;
      }

      // Set new Cell Value
      setCellEntryValue(inputValue, currentType, currentEntry, r, c);

      newActionHistory.push({
        cell: { entry: currentEntry, type: currentType } as CellProps, // annoying typescript casting workaround
        cellLocation: { c: c, r: r },
      });
    }

    // selected values are all correct values or givens
    if (!cellsHaveUpdates) {
      return;
    }

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push(newActionHistory);

    // Saving current game status
    saveGame(sudokuBoard);

    if (!sudokuBoard.inNoteMode && isGameSolved()) {
      const score = finishGame(
        sudokuBoard.statistics.difficulty,
        sudokuBoard.statistics.numHintsUsed,
        sudokuBoard.statistics.numWrongCellsPlayed,
        sudokuBoard.statistics.time
      );
      sudokuBoard.statistics.score = score;
      setSudokuBoard({
        ...sudokuBoard,
        puzzle: sudokuBoard.puzzle,
        actionHistory: sudokuBoard.actionHistory,
        statistics: sudokuBoard.statistics,
      });
      setGameOver(true);
    } else {
      setSudokuBoard({
        ...sudokuBoard,
        puzzle: sudokuBoard.puzzle,
        actionHistory: sudokuBoard.actionHistory,
        statistics: sudokuBoard.statistics,
      });
    }
  };

  /**
   * Sub function of @function updateCellEntry
   * Updates the selected cell updated based on the user input value and what is currently in the cell
   * @param inputValue User input 0-9
   */
  const setCellEntryValue = (
    inputValue: number,
    currentType: CellType,
    currentEntry: number | number[],
    r: number,
    c: number
  ) => {
    if (sudokuBoard.selectedCell.length === 0) {
      return;
    }

    // This value will be overridden if we are in note mode
    let newCellEntry: number | number[] = inputValue;
    // update type of selected cell
    if (
      (!sudokuBoard.inNoteMode && currentType === "note") ||
      inputValue === 0
    ) {
      sudokuBoard.puzzle[r][c].type = "value";
    }
    // update type and newCellEntry of selected cell
    else if (sudokuBoard.inNoteMode && currentType === "value") {
      sudokuBoard.puzzle[r][c].type = "note";
      newCellEntry = [inputValue];
    }
    // handling case where there is one note remaining
    // and that is removed via note press
    else if (
      sudokuBoard.inNoteMode &&
      currentType === "note" &&
      (currentEntry as number[]).length === 1 &&
      (currentEntry as number[])[0] === inputValue
    ) {
      sudokuBoard.puzzle[r][c].type = "value";
      newCellEntry = 0;
    }
    // set new note value
    else if (sudokuBoard.inNoteMode) {
      const currentEntryCopy = JSON.parse(JSON.stringify(currentEntry));
      if (currentEntryCopy.includes(inputValue)) {
        newCellEntry = currentEntryCopy.filter(
          (note: number) => note != inputValue
        );
      } else {
        currentEntryCopy.push(inputValue);
        newCellEntry = currentEntryCopy;
      }
    }

    // updating board entry
    sudokuBoard.puzzle[r][c].entry = newCellEntry;
  };

  const isGameSolved = (): boolean => {
    for (let r = 0; r < sudokuBoard.puzzle.length; r++) {
      for (let c = 0; c < sudokuBoard.puzzle[r].length; c++) {
        if (sudokuBoard.puzzle[r][c].type === "given") continue;
        if (
          sudokuBoard.puzzle[r][c].type === "note" ||
          sudokuBoard.puzzle[r][c].entry === 0
        ) {
          return false;
        }
        const isValueCorrectResult = isValueCorrect(
          sudokuBoard.puzzleSolution[r][c],
          sudokuBoard.puzzle[r][c].entry as number
        );
        if (isValueCorrectResult === false) {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Toggles whether or not a cell is selected on click
   * event.ctrlKey and event.shiftKey are from React Native Web, which does not export types that we can use
   * https://stackoverflow.com/questions/41648156/detect-if-shift-key-is-down-react-native
   * https://github.com/necolas/react-native-web/issues/1684
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   */
  const toggleSelectCell = (r: number, c: number, event: any) => {
    if (sudokuBoard.selectedCell.length === 0) {
      sudokuBoard.selectedCell.push({ r: r, c: c });
    } else if (event.ctrlKey) {
      toggleSelectCellWithControlRules(r, c);
    } else if (event.shiftKey) {
      toggleSelectCellWithShiftRules(r, c);
    } else {
      toggleSelectCellWithDefaultRules(r, c);
    }

    setSudokuBoard({
      ...sudokuBoard,
      selectedCell: sudokuBoard.selectedCell,
    });
  };

  /**
   * Determines what deselect / select actions should take place.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithDefaultRules = (r: number, c: number) => {
    let addCell = true;
    for (let i = 0; i < sudokuBoard.selectedCell.length; i++) {
      if (
        sudokuBoard.selectedCell[i].c === c &&
        sudokuBoard.selectedCell[i].r === r
      ) {
        addCell = false;
      }
    }
    sudokuBoard.selectedCell = [];
    if (addCell) {
      sudokuBoard.selectedCell.push({ r: r, c: c });
    }
  };

  /**
   * Determines what deselect / select actions should take place when control key is held down.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithControlRules = (r: number, c: number) => {
    let addCell = true;
    for (let i = 0; i < sudokuBoard.selectedCell.length; i++) {
      if (
        sudokuBoard.selectedCell[i].c === c &&
        sudokuBoard.selectedCell[i].r === r
      ) {
        addCell = false;
        sudokuBoard.selectedCell.splice(i, 1);
      }
    }
    if (addCell) {
      sudokuBoard.selectedCell.push({ r: r, c: c });
    }
  };

  /**
   * Determines what deselect / select actions should take place when shift key is held down.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithShiftRules = (r: number, c: number) => {
    const pointOneRow = sudokuBoard.selectedCell[0].r;
    const pointOneColumn = sudokuBoard.selectedCell[0].c;

    const selectionRowLength = r - pointOneRow;
    const selectionColumnLength = c - pointOneColumn;

    const newSelectedCells = [];
    for (let i = 0; i <= Math.abs(selectionRowLength); i++) {
      for (let j = 0; j <= Math.abs(selectionColumnLength); j++) {
        newSelectedCells.push({
          r: sudokuBoard.selectedCell[0].r + i * Math.sign(selectionRowLength),
          c:
            sudokuBoard.selectedCell[0].c +
            j * Math.sign(selectionColumnLength),
        });
      }
    }
    sudokuBoard.selectedCell = newSelectedCells;
  };

  /**
   * Determines if a cell in the puzzle has an incorrect value
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   * @param cell The cell object
   * @returns True if the value in a cell is incorrect, False otherwise
   */
  const doesCellHaveConflict = (
    r: number,
    c: number,
    cell: CellProps
  ): boolean => {
    if (cell.type == "note" || cell.entry == 0) {
      return false;
    }
    return !(
      sudokuBoard.puzzle[r][c].entry === sudokuBoard.puzzleSolution[r][c]
    );
  };

  const renderCell = (cell: CellProps, r: number, c: number) => {
    const cellBackgroundColor = getCellBackgroundColor(cell, r, c);

    return (
      <Cell
        onClick={(r: number, c: number, event: any) => {
          toggleSelectCell(r, c, event);
        }}
        backgroundColor={cellBackgroundColor}
        type={cell.type}
        entry={cell.entry}
        key={r + ":" + c}
        c={c}
        r={r}
      />
    );
  };

  /**
   * Determines the background color of a cell based on the user's settings, the game state, the cell coordinates, and other factors
   * @param cell The provided cell
   * @param r The row coordinate of the provided cell
   * @param c The column coordinate of the provided cell
   * @returns A hex string that determines the background color of the cell
   */
  const getCellBackgroundColor = (
    cell: CellProps,
    r: number,
    c: number
  ): string => {
    const selectedCell = sudokuBoard.selectedCell;
    const selected: boolean = isCellSelected(r, c, selectedCell);
    const conflict: boolean = doesCellHaveConflict(r, c, cell);
    const peer: boolean = isCellPeer(r, c, selectedCell);
    const identicalValue: boolean = doesCellHaveIdenticalValue(cell);

    let cellBackgroundColor;
    if (conflict && !selected) {
      cellBackgroundColor = NOT_SELECTED_CONFLICT_COLOR;
    } else if (conflict && selected) {
      cellBackgroundColor = SELECTED_CONFLICT_COLOR;
    } else if (selected) {
      cellBackgroundColor = SELECTED_COLOR;
    } else if (identicalValue) {
      cellBackgroundColor = IDENTICAL_VALUE_COLOR;
    } else if (peer) {
      cellBackgroundColor = PEER_SELECTED_COLOR;
    } else {
      cellBackgroundColor = "white";
    }
    return cellBackgroundColor;
  };

  /**
   * Determines if the coordinates provided match with the selected cell
   * @param r The row coordinate of a cell
   * @param c The column coordinate of a cell
   * @param selectedCell The selected cell
   * @returns false if selectedCell is empty or does not match the coordinates provided
   */
  const isCellSelected = (
    r: number,
    c: number,
    selectedCell: CellLocation[]
  ): boolean => {
    if (selectedCell.length === 0) {
      return false;
    } else {
      let isCellSelected = false;
      for (let i = 0; i < selectedCell.length; i++) {
        if (c === selectedCell[i].c && r === selectedCell[i].r) {
          isCellSelected = true;
        }
      }
      return isCellSelected;
    }
  };

  /**
   * Determines if the provided cell has the same value as the selected cell
   * @param cell The provided cell
   * @returns true if the provided cell's value is equal to the selected cell
   */
  const doesCellHaveIdenticalValue = (cell: CellProps): boolean => {
    // disable highlighting of identical values if no cells are selected or more than 1 cell is selected
    if (sudokuBoard.selectedCell.length !== 1) {
      return false;
    }
    const { highlightIdenticalValuesSetting } =
      React.useContext(PreferencesContext);
    const currentSelectedCell = getSelectedCells();
    const currentEntry = cell.entry;
    const selectedEntry = currentSelectedCell[0].entry;
    const identicalValue = selectedEntry === currentEntry;

    return (
      highlightIdenticalValuesSetting && identicalValue && currentEntry != 0
    );
  };

  /**
   * Determines if the provided coordinates are a peer of the selected cell
   * Definition of peer can be found here: http://sudopedia.enjoysudoku.com/Peer.html
   * @param r The row coordinate of a cell
   * @param c The column coordinate of a cell
   * @param selectedCells The selected cell
   * @returns false if not a peer or selectedCell is empty, or if there is more than one selected cell, otherwise returns true
   */
  const isCellPeer = (
    r: number,
    c: number,
    selectedCells: CellLocation[]
  ): boolean => {
    // disable highlighting peers if no cells selected or more than 1 cell is selected.
    if (selectedCells.length !== 1) {
      return false;
    }

    const selectedCell = selectedCells[0];

    const { highlightBoxSetting, highlightRowSetting, highlightColumnSetting } =
      React.useContext(PreferencesContext);

    const sameBox = areCellsInSameBox({ r: r, c: c }, selectedCell);
    const sameRow = areCellsInSameRow({ r: r, c: c }, selectedCell);
    const sameColumn = areCellsInSameColumn({ r: r, c: c }, selectedCell);

    return (
      (sameBox && highlightBoxSetting) ||
      (sameRow && highlightRowSetting) ||
      (sameColumn && highlightColumnSetting)
    );
  };

  const renderTopBar = () => {
    return (
      <HeaderRow sudokuBoard={sudokuBoard} setSudokuBoard={setSudokuBoard} />
    );
  };

  const getSelectedCells = (): CellProps[] => {
    if (sudokuBoard.selectedCell.length === 0) {
      return [];
    }
    const selectedCells: CellProps[] = [];
    for (const selectedCell of sudokuBoard.selectedCell) {
      selectedCells.push(sudokuBoard.puzzle[selectedCell.r][selectedCell.c]);
    }
    return selectedCells;
  };

  /**
   * When a user presses a key down, do the desired action
   * @param event onKeyDown event for react-native-web documented here: https://necolas.github.io/react-native-web/docs/interactions/#keyboardevent-props-api
   * @returns void
   */
  const handleKeyDown = (event: any) => {
    const inputValue = event.nativeEvent.key;

    switch (inputValue) {
      case "u":
      case "U":
        const isUndoButtonDisabled = sudokuBoard.actionHistory.length === 0;
        if (!isUndoButtonDisabled) {
          undo();
        }
        return;
      case "p":
      case "P":
        handlePause(sudokuBoard, navigation);
        return;
      case "t":
      case "T":
      case "n":
      case "N":
        toggleNoteMode();
        return;
      default:
        break;
    }

    if (sudokuBoard.selectedCell.length === 0) {
      return;
    }

    if (/^[1-9]$/.test(inputValue)) {
      updateCellEntry(parseInt(inputValue, 10));
      return;
    }

    for (let i = 0; i < sudokuBoard.selectedCell.length; i++) {
      let newCol = sudokuBoard.selectedCell[i].c;
      let newRow = sudokuBoard.selectedCell[i].r;
      switch (inputValue) {
        case "Delete":
        case "Backspace":
        case "0":
        case "e":
        case "E":
          eraseSelected();
          break;
        // below cases do not return to allow for update of selected cell
        // todo create function for updating selectedCell for below cases to call
        case "ArrowLeft":
        case "a":
        case "A":
          newCol = wrapDigit(newCol - 1);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          newCol = wrapDigit(newCol + 1);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          newRow = wrapDigit(newRow - 1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          newRow = wrapDigit(newRow + 1);
          break;
        default:
          return;
      }
      sudokuBoard.selectedCell[i] = { r: newRow, c: newCol };
    }
    setSudokuBoard({
      ...sudokuBoard,
      selectedCell: sudokuBoard.selectedCell,
    });
  };

  const renderPuzzle = () => {
    return <Puzzle renderCell={renderCell} sudokuBoard={sudokuBoard} />;
  };

  const renderNumberControl = () => {
    let currentSelectedCells: CellProps[] = [];
    let enableNumberButtons = false;

    if (sudokuBoard.selectedCell.length > 0) {
      currentSelectedCells = getSelectedCells();
    }

    if (currentSelectedCells.length != 0) {
      for (let i = 0; i < currentSelectedCells.length; i++) {
        // if there is at least one cell that can be updated, we enable number buttons
        if (
          !areCellUpdatesDisabled(
            currentSelectedCells[i],
            sudokuBoard.selectedCell[i].r,
            sudokuBoard.selectedCell[i].c
          )
        ) {
          enableNumberButtons = true;
        }
      }
      // disable number buttons if we are in value mode an multiple cells are selected
      if (currentSelectedCells.length > 1 && !sudokuBoard.inNoteMode) {
        enableNumberButtons = false;
      }
    }
    return (
      <NumberControl
        areNumberButtonsDisabled={!enableNumberButtons}
        updateEntry={updateCellEntry}
      />
    );
  };

  /**
   *
   * @param cell A cell of the sudoku board
   * @param r The row of the cell
   * @param c The column of the cell
   * @returns Returns whether the given cell should allow updates or not.
   */
  const areCellUpdatesDisabled = (cell: CellProps, r: number, c: number) => {
    if (cell.type === "given") {
      return true;
    } else if (
      cell.type === "value" &&
      isValueCorrect(sudokuBoard.puzzleSolution[r][c], cell.entry)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const renderActions = () => {
    const inNoteMode = sudokuBoard.inNoteMode;
    const currentSelectedCells: CellProps[] = getSelectedCells();
    let isEraseButtonDisabled = sudokuBoard.selectedCell.length === 0;
    const isUndoButtonDisabled = sudokuBoard.actionHistory.length === 0;
    if (currentSelectedCells.length != 0) {
      for (let i = 0; i < currentSelectedCells.length; i++) {
        const isCellGiven = currentSelectedCells[i].type === "given";
        const isCellEmpty =
          currentSelectedCells[i].type === "value" &&
          currentSelectedCells[i].entry === 0;
        const isCellCorrect =
          currentSelectedCells[i].type === "value" &&
          isValueCorrect(
            sudokuBoard.puzzleSolution[sudokuBoard.selectedCell[i].r][
              sudokuBoard.selectedCell[i].c
            ],
            currentSelectedCells[i].entry as number
          );
        // disable erase button if value === 0 or is given
        if (isCellGiven || isCellEmpty || isCellCorrect) {
          isEraseButtonDisabled = true;
          break;
        }
      }
    }

    return (
      <ActionRow
        isEraseButtonDisabled={isEraseButtonDisabled}
        isUndoButtonDisabled={isUndoButtonDisabled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
      />
    );
  };

  return (
    <View
      testID={"sudokuBoard"}
      //@ts-ignore react-native-web types not supported: https://github.com/necolas/react-native-web/issues/1684
      onKeyDown={handleKeyDown}
      style={{
        alignItems: "center",
        alignContent: "center",
      }}
    >
      {renderTopBar()}
      {renderPuzzle()}
      {renderActions()}
      {renderNumberControl()}
    </View>
  );
};

export default SudokuBoard;
