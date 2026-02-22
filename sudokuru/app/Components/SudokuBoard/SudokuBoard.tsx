import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { isValueCorrect } from "./Core/Functions/BoardFunctions";
import { doesBoardHaveConflict, isGameSolved } from "./SudokuBoardFunctions";
import { ActivityIndicator } from "react-native-paper";
import NumberControl from "./Core/Components/NumberControl";
import ActionRow from "./Core/Components/ActionRow";
import Puzzle from "./Core/Components/Puzzle";
import {
  CellLocation,
  CellProps,
  CellType,
  GameAction,
  GameVariant,
  BoardObjectProps,
} from "../../Functions/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import HeaderRow from "./Core/Components/HeaderRow";
import { useNavigation } from "@react-navigation/native";
import Hint from "./Core/Components/Hint";
import { GameDifficulty } from "./Core/Functions/DifficultyFunctions";
import { saveGame } from "../../Api/Puzzles";
import RenderCell from "./Core/Components/RenderCell";
import { isEraseButtonDisabled } from "./Core/Functions/ActionRowFunctions";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
  areCellUpdatesDisabled,
  getRemainingCellCountOfValue,
  getSelectedCells,
} from "./Core/Functions/CellFunctions";
import { useTheme } from "../../Contexts/ThemeContext";
import {
  boardMethods,
  SudokuVariantMethods,
} from "./SudokuBoardSharedFunctionsController";
import { DrillStrategy } from "../Home/DrillPanel";
import { useKeyboardHotkeys } from "./useKeyboardHotkeys";

export interface DrillBoard extends CoreBoard<"drill"> {
  action: "StartGame" | "ResumeGame";
  strategy: DrillStrategy;
}

export interface ClassicBoard extends CoreBoard<"classic"> {
  action: "StartGame" | "ResumeGame";
  difficulty: GameDifficulty;
}

// Shared properties between all boards
export interface CoreBoard<T extends GameVariant> {
  readonly type: T;
}

export type Board = DrillBoard | ClassicBoard;

export interface HintObjectProps {
  stage: number;
  maxStage: number;
  hint: HintProps;
}

export interface HintProps {
  strategy: any;
  cause: any;
  groups: any;
  placements: any;
  removals: any;
  info: string;
  action: string;
}

const SudokuBoard = (props: Board) => {
  const { theme } = useTheme();
  const [sudokuBoard, setSudokuBoard] = useState<BoardObjectProps>();
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

  const [sudokuHint, setSudokuHint] = useState<HintObjectProps>();

  const {
    strategyHintOrderSetting,
    featurePreviewSetting,
    initializeNotesSetting,
    simplifyNotesSetting,
    progressIndicatorSetting,
  } = React.useContext(PreferencesContext);

  // Call keyboard hotkeys hook early (before early returns) to satisfy React hooks rules
  const {
    undoRef,
    toggleNoteModeRef,
    getHintRef,
    resetRef,
    updateCellEntryRef,
    eraseSelectedRef,
    updateHintStageRef,
    sudokuBoardRef,
    sudokuHintRef,
  } = useKeyboardHotkeys({
    boardType: props.type,
    navigation,
    boardMethods,
    setSudokuBoard,
  });

  useEffect(() => {
    let initializeNotes = false;

    // Enabling initialize notes is under feature preview
    if (initializeNotesSetting && featurePreviewSetting) {
      initializeNotes = true;
    }

    async function loadGame() {
      const game = await boardMethods[props.type].generateGame(
        props,
        initializeNotes,
      );
      if (game == null) {
        return;
      }
      saveGame(game);
      setSudokuBoard(game);
    }

    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if we are loading then we return the loading icon
  if (sudokuBoard == null) {
    return <ActivityIndicator animating={true} color={theme.colors.error} />;
  }

  // Render EndGame screen when game has ended
  if (gameOver) {
    return boardMethods[props.type].getEndGameModal({
      statistics: sudokuBoard.statistics,
    });
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
      sudokuBoard.puzzleState[move.cellLocation.r][move.cellLocation.c].type =
        move.cell.type;
      sudokuBoard.puzzleState[move.cellLocation.r][move.cellLocation.c].entry =
        move.cell.entry;
    }
    // remove from move history
    setSudokuBoard({
      ...sudokuBoard,
      actionHistory: sudokuBoard.actionHistory,
    });
  };

  const reset = () => {
    if (boardMethods[props.type].hasResetActionButton() === true) {
      setSudokuBoard({
        ...sudokuBoard,
        actionHistory: [],
        puzzleState:
          boardMethods[props.type].getInitialPuzzleState(sudokuBoard),
      });
    }
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
    const { hint, updatedBoard } = boardMethods[props.type].getSudokuBoardHint(
      sudokuBoard,
      [...strategyHintOrderSetting],
    );

    setSudokuBoard({
      ...updatedBoard,
      selectedCells: [],
    });

    setSudokuHint({
      stage: 1,
      hint: hint,
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

    const currentSelectedCells = getSelectedCells(sudokuBoard);

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

      // Set new Cell Value
      setCellEntryValue(inputValue, currentType, currentEntry, r, c);

      // Incrementing numWrongCellsPlayed value
      const isMoveCorrect = boardMethods[props.type].isMoveCorrect(
        sudokuBoard,
        r,
        c,
        { entry: currentEntry, type: currentType } as CellProps,
      );
      if (!isMoveCorrect) {
        sudokuBoard.statistics.numWrongCellsPlayed++;
      }

      newActionHistory.push({
        cell: { entry: currentEntry, type: currentType } as CellProps, // annoying typescript casting workaround
        cellLocation: { c: c, r: r },
      });

      // Simplify Notes if setting is enabled and value is correct
      // This isn't the most performant way to do this but it is easy to read
      // We are looping through a bunch of cells we don't need to loop through
      // todo turn this into function
      if (
        simplifyNotesSetting &&
        featurePreviewSetting &&
        !sudokuBoard.inNoteMode &&
        isValueCorrect(sudokuBoard.puzzleSolution[r][c], inputValue)
      ) {
        for (const [rowIndex, row] of sudokuBoard.puzzleState.entries()) {
          for (const [columnIndex, cell] of row.entries()) {
            if (
              areCellsInSameRow(
                { r: rowIndex, c: columnIndex },
                { r: r, c: c },
              ) ||
              areCellsInSameColumn(
                { r: rowIndex, c: columnIndex },
                { r: r, c: c },
              ) ||
              areCellsInSameBox({ r: rowIndex, c: columnIndex }, { r: r, c: c })
            ) {
              if (cell.type === "note" && cell.entry.includes(inputValue)) {
                const updatedNotesArray = cell.entry.filter(
                  (entry: number) => entry !== inputValue,
                );
                const existingNotesArray =
                  sudokuBoard.puzzleState[rowIndex][columnIndex].entry;
                sudokuBoard.puzzleState[rowIndex][columnIndex].entry =
                  updatedNotesArray;
                newActionHistory.push({
                  cell: {
                    entry: existingNotesArray,
                    type: "note",
                  } as CellProps, // annoying typescript casting workaround
                  cellLocation: { c: columnIndex, r: rowIndex },
                });
              }
            }
          }
        }
      }
    }

    // selected values are all correct values or givens
    if (!cellsHaveUpdates) {
      return;
    }

    // Storing old value in actionHistory
    sudokuBoard.actionHistory.push(newActionHistory);

    // Saving current game status
    saveGame(sudokuBoard);

    if (isGameSolved(sudokuBoard)) {
      setSudokuBoard({
        ...sudokuBoard,
        puzzleState: sudokuBoard.puzzleState,
        actionHistory: sudokuBoard.actionHistory,
        // @ts-ignore
        statistics: boardMethods[props.type].finishSudokuGame(
          sudokuBoard.statistics,
          props.type,
        ),
      });
      setGameOver(true);
    } else {
      setSudokuBoard({
        ...sudokuBoard,
        puzzleState: sudokuBoard.puzzleState,
        actionHistory: sudokuBoard.actionHistory,
        // @ts-ignore
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
    c: number,
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
      sudokuBoard.puzzleState[r][c].type = "value";
    }
    // update type and newCellEntry of selected cell
    else if (sudokuBoard.inNoteMode && currentType === "value") {
      sudokuBoard.puzzleState[r][c].type = "note";
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
      sudokuBoard.puzzleState[r][c].type = "value";
      newCellEntry = 0;
    }
    // set new note value
    else if (sudokuBoard.inNoteMode) {
      const currentEntryCopy = JSON.parse(JSON.stringify(currentEntry));
      if (currentEntryCopy.includes(inputValue)) {
        newCellEntry = currentEntryCopy.filter(
          (note: number) => note !== inputValue,
        );
      } else {
        currentEntryCopy.push(inputValue);
        currentEntryCopy.sort((a: number, b: number) => a - b);
        newCellEntry = currentEntryCopy;
      }
    }

    // updating board entry
    sudokuBoard.puzzleState[r][c].entry = newCellEntry;
  };

  const setBoardSelectedCells = (cells: CellLocation[]) => {
    setSudokuBoard({
      ...sudokuBoard,
      selectedCells: cells,
    });
  };

  const renderTopBar = () => {
    return (
      <HeaderRow
        sudokuBoard={sudokuBoard}
        setSudokuBoard={setSudokuBoard}
        headerRowTitle={boardMethods[props.type].headerRowTitle}
        handlePause={boardMethods[props.type].handlePause}
      />
    );
  };

  const renderPuzzle = () => {
    return (
      <Puzzle
        RenderCell={RenderCell}
        sudokuBoard={sudokuBoard}
        sudokuHint={sudokuHint}
        setBoardSelectedCells={setBoardSelectedCells}
        boardMethods={boardMethods[props.type]}
      />
    );
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
      currentSelectedCells = getSelectedCells(sudokuBoard);
    }

    if (currentSelectedCells.length !== 0) {
      for (let i = 0; i < currentSelectedCells.length; i++) {
        // if there is at least one cell that can be updated, we enable number buttons
        if (
          !areCellUpdatesDisabled(
            currentSelectedCells[i],
            sudokuBoard.puzzleSolution[sudokuBoard.selectedCells[i].r][
              sudokuBoard.selectedCells[i].c
            ],
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
        sudokuBoard={sudokuBoard}
        getRemainingCellCountOfValue={getRemainingCellCountOfValue}
        progressIndicatorSetting={progressIndicatorSetting}
      />
    );
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
    const boardHasConflict = doesBoardHaveConflict(
      sudokuBoard,
      boardMethods[props.type].doesCellHaveConflict,
    );
    const eraseButtonDisabled = isEraseButtonDisabled(sudokuBoard);
    const isUndoButtonDisabled = sudokuBoard.actionHistory.length === 0;
    const isResetButtonDisabled = sudokuBoard.actionHistory.length === 0;

    return (
      <ActionRow
        isEraseButtonDisabled={eraseButtonDisabled}
        isUndoButtonDisabled={isUndoButtonDisabled}
        isResetButtonDisabled={isResetButtonDisabled}
        inNoteMode={inNoteMode}
        undo={undo}
        toggleNoteMode={toggleNoteMode}
        eraseSelected={eraseSelected}
        reset={reset}
        getHint={getHint}
        boardHasConflict={boardHasConflict}
        hasResetButton={boardMethods[props.type].hasResetActionButton()}
        hasEraseButton={boardMethods[props.type].hasEraseActionButton()}
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
        finishSudokuGame={boardMethods[props.type].finishSudokuGame}
      />
    );
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
    locations: CellLocation[],
  ) => {
    const actionHistory: GameAction[] = [];
    for (const [i, location] of locations.entries()) {
      actionHistory.push({
        cell: {
          entry: sudokuBoard.puzzleState[location.r][location.c].entry,
          type: sudokuBoard.puzzleState[location.r][location.c].type,
        } as CellProps,
        cellLocation: { c: location.c, r: location.r },
      });
      sudokuBoard.puzzleState[location.r][location.c].type = cells[i].type;
      sudokuBoard.puzzleState[location.r][location.c].entry = cells[i].entry;
    }
    sudokuBoard.actionHistory.push(actionHistory);
    saveGame(sudokuBoard);
    setSudokuBoard({
      ...sudokuBoard,
      puzzleState: sudokuBoard.puzzleState,
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
  const updateHintStage = (
    stageOffset: number,
    finishSudokuGame: SudokuVariantMethods["finishSudokuGame"],
  ) => {
    if (stageOffset !== -1 && stageOffset !== 1) {
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
        if (isGameSolved(sudokuBoard)) {
          setSudokuBoard({
            ...sudokuBoard,
            puzzleState: sudokuBoard.puzzleState,
            actionHistory: sudokuBoard.actionHistory,
            //@ts-ignore
            statistics: finishSudokuGame(sudokuBoard.statistics, props.type),
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
      JSON.stringify(sudokuHint.hint.removals),
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
      if (sudokuBoard.puzzleState[r][c].type === "note") {
        newNotes = [...(sudokuBoard.puzzleState[r][c].entry as number[])];
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
      else if (
        currentStage === 5 &&
        sudokuBoard.puzzleState[r][c].type === "note"
      ) {
        newNotes = sudokuBoard.puzzleState[r][c].entry as number[];
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
          [{ c: c, r: r }],
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

      const cellsToReplace: CellProps[] = [
        { type: "value", entry: placements[0] },
      ];
      const cellLocationsToReplace: CellLocation[] = [{ c: c, r: r }];

      // Remove unnecessary notes due to OBVIOUS_SINGLE hint
      // This isn't the most performant way to do this but it is easy to read
      // We are looping through a bunch of cells we don't need to loop through
      if (simplifyNotesSetting && featurePreviewSetting) {
        for (const [rowIndex, row] of sudokuBoard.puzzleState.entries()) {
          for (const [columnIndex, cell] of row.entries()) {
            if (!(r === rowIndex && c === columnIndex)) {
              if (
                areCellsInSameRow(
                  { r: rowIndex, c: columnIndex },
                  { r: r, c: c },
                ) ||
                areCellsInSameColumn(
                  { r: rowIndex, c: columnIndex },
                  { r: r, c: c },
                ) ||
                areCellsInSameBox(
                  { r: rowIndex, c: columnIndex },
                  { r: r, c: c },
                )
              ) {
                if (
                  cell.type === "note" &&
                  cell.entry.includes(placements[0])
                ) {
                  const updatedNotesArray = cell.entry.filter(
                    (entry: number) => entry !== placements[0],
                  );
                  cellsToReplace.push({
                    type: "note",
                    entry: updatedNotesArray,
                  });
                  cellLocationsToReplace.push({ c: columnIndex, r: rowIndex });
                }
              }
            }
          }
        }
      }

      replaceSudokuBoardCells(cellsToReplace, cellLocationsToReplace);
    } else if (currentStage === 5) {
      const cells: CellProps[] = [];
      const locations: CellLocation[] = [];
      for (const removal of removals) {
        const r = removal[0];
        const c = removal[1];
        removal.splice(0, 2);

        let newNotes = [...(sudokuBoard.puzzleState[r][c].entry as number[])];
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

  // Sync keyboard handler refs on every render to access fresh state and functions
  undoRef.current = undo;
  toggleNoteModeRef.current = toggleNoteMode;
  getHintRef.current = getHint;
  resetRef.current = reset;
  updateCellEntryRef.current = updateCellEntry;
  eraseSelectedRef.current = eraseSelected;
  updateHintStageRef.current = updateHintStage;
  sudokuBoardRef.current = sudokuBoard;
  sudokuHintRef.current = sudokuHint;

  return (
    <View
      testID={"sudokuBoard"}
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
