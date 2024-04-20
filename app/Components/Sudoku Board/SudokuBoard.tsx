import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { finishGame, handlePause, saveGame } from "./Functions/BoardFunctions";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
  generateBoxIndex,
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
  GameDifficulty,
  SudokuObjectProps,
} from "../../Functions/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import HeaderRow from "./Components/HeaderRow";
import EndGameModal from "./Components/EndGameModal";
import { getSudokuHint } from "./Functions/HintFunctions";
import {
  HINT_NOT_HIGHILGHTED_COLOR,
  HINT_SELECTED_COLOR,
  IDENTICAL_VALUE_COLOR,
  NOT_SELECTED_CONFLICT_COLOR,
  PEER_SELECTED_COLOR,
  SELECTED_COLOR,
  SELECTED_CONFLICT_COLOR,
} from "../../Styling/HighlightColors";
import { useNavigation } from "@react-navigation/native";
import Hint from "./Components/Hint";

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
    // Adding previous move back to the board
    const move = sudokuBoard.actionHistory.pop();
    if (move == null) {
      return;
    }
    sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].type =
      move.cell.type;
    sudokuBoard.puzzle[move.cellLocation.r][move.cellLocation.c].entry =
      move.cell.entry;
    // remove from move history
    setSudokuBoard({
      ...sudokuBoard,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  const getHint = () => {
    // unselect board
    if (sudokuBoard.selectedCell != null) {
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: null,
      });
    }
    const returnedHint = getSudokuHint(
      sudokuBoard.puzzle,
      sudokuBoard.puzzleSolution
    );

    setSudokuHint({
      stage: 1,
      hint: returnedHint,
      maxStage: 5,
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
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    const currentSelectedCell = getCurrentSelectedCell() as CellProps;
    // We do not need to take action if this is a given value
    if (currentSelectedCell.type === "given") {
      return;
    }

    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;
    const currentEntry = currentSelectedCell.entry;
    const currentType = currentSelectedCell.type;

    // We do not need to take action if current value matches existing value, or if value is correct
    if (
      currentType === "value" &&
      (currentEntry === inputValue ||
        isValueCorrect(
          sudokuBoard.puzzleSolution[r][c],
          currentEntry as number
        ))
    ) {
      return;
    }

    // Set new Cell Value
    setCellEntryValue(inputValue);

    // Incrementing numWrongCellsPlayed value
    if (
      !sudokuBoard.inNoteMode &&
      !isValueCorrect(sudokuBoard.puzzleSolution[r][c], inputValue)
    ) {
      sudokuBoard.statistics.numWrongCellsPlayed++;
    }

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push({
      cell: { entry: currentEntry, type: currentType } as CellProps, // annoying typescript casting workaround
      cellLocation: { c: c, r: r },
    });

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
  const setCellEntryValue = (inputValue: number) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }
    const currentSelectedCell = getCurrentSelectedCell() as CellProps;
    const currentType = currentSelectedCell.type;
    const currentEntry = currentSelectedCell.entry;
    const r: number = sudokuBoard.selectedCell.r;
    const c: number = sudokuBoard.selectedCell.c;

    // This value will be overridden if we are in note mode
    let newCellEntry: number | number[] = inputValue;
    // update type and newCellEntry of selected cell
    if (sudokuBoard.inNoteMode && currentType === "value" && inputValue !== 0) {
      sudokuBoard.puzzle[r][c].type = "note";
      newCellEntry = [inputValue];
    }
    // update type of selected cell
    else if (
      (!sudokuBoard.inNoteMode && currentType === "note") ||
      inputValue === 0
    ) {
      sudokuBoard.puzzle[r][c].type = "value";
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
   * @param r The row of a given cell 0-8
   * @param c the column of a given cell 0-8
   */
  const toggleSelectCell = (r: number, c: number) => {
    if (isBoardDisabled()) {
      return;
    }
    if (
      sudokuBoard.selectedCell &&
      sudokuBoard.selectedCell.c === c &&
      sudokuBoard.selectedCell.r === r
    ) {
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: null,
      });
    } else {
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: { r: r, c: c },
      });
    }
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
        const isValueCorrect = doesCellHaveConflict(
          r,
          c,
          sudokuBoard.puzzle[r][c]
        );
        if (isValueCorrect === true) {
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
    const noteColor: string[] = getCellNotesColor();
    const backgroundNotesColor: string[] =
      getCellBackgroundNotesColor(cellBackgroundColor);

    return (
      <Cell
        disable={disable}
        onClick={(r: number, c: number) => {
          toggleSelectCell(r, c);
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

  const getCellNotesColor = () => {
    return [
      "black",
      "black",
      "black",
      "black",
      "black",
      "black",
      "black",
      "black",
      "black",
    ];
  };

  const getCellBackgroundNotesColor = (cellBackgroundColor: string) => {
    return [
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
      cellBackgroundColor,
    ];
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

    if (sudokuHint) {
      const hintCause = isCellAHintCause(r, c);
      const hintFocus = isCellAHintFocus(r, c);

      if (hintCause) {
        cellBackgroundColor = HINT_SELECTED_COLOR;
      } else if (!hintFocus) {
        cellBackgroundColor = HINT_NOT_HIGHILGHTED_COLOR;
      }
    }

    return cellBackgroundColor;
  };

  const isCellAHintCause = (r: number, c: number): boolean => {
    if (!sudokuHint) {
      return false;
    }

    if (
      sudokuHint.hint.cause[0][0] === r &&
      sudokuHint.hint.cause[0][1] == c &&
      sudokuHint.stage >= 4
    ) {
      return true;
    }
    return false;
  };

  const isCellAHintFocus = (r: number, c: number): boolean => {
    if (!sudokuHint) {
      return false;
    }

    if (sudokuHint.stage < 3) {
      return true;
    }

    let hintFocused = false;
    if (
      sudokuHint.hint.groups[0][0] === 0 &&
      sudokuHint.hint.groups[0][1] === r
    ) {
      hintFocused = true;
    } else if (
      sudokuHint.hint.groups[0][0] === 1 &&
      sudokuHint.hint.groups[0][1] === c
    ) {
      hintFocused = true;
    } else if (
      sudokuHint.hint.groups[0][0] === 2 &&
      generateBoxIndex(r, c) === sudokuHint.hint.groups[0][1]
    ) {
      hintFocused = true;
    }

    return hintFocused;
  };

  /**
   * Determines if the coordinates provided match with the selected cell
   * @param r The row coordinate of a cell
   * @param c The column coordinate of a cell
   * @param selectedCell The selected cell
   * @returns false if selectedCell is null or does not match the coordinates provided
   */
  const isCellSelected = (
    r: number,
    c: number,
    selectedCell: CellLocation | null
  ): boolean => {
    if (selectedCell == null) {
      return false;
    } else {
      return c === selectedCell.c && r === selectedCell.r;
    }
  };

  /**
   * Determines if the provided cell has the same value as the selected cell
   * @param cell The provided cell
   * @returns true if the provided cell's value is equal to the selected cell's value
   */
  const doesCellHaveIdenticalValue = (cell: CellProps): boolean => {
    if (sudokuBoard.selectedCell == null) {
      return false;
    }
    const { highlightIdenticalValuesSetting } =
      React.useContext(PreferencesContext);
    const currentSelectedCell = getCurrentSelectedCell() as CellProps;
    const selectedEntry = currentSelectedCell.entry;
    let currentEntry = cell.entry;
    return (
      highlightIdenticalValuesSetting &&
      selectedEntry === currentEntry &&
      currentEntry != 0
    );
  };

  /**
   * Determines if the provided coordinates are a peer of the selected cell
   * Definition of peer can be found here: http://sudopedia.enjoysudoku.com/Peer.html
   * @param r The row coordinate of a cell
   * @param c The column coordinate of a cell
   * @param selectedCell The selected cell
   * @returns false if not a peer or selectedCell is null, otherwise returns true
   */
  const isCellPeer = (
    r: number,
    c: number,
    selectedCell: CellLocation | null
  ): boolean => {
    if (selectedCell == null) {
      return false;
    }
    const { highlightBoxSetting, highlightRowSetting, highlightColumnSetting } =
      React.useContext(PreferencesContext);
    const box = areCellsInSameBox({ r: r, c: c }, selectedCell);
    const row = areCellsInSameRow({ r: r, c: c }, selectedCell);
    const column = areCellsInSameColumn({ r: r, c: c }, selectedCell);
    return (
      (box && highlightBoxSetting) ||
      (row && highlightRowSetting) ||
      (column && highlightColumnSetting)
    );
  };

  const renderTopBar = () => {
    return (
      <HeaderRow sudokuBoard={sudokuBoard} setSudokuBoard={setSudokuBoard} />
    );
  };

  const getCurrentSelectedCell = (): CellProps | null => {
    if (sudokuBoard.selectedCell == null) {
      return null;
    }
    return sudokuBoard.puzzle[sudokuBoard.selectedCell.r][
      sudokuBoard.selectedCell.c
    ];
  };

  const handleKeyDown = (event: any) => {
    if (sudokuBoard.selectedCell == null) {
      return;
    }

    const inputValue = event.nativeEvent.key;
    if (/^[1-9]$/.test(inputValue)) {
      updateCellEntry(parseInt(inputValue, 10));
    } else if (
      inputValue == "Delete" ||
      inputValue == "Backspace" ||
      inputValue == "0" ||
      inputValue == "e" ||
      inputValue == "E" // e and E are for erase
    ) {
      eraseSelected();
    } else if (inputValue == "u" || inputValue == "U") {
      undo();
    } else if (inputValue == "p" || inputValue == "P") {
      handlePause(sudokuBoard, navigation);
    } else if (
      inputValue == "t" ||
      inputValue == "T" ||
      inputValue == "n" ||
      inputValue == "N"
    ) {
      toggleNoteMode();
    } else if (sudokuBoard.selectedCell) {
      let newCol = sudokuBoard.selectedCell.c;
      let newRow = sudokuBoard.selectedCell.r;
      switch (inputValue) {
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
      setSudokuBoard({
        ...sudokuBoard,
        selectedCell: { r: newRow, c: newCol },
      });
    }
  };

  const renderPuzzle = () => {
    return <Puzzle renderCell={renderCell} sudokuBoard={sudokuBoard} />;
  };

  const renderNumberControl = () => {
    if (sudokuHint) {
      return;
    }
    let currentSelectedCell: CellProps | null = null;
    let isBoardSelected: boolean = true;
    if (sudokuBoard.selectedCell != null) {
      currentSelectedCell = getCurrentSelectedCell();
    } else {
      isBoardSelected = false;
    }
    let isGiven = false;
    let isCellCorrect = false;
    if (currentSelectedCell != null) {
      isGiven = currentSelectedCell.type === "given";
      isCellCorrect =
        currentSelectedCell.type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCell!.r][
            sudokuBoard.selectedCell!.c
          ],
          currentSelectedCell.entry
        );
    }
    return (
      <NumberControl
        areNumberButtonsDisabled={isGiven || !isBoardSelected || isCellCorrect}
        updateEntry={updateCellEntry}
      />
    );
  };

  const renderActions = () => {
    if (sudokuHint) {
      return;
    }
    const inNoteMode = sudokuBoard.inNoteMode;
    const boardHasConflict = doesBoardHaveConflict();
    let currentSelectedCell: CellProps | null = getCurrentSelectedCell();
    let isEraseButtonDisabled = sudokuBoard.selectedCell == null;
    const isUndoButtonDisabled =
      sudokuBoard.actionHistory == null ||
      sudokuBoard.actionHistory.length == 0;
    if (currentSelectedCell != null) {
      const isCellGiven = currentSelectedCell.type === "given";
      const isCellEmpty =
        currentSelectedCell.type === "value" && currentSelectedCell.entry === 0;
      const isCellCorrect =
        currentSelectedCell.type === "value" &&
        isValueCorrect(
          sudokuBoard.puzzleSolution[sudokuBoard.selectedCell!.r][
            sudokuBoard.selectedCell!.c
          ],
          currentSelectedCell.entry
        );
      // disable erase button if value === 0 or is given
      if (isCellGiven || isCellEmpty || isCellCorrect) {
        isEraseButtonDisabled = true;
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
        getHint={getHint}
        boardHasConflict={boardHasConflict}
      />
    );
  };

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
   * Increments the hint stage depending on user actions
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

    console.log(sudokuHint.stage + stageOffset);

    switch (sudokuHint.stage + stageOffset) {
      case 0:
        setSudokuHint(undefined);
        return;
      case sudokuHint.maxStage + 1:
        setSudokuHint(undefined);
        return;
      default:
        if (
          stageOffset === -1 &&
          sudokuHint.stage === 4 &&
          sudokuHint.hint.strategy === "AMEND_NOTES"
        ) {
          undo();
        } else if (stageOffset === -1 && sudokuHint.stage === 5) {
          undo();
        }
        setSudokuHint({
          ...sudokuHint,
          stage: sudokuHint.stage + stageOffset,
        });
    }

    const currentStage = sudokuHint.stage + stageOffset; // keep track of updated state

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
        for (let j = 0; j < allNotes.length; j++) {
          if (
            !removals.includes(allNotes[j]) &&
            !newNotes.includes(allNotes[j])
          ) {
            newNotes.push(allNotes[j]);
            notesWereUpdated = true;
          }
        }
      }
      // Remove unnecessary notes due to AMEND_NOTES hint
      // todo this might be shared with simplify notes logic?
      else if (currentStage === 5 && sudokuBoard.puzzle[r][c].type == "note") {
        newNotes = sudokuBoard.puzzle[r][c].entry as number[];
        for (let j = 0; j < removals.length; j++) {
          if (newNotes.includes(removals[j])) {
            const index = newNotes.indexOf(removals[j]);
            newNotes.splice(index, 1);
          }
        }
      }

      // Storing old value in actionHistory
      // todo This is duplicated code, find some way to condense
      if (notesWereUpdated) {
        sudokuBoard.actionHistory.push({
          cell: {
            entry: sudokuBoard.puzzle[r][c].entry,
            type: sudokuBoard.puzzle[r][c].type,
          } as CellProps, // annoying typescript casting workaround
          cellLocation: { c: c, r: r },
        });
        sudokuBoard.puzzle[r][c].type = "note";
        sudokuBoard.puzzle[r][c].entry = newNotes;

        saveGame(sudokuBoard);

        setSudokuBoard({
          ...sudokuBoard,
          puzzle: sudokuBoard.puzzle,
          actionHistory: sudokuBoard.actionHistory,
        });
      }
    } else if (
      sudokuHint.hint.strategy === "NAKED_SINGLE" &&
      currentStage === 5
    ) {
      const r = sudokuHint.hint.placements[0][0];
      const c = sudokuHint.hint.placements[0][1];
      const placements = [...sudokuHint.hint.placements[0]]; // deep clone to prevent sudokuHint state update
      placements.splice(0, 2);

      sudokuBoard.actionHistory.push({
        cell: {
          entry: sudokuBoard.puzzle[r][c].entry,
          type: sudokuBoard.puzzle[r][c].type,
        } as CellProps, // annoying typescript casting workaround
        cellLocation: { c: c, r: r },
      });
      sudokuBoard.puzzle[r][c].type = "value";
      sudokuBoard.puzzle[r][c].entry = placements[0];

      saveGame(sudokuBoard);

      setSudokuBoard({
        ...sudokuBoard,
        puzzle: sudokuBoard.puzzle,
        actionHistory: sudokuBoard.actionHistory,
      });
    } else if (currentStage === 5) {
      const r = sudokuHint.hint.removals[0][0];
      const c = sudokuHint.hint.removals[0][1];
      const removals = [...sudokuHint.hint.removals[0]]; // deep clone to prevent sudokuHint state update
      removals.splice(0, 2);

      let newNotes = [...(sudokuBoard.puzzle[r][c].entry as number[])];
      for (let j = 0; j < removals.length; j++) {
        if (newNotes.includes(removals[j])) {
          const index = newNotes.indexOf(removals[j]);
          newNotes.splice(index, 1);
        }
      }

      sudokuBoard.actionHistory.push({
        cell: {
          entry: sudokuBoard.puzzle[r][c].entry,
          type: sudokuBoard.puzzle[r][c].type,
        } as CellProps, // annoying typescript casting workaround
        cellLocation: { c: c, r: r },
      });

      sudokuBoard.puzzle[r][c].type = "note";
      sudokuBoard.puzzle[r][c].entry = newNotes;
    }
    saveGame(sudokuBoard);

    setSudokuBoard({
      ...sudokuBoard,
      puzzle: sudokuBoard.puzzle,
      actionHistory: sudokuBoard.actionHistory,
    });
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
