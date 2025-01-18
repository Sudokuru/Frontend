import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  finishSudokuGame,
  handlePause,
  isValueCorrect,
} from "./Functions/BoardFunctions";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
  generateBoxIndex,
  wrapDigit,
} from "./sudoku";
import { ActivityIndicator } from "react-native-paper";
import NumberControl from "./Components/NumberControl";
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
import { getSudokuHint } from "./Functions/HintFunctions";
import {
  HINT_NOT_HIGHLIGHTED_COLOR,
  HINT_SELECTED_COLOR,
  IDENTICAL_VALUE_COLOR,
  NOT_SELECTED_CONFLICT_COLOR,
  PEER_SELECTED_COLOR,
  SELECTED_COLOR,
  SELECTED_CONFLICT_COLOR,
  SELECTED_IDENTICAL_VALUE_COLOR,
} from "../../Styling/HighlightColors";
import { useNavigation } from "@react-navigation/native";
import Hint from "./Components/Hint";
import { GameDifficulty } from "./Functions/Difficulty";
import { SudokuStrategy } from "sudokuru";
import { saveGame } from "../../Api/Puzzles";

export interface SudokuBoardProps {
  action: "StartGame" | "ResumeGame";
  difficulty: GameDifficulty;
}

export interface HintObjectProps {
  stage: number;
  maxStage: number;
  hint: Hint;
}
export interface Hint {
  strategy: any;
  cause: any;
  groups: any;
  placements: any;
  removals: any;
  info: string;
  action: string;
}

const SudokuBoard = (props: SudokuBoardProps) => {
  const [sudokuBoard, setSudokuBoard] = useState<SudokuObjectProps>();
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

  const [sudokuHint, setSudokuHint] = useState<HintObjectProps>();

  const { strategyHintOrderSetting } = React.useContext(PreferencesContext);

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
        numHintsUsedPerStrategy={sudokuBoard.statistics.numHintsUsedPerStrategy}
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

  /**
   * Provides a hint for the current sudoku puzzle state by determining the next possible move
   * based on the specified strategy order. The hint is generated using the current puzzle state,
   * solution, and an updated strategy array which prioritizes the "AMEND_NOTES" strategy.
   *
   * Updates the hint statistics, including total hints used and hints used per strategy.
   * Clears the currently selected cells on the board to prepare for hint visualization.
   *
   * The hint information is stored in the component's state, including the hint stage and
   * maximum stages for hint visualization.
   */
  const getHint = () => {
    const updatedArray: SudokuStrategy[] = [...strategyHintOrderSetting];

    // prioritize "AMEND_NOTES" and "SIMPLIFY_NOTES"
    updatedArray.unshift("SIMPLIFY_NOTES");
    updatedArray.unshift("AMEND_NOTES");

    const returnedHint = getSudokuHint(
      sudokuBoard.puzzle,
      sudokuBoard.puzzleSolution,
      updatedArray
    );

    // unselect board and increment hint statistics
    sudokuBoard.statistics.numHintsUsed++;
    let incrementedStrategy = false;
    for (const [
      i,
      strategies,
    ] of sudokuBoard.statistics.numHintsUsedPerStrategy.entries()) {
      if (strategies.hintStrategy == returnedHint.strategy) {
        sudokuBoard.statistics.numHintsUsedPerStrategy[i].numHintsUsed++;
        incrementedStrategy = true;
        break;
      }
    }
    if (!incrementedStrategy) {
      sudokuBoard.statistics.numHintsUsedPerStrategy.push({
        hintStrategy: returnedHint.strategy,
        numHintsUsed: 1,
      });
    }
    setSudokuBoard({
      ...sudokuBoard,
      statistics: sudokuBoard.statistics,
      selectedCells: [],
    });

    setSudokuHint({
      stage: 1,
      hint: returnedHint,
      maxStage: 5,
    });
  };

  /**
   * Toggles whether or not the board is in note mode. In note mode, the user can
   * enter notes into the cells of the board. If the board is not in note mode, the
   * user can enter values into the cells of the board.
   */
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
   * Updates the entries of the selected cells based on the user input value.
   * Handles both note and value modes, and updates game state accordingly.
   *
   * - If no cells are selected, the function returns immediately.
   * - Prevents multiple value entries if not in note mode.
   * - Skips any cells that are marked as 'given' or already have the correct value.
   * - Updates the cell entry value and type, and tracks changes in the action history.
   * - If a wrong value is inserted, increments the numWrongCellsPlayed statistic.
   * - Saves the current game state after updates.
   * - Checks if the game is solved upon updating values and updates the game over state.
   *
   * @param inputValue User input value (0-9) to be inserted into the selected cells.
   */
  const updateCellEntry = (inputValue: number) => {
    if (sudokuBoard.selectedCells.length === 0) {
      return;
    }

    // we can return if we are attempting to insert multiple values
    if (
      inputValue !== 0 &&
      !sudokuBoard.inNoteMode &&
      sudokuBoard.selectedCells.length > 1
    ) {
      return;
    }

    const newActionHistory: GameAction[] = [];
    let cellsHaveUpdates = false;

    const currentSelectedCells = getSelectedCells();

    // We do not need to take action if this is a given value
    for (let i = 0; i < currentSelectedCells.length; i++) {
      if (currentSelectedCells[i].type === "given") {
        continue;
      }

      const r: number = sudokuBoard.selectedCells[i].r;
      const c: number = sudokuBoard.selectedCells[i].c;
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
      const score = finishSudokuGame(
        sudokuBoard.statistics.difficulty,
        sudokuBoard.statistics.numHintsUsed,
        sudokuBoard.statistics.numHintsUsedPerStrategy,
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
   * @param currentType Type of the current cell ("value" or "note")
   * @param currentEntry The current entry in the cell (number or array of numbers)
   * @param r Row index of the current cell
   * @param c Column index of the current cell
   */
  const setCellEntryValue = (
    inputValue: number,
    currentType: CellType,
    currentEntry: number | number[],
    r: number,
    c: number
  ) => {
    if (sudokuBoard.selectedCells.length === 0) {
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

  /**
   * Determines if the game has been solved by iterating through the
   * puzzle board and checking if the values entered in the cells are
   * correct. If any cells are incorrect, or if any cells have notes or
   * are empty, the function returns false. If all cells are correct and
   * the game has been solved, the function returns true.
   * @returns {boolean} True if the game has been solved, false otherwise.
   */
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
   * event.ctrlKey, event.metaKey and event.shiftKey are from React Native Web, which does not export types that we can use
   * https://stackoverflow.com/questions/41648156/detect-if-shift-key-is-down-react-native
   * https://github.com/necolas/react-native-web/issues/1684
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   * @param event GestureResponderEvent event type from react-native with additional options from react-native-web
   */
  const toggleSelectCell = (r: number, c: number, event: any) => {
    if (isBoardDisabled()) {
      return;
    }
    if (sudokuBoard.selectedCells.length === 0) {
      sudokuBoard.selectedCells.push({ r: r, c: c });
    } else if (event.ctrlKey || event.metaKey) {
      toggleSelectCellWithControlRules(r, c);
    } else if (event.shiftKey) {
      toggleSelectCellWithShiftRules(r, c);
    } else {
      toggleSelectCellWithDefaultRules(r, c);
    }

    setSudokuBoard({
      ...sudokuBoard,
      selectedCells: sudokuBoard.selectedCells,
    });
  };

  /**
   * Determines what deselect / select actions should take place.
   * This function is run when default behavior is desired, which is when
   * no modifier keys are pressed.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithDefaultRules = (r: number, c: number) => {
    let addCell = true;
    for (const cell of sudokuBoard.selectedCells) {
      if (cell.c === c && cell.r === r) {
        addCell = false;
      }
    }
    sudokuBoard.selectedCells = [];
    if (addCell) {
      sudokuBoard.selectedCells.push({ r: r, c: c });
    }
  };

  /**
   * Determines what deselect / select actions should take place when control/meta key is held down.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithControlRules = (r: number, c: number) => {
    let addCell = true;
    for (let i = 0; i < sudokuBoard.selectedCells.length; i++) {
      if (
        sudokuBoard.selectedCells[i].c === c &&
        sudokuBoard.selectedCells[i].r === r
      ) {
        addCell = false;
        sudokuBoard.selectedCells.splice(i, 1);
      }
    }
    if (addCell) {
      sudokuBoard.selectedCells.push({ r: r, c: c });
    }
  };

  /**
   * Determines what deselect / select actions should take place when shift key is held down.
   * @param r The row of the cell where select toggle action is taking place.
   * @param c The column of the cell where select toggle action is taking place.
   */
  const toggleSelectCellWithShiftRules = (r: number, c: number) => {
    const pointOneRow = sudokuBoard.selectedCells[0].r;
    const pointOneColumn = sudokuBoard.selectedCells[0].c;

    const selectionRowLength = r - pointOneRow;
    const selectionColumnLength = c - pointOneColumn;

    const newSelectedCells = [];
    for (let i = 0; i <= Math.abs(selectionRowLength); i++) {
      for (let j = 0; j <= Math.abs(selectionColumnLength); j++) {
        newSelectedCells.push({
          r: sudokuBoard.selectedCells[0].r + i * Math.sign(selectionRowLength),
          c:
            sudokuBoard.selectedCells[0].c +
            j * Math.sign(selectionColumnLength),
        });
      }
    }
    sudokuBoard.selectedCells = newSelectedCells;
  };



  /**
   * Counts the total number of remaining playable cells for a given value.
   * @param value The value to look for.
   * @returns The number of cells found that match the value and are playable.
   */
  const getRemainingCellCountOfValue = (value: number) => {
    let cellCountOfValue = 0;
    for (let r = 0; r < sudokuBoard.puzzle.length; r++) {
      for (let c = 0; c < sudokuBoard.puzzle[r].length; c++) {
        if (
          sudokuBoard.puzzle[r][c].type === "note" ||
          sudokuBoard.puzzle[r][c].entry === 0 || doesCellHaveConflict(r, c, sudokuBoard.puzzle[r][c])
        ) {
          if (sudokuBoard.puzzleSolution[r][c] === value) {
            cellCountOfValue++;
          }
        }
      }
    }
    return cellCountOfValue;
  };

  /**
   * Checks if a given cell in the puzzle has a conflict with the solution.
   *
   * @param r - The row index of the cell.
   * @param c - The column index of the cell.
   * @param cell - The cell object containing its type and entry.
   * @returns True if the cell's entry is incorrect; false otherwise.
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

  /**
   * Determines if there are any incorrect values in the board
   * @returns True if there are no correct values in board, False otherwise
   */
  const doesBoardHaveConflict = (): boolean => {
    for (let r = 0; r < sudokuBoard.puzzle.length; r++) {
      for (let c = 0; c < sudokuBoard.puzzle[r].length; c++) {
        if (sudokuBoard.puzzle[r][c].type === "given") continue;
        if (
          sudokuBoard.puzzle[r][c].type === "note" ||
          sudokuBoard.puzzle[r][c].entry === 0
        )
          continue;
        const isCellIncorrect = doesCellHaveConflict(
          r,
          c,
          sudokuBoard.puzzle[r][c]
        );
        if (isCellIncorrect === true) {
          return true;
        }
      }
    }
    return false;
  };

  const isBoardDisabled = () => {
    if (sudokuHint != null) {
      return true;
    } else {
      return false;
    }
  };

  const renderCell = (cell: CellProps, r: number, c: number) => {
    const cellBackgroundColor = getCellBackgroundColor(cell, r, c);
    const disable: boolean = isBoardDisabled();
    const noteColor: string[] = getCellNotesColor(r, c);
    const backgroundNotesColor: string[] =
      getCellBackgroundNotesColor(cellBackgroundColor);

    return (
      <Cell
        disable={disable}
        onClick={(r: number, c: number, event: any) => {
          toggleSelectCell(r, c, event);
        }}
        backgroundColor={cellBackgroundColor}
        noteColor={noteColor}
        backgroundNoteColor={backgroundNotesColor}
        type={cell.type}
        entry={cell.entry}
        key={r + ":" + c}
        c={c}
        r={r}
      />
    );
  };

  /**
   * This function returns an array of 9 strings representing the colors of the
   * notes for the cell at row r and column c. The colors returned are black
   * unless the cell is part of a note removal hint and the hint is currently
   * being displayed. In the case of a note removal hint, the color of the
   * removed note will be red. The inputs r and c are the row and column of the
   * cell for which the note colors should be determined.
   * @param r the row of the cell for which the note colors should be determined
   * @param c the column of the cell for which the note colors should be
   * determined
   */
  const getCellNotesColor = (r: number, c: number) => {
    const notesToReturn = Array(9).fill("black");
    // change note color to red for note removals as part of hint
    if (sudokuHint && sudokuHint.stage === 4) {
      const hintNotes = JSON.parse(JSON.stringify(sudokuHint.hint.removals));
      for (const notes of hintNotes) {
        if (notes[0] === r && notes[1] === c) {
          notes.splice(0, 2);
          for (const note of notes) {
            notesToReturn[note - 1] = "red";
          }
        }
      }
    }
    return notesToReturn;
  };

  const getCellBackgroundNotesColor = (cellBackgroundColor: string) => {
    return Array(9).fill(cellBackgroundColor);
  };

  /**
   * Determines the background color of a cell based on its state and properties.
   *
   * @param cell - The cell properties including its value and notes.
   * @param r - The row index of the cell.
   * @param c - The column index of the cell.
   * @returns The background color as a string based on the cell's selection, conflict status,
   *          peer relationship, identical value presence, and hint associations.
   *
   * The function evaluates the cell's state to set the background color. It considers
   * if the cell is selected, in conflict, a peer to the selected cell, or has identical
   * values with another cell, and assigns a color accordingly. Additionally, it checks
   * if the cell is part of a hint, adjusting the color to reflect its role in the hint.
   */
  const getCellBackgroundColor = (
    cell: CellProps,
    r: number,
    c: number
  ): string => {
    const selectedCell = sudokuBoard.selectedCells;
    const selected: boolean = isCellSelected(r, c, selectedCell);
    const conflict: boolean = doesCellHaveConflict(r, c, cell);
    const peer: boolean = isCellPeer(r, c, selectedCell);
    const identicalValue: boolean = doesCellHaveIdenticalValue(cell);

    let cellBackgroundColor;
    if (conflict && !selected) {
      cellBackgroundColor = NOT_SELECTED_CONFLICT_COLOR;
    } else if (conflict && selected) {
      cellBackgroundColor = SELECTED_CONFLICT_COLOR;
    } else if (selected && identicalValue) {
      cellBackgroundColor = SELECTED_IDENTICAL_VALUE_COLOR;
    } else if (selected) {
      cellBackgroundColor = SELECTED_COLOR;
    } else if (identicalValue) {
      cellBackgroundColor = IDENTICAL_VALUE_COLOR;
    } else if (peer) {
      cellBackgroundColor = PEER_SELECTED_COLOR;
    } else {
      cellBackgroundColor = "white";
    }

    if (sudokuHint) {
      const hintCause = isCellAHintCause(r, c);
      const hintFocus = isCellAHintFocus(r, c);

      if (hintCause) {
        cellBackgroundColor = HINT_SELECTED_COLOR;
      } else if (!hintFocus) {
        cellBackgroundColor = HINT_NOT_HIGHLIGHTED_COLOR;
      }
    }

    return cellBackgroundColor;
  };

  /**
   * Determines if a cell is a cause of a hint. A cause is a cell that is relevant to the hint and is highlighted in the hint.
   * @param r The row coordinate of the cell to check
   * @param c The column coordinate of the cell to check
   * @returns True if the cell is a cause of the hint, false otherwise
   */
  const isCellAHintCause = (r: number, c: number): boolean => {
    if (!sudokuHint) {
      return false;
    }

    for (const cause of sudokuHint.hint.cause) {
      if (cause[0] === r && cause[1] === c && sudokuHint.stage >= 4) {
        return true;
      }
    }
    return false;
  };

  /**
   * Determines if a cell is a focus of a hint. A focus is the region the user should be focused on during a hint.
   * @param r The row coordinate of the cell to check.
   * @param c The column coordinate of the cell to check.
   * @returns True if the cell is a focus of the hint, false otherwise.
   */
  const isCellAHintFocus = (r: number, c: number): boolean => {
    if (!sudokuHint) {
      return false;
    }

    if (sudokuHint.stage < 3) {
      return true;
    }

    let hintFocused = false;
    for (const group of sudokuHint.hint.groups) {
      const cellSharesGroupRow = group[0] === 0 && group[1] === r;
      const cellSharesGroupColumn = group[0] === 1 && group[1] === c;
      const cellSharesGroupBox =
        group[0] === 2 && generateBoxIndex(r, c) === group[1];

      if (cellSharesGroupRow || cellSharesGroupColumn || cellSharesGroupBox) {
        return true;
      }
    }

    return hintFocused;
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
      for (const cell of selectedCell) {
        if (c === cell.c && r === cell.r) {
          isCellSelected = true;
        }
      }
      return isCellSelected;
    }
  };

  /**
   * Determines if a cell should be highlighted as having an identical value to the selected cell.
   * @param cell The cell to check
   * @returns True if the cell should be highlighted as having an identical value, false otherwise
   * @remarks
   * This function will return false if no cells are selected, more than one cell is selected, or if the cell is empty.
   * This function will also return false if the user has disabled highlighting of identical values in their preferences.
   */
  const doesCellHaveIdenticalValue = (cell: CellProps): boolean => {
    // disable highlighting of identical values if no cells are selected or more than 1 cell is selected
    if (sudokuBoard.selectedCells.length !== 1) {
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
   * Determines if a cell should be highlighted as a peer of the selected cell.
   * Definition of peer can be found here: http://sudopedia.enjoysudoku.com/Peer.html
   * @param r The row of the cell to check.
   * @param c The column of the cell to check.
   * @param selectedCells The selected cells.
   * @returns True if the cell should be highlighted as a peer, false otherwise.
   * @remarks
   * This function will return false if no cells are selected or more than 1 cell is selected.
   * This function will also return false if the user has disabled highlighting of peers in their preferences.
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
    if (sudokuBoard.selectedCells.length === 0) {
      return [];
    }
    const selectedCells: CellProps[] = [];
    for (const selectedCell of sudokuBoard.selectedCells) {
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
        if (sudokuBoard.actionHistory.length !== 0) {
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
      case "H":
      case "h":
        if (!doesBoardHaveConflict()) {
          if (sudokuHint) {
            updateHintStage(1);
          } else {
            getHint();
          }
        }
        return;
      default:
        break;
    }

    if (sudokuBoard.selectedCells.length === 0) {
      return;
    }

    if (/^[1-9]$/.test(inputValue)) {
      updateCellEntry(parseInt(inputValue, 10));
      return;
    }

    switch (inputValue) {
      case "Delete":
      case "Backspace":
      case "0":
      case "e":
      case "E":
        eraseSelected();
        break;
    }

    for (let i = 0; i < sudokuBoard.selectedCells.length; i++) {
      let newCol = sudokuBoard.selectedCells[i].c;
      let newRow = sudokuBoard.selectedCells[i].r;
      switch (inputValue) {
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
      sudokuBoard.selectedCells[i] = { r: newRow, c: newCol };
    }
    setSudokuBoard({
      ...sudokuBoard,
      selectedCells: sudokuBoard.selectedCells,
    });
  };

  const renderPuzzle = () => {
    return <Puzzle renderCell={renderCell} sudokuBoard={sudokuBoard} />;
  };

  /**
   * Renders the number control component based on the state of the selected cells.
   * If there is at least one cell that can be updated, the number buttons are enabled.
   * Number buttons are disabled if we are in value mode and multiple cells are selected.
   */
  const renderNumberControl = () => {
    if (sudokuHint) {
      return;
    }
    let currentSelectedCells: CellProps[] = [];
    let enableNumberButtons = false;

    if (sudokuBoard.selectedCells.length > 0) {
      currentSelectedCells = getSelectedCells();
    }

    if (currentSelectedCells.length != 0) {
      for (let i = 0; i < currentSelectedCells.length; i++) {
        // if there is at least one cell that can be updated, we enable number buttons
        if (
          !areCellUpdatesDisabled(
            currentSelectedCells[i],
            sudokuBoard.selectedCells[i].r,
            sudokuBoard.selectedCells[i].c
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
        getRemainingCellCountOfValue={getRemainingCellCountOfValue}
      />
    );
  };

  /**
   * Checks if the given cell is disabled from being updated.
   * A cell is disabled from being updated if it is a given cell or if it is a value cell with a correct value.
   * @param cell The cell to check.
   * @param r The row index of the cell.
   * @param c The column index of the cell.
   * @returns True if the cell is disabled from being updated, false otherwise.
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

  /**
   * Renders the action row component based on the state of the Sudoku board.
   * If there is a hint, nothing is rendered.
   * Otherwise, the action row component is rendered with the state of the Sudoku board.
   * @returns The rendered action row component.
   */
  const renderActions = () => {
    if (sudokuHint) {
      return;
    }
    const inNoteMode = sudokuBoard.inNoteMode;
    const boardHasConflict = doesBoardHaveConflict();
    const eraseButtonDisabled = isEraseButtonDisabled();
    const isUndoButtonDisabled = sudokuBoard.actionHistory.length === 0;

    return (
      <ActionRow
        isEraseButtonDisabled={eraseButtonDisabled}
        isUndoButtonDisabled={isUndoButtonDisabled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        getHint={getHint}
        boardHasConflict={boardHasConflict}
      />
    );
  };

  /**
   * Renders the hint component if sudokuHint is not null.
   * This component should be rendered when the user has requested a hint.
   * The component will display the hint message and the current stage of the hint.
   * The incrementStage function is used to update the stage of the hint.
   * @returns The hint component if sudokuHint is not null.
   */
  const renderHint = () => {
    if (!sudokuHint) {
      return;
    }

    return (
      <Hint
        hint={sudokuHint.hint}
        stage={sudokuHint.stage}
        maxStage={sudokuHint.maxStage}
        incrementStage={updateHintStage}
      />
    );
  };

  /**
   * @returns true if the erase button should be disabled, false otherwise.
   * The erase button is disabled if either:
   * 1. No cells are selected.
   * 2. All selected cells are either given, empty, or correct.
   */
  const isEraseButtonDisabled = () => {
    const currentSelectedCells: CellProps[] = getSelectedCells();
    if (sudokuBoard.selectedCells.length === 0) {
      return true;
    }
    for (let i = 0; i < currentSelectedCells.length; i++) {
      const isCellGiven = currentSelectedCells[i].type === "given";
      const isCellEmpty =
        currentSelectedCells[i].type === "value" &&
        currentSelectedCells[i].entry === 0;
      const isCellCorrect =
        currentSelectedCells[i].type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCells[i].r][
            sudokuBoard.selectedCells[i].c
          ],
          currentSelectedCells[i].entry as number
        );
      // disable erase button if value === 0 or is given
      if (!isCellGiven && !isCellEmpty && !isCellCorrect) {
        return false;
      }
    }
    return true;
  };

  /**
   * Replaces the cells in the Sudoku board with new cell data and updates the action history.
   *
   * This function iterates over the provided locations and replaces the corresponding cells
   * in the board with the new cell types and entries from the `cells` array. It also records
   * the previous state of these cells in the action history for undo functionality and saves the
   * updated game state.
   *
   * @param cells - An array of new cell data to be placed into the Sudoku board.
   * @param locations - An array of cell locations that specify where to place the new cell data.
   */
  const replaceSudokuBoardCells = (
    cells: CellProps[],
    locations: CellLocation[]
  ) => {
    const actionHistory: GameAction[] = [];
    for (const [i, location] of locations.entries()) {
      actionHistory.push({
        cell: {
          entry: sudokuBoard.puzzle[location.r][location.c].entry,
          type: sudokuBoard.puzzle[location.r][location.c].type,
        } as CellProps,
        cellLocation: { c: location.c, r: location.r },
      });
      sudokuBoard.puzzle[location.r][location.c].type = cells[i].type;
      sudokuBoard.puzzle[location.r][location.c].entry = cells[i].entry;
    }
    sudokuBoard.actionHistory.push(actionHistory);
    saveGame(sudokuBoard);
    setSudokuBoard({
      ...sudokuBoard,
      puzzle: sudokuBoard.puzzle,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  /**
   * Increments the hint stage depending on user actions
   * This is an incredibly messy function, but it works.
   * I am thinking this is ok since we are planning on revising the hint api.
   * @param stageOffset A number (-1) or (1) that represents how to alter hint stage
   * @returns void
   */
  const updateHintStage = (stageOffset: number) => {
    if (stageOffset != -1 && stageOffset != 1) {
      return;
    }
    if (!sudokuHint) {
      return;
    }

    switch (sudokuHint.stage + stageOffset) {
      case 0: {
        setSudokuHint(undefined);
        return;
      }
      case sudokuHint.maxStage + 1: {
        setSudokuHint(undefined);
        if (isGameSolved()) {
          const score = finishSudokuGame(
            sudokuBoard.statistics.difficulty,
            sudokuBoard.statistics.numHintsUsed,
            sudokuBoard.statistics.numHintsUsedPerStrategy,
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
        }
        return;
      }
      default: {
        const amendNotesUndoStage =
          stageOffset === -1 &&
          sudokuHint.stage === 4 &&
          sudokuHint.hint.strategy === "AMEND_NOTES";

        const undoStage = stageOffset === -1 && sudokuHint.stage === 5;

        if (amendNotesUndoStage || undoStage) {
          undo();
        }

        setSudokuHint({
          ...sudokuHint,
          stage: sudokuHint.stage + stageOffset,
        });
      }
    }

    const currentStage = sudokuHint.stage + stageOffset; // keep track of updated state

    const removals: number[][] = JSON.parse(
      JSON.stringify(sudokuHint.hint.removals)
    );

    if (
      sudokuHint.hint.strategy === "AMEND_NOTES" &&
      (currentStage === 4 || currentStage === 5)
    ) {
      const r = sudokuHint.hint.removals[0][0];
      const c = sudokuHint.hint.removals[0][1];
      const removals = [...sudokuHint.hint.removals[0]]; // deep clone to prevent sudokuHint state update
      removals.splice(0, 2);

      let notesWereUpdated = false;

      const allNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let newNotes: number[] = [];
      if (sudokuBoard.puzzle[r][c].type == "note") {
        newNotes = [...(sudokuBoard.puzzle[r][c].entry as number[])];
      }
      // Insert missing notes due to AMEND_NOTES hint
      if (currentStage === 4) {
        for (const note of allNotes) {
          if (!removals.includes(note) && !newNotes.includes(note)) {
            newNotes.push(note);
            notesWereUpdated = true;
          }
        }
      }
      // Remove unnecessary notes due to AMEND_NOTES hint
      else if (currentStage === 5 && sudokuBoard.puzzle[r][c].type == "note") {
        newNotes = sudokuBoard.puzzle[r][c].entry as number[];
        for (const note of removals) {
          if (newNotes.includes(note)) {
            const index = newNotes.indexOf(note);
            newNotes.splice(index, 1);
          }
        }
      }

      if (notesWereUpdated) {
        replaceSudokuBoardCells(
          [{ type: "note", entry: newNotes }],
          [{ c: c, r: r }]
        );
      }
    } else if (
      sudokuHint.hint.strategy === "OBVIOUS_SINGLE" &&
      currentStage === 5
    ) {
      const r = sudokuHint.hint.placements[0][0];
      const c = sudokuHint.hint.placements[0][1];
      const placements = [...sudokuHint.hint.placements[0]]; // deep clone to prevent sudokuHint state update
      placements.splice(0, 2);

      replaceSudokuBoardCells(
        [{ type: "value", entry: placements[0] }],
        [{ c: c, r: r }]
      );
    } else if (currentStage === 5) {
      const cells: CellProps[] = [];
      const locations: CellLocation[] = [];
      for (const removal of removals) {
        const r = removal[0];
        const c = removal[1];
        removal.splice(0, 2);

        let newNotes = [...(sudokuBoard.puzzle[r][c].entry as number[])];
        for (const note of removal) {
          if (newNotes.includes(note)) {
            const index = newNotes.indexOf(note);
            newNotes.splice(index, 1);
          }
        }
        cells.push({ type: "note", entry: newNotes });
        locations.push({ c: c, r: r });
      }
      replaceSudokuBoardCells(cells, locations);
    }
  };

  return (
    <View
      testID={"sudokuBoard"}
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
      {renderHint()}
    </View>
  );
};

export default SudokuBoard;
