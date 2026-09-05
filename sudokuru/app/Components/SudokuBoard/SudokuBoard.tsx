import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { isValueCorrect } from "./Core/Functions/BoardFunctions";
import { doesBoardHaveConflict, isGameSolved } from "./SudokuBoardFunctions";
import { ActivityIndicator } from "react-native-paper";
import NumberControl from "./Core/Components/NumberControl";
import ActionRow from "./Core/Components/ActionRow";
import Puzzle from "./Core/Components/Puzzle";
import {
  ActiveHintState,
  CellLocation,
  CellProps,
  GameAction,
  GameVariant,
  BoardObjectProps,
} from "../../Functions/LocalDatabase";
import { PreferencesContext } from "../../Contexts/PreferencesContext";
import HeaderRow from "./Core/Components/HeaderRow";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import { useKeyboardHotkeys } from "./Core/Functions/useKeyboardHotkeys";

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

const cloneCell = (cell: CellProps): CellProps =>
  cell.type === "note" ? { type: "note", entry: [...cell.entry] } : { ...cell };

const clonePuzzleState = (puzzleState: CellProps[][]): CellProps[][] =>
  puzzleState.map((row) => row.map(cloneCell));

const cloneBoard = <T extends BoardObjectProps>(board: T): T => ({
  ...board,
  puzzleState: clonePuzzleState(board.puzzleState),
  actionHistory: [...board.actionHistory],
  statistics: { ...board.statistics },
});

const SudokuBoard = (props: Board) => {
  const { theme } = useTheme();
  const [sudokuBoard, setSudokuBoard] = useState<BoardObjectProps>();
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

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
    gameOverRef,
    setBoardSelectedCellsRef,
  } = useKeyboardHotkeys({
    boardType: props.type,
    navigation,
    boardMethods,
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

  useEffect(() => {
    gameOverRef.current = gameOver;

    if (sudokuBoard == null || gameOver) {
      return;
    }

    undoRef.current = undo;
    toggleNoteModeRef.current = toggleNoteMode;
    getHintRef.current = getHint;
    resetRef.current = reset;
    updateCellEntryRef.current = updateCellEntry;
    eraseSelectedRef.current = eraseSelected;
    updateHintStageRef.current = updateHintStage;
    sudokuBoardRef.current = sudokuBoard;
    setBoardSelectedCellsRef.current = setBoardSelectedCells;
  });

  // Run the game timer while the screen is focused and a game is in progress
  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        if (sudokuBoardRef.current == null || gameOverRef.current) {
          return;
        }
        setSudokuBoard((prevState) => {
          if (prevState == null) {
            return prevState;
          }
          return {
            ...prevState,
            statistics: {
              ...prevState.statistics,
              time: prevState.statistics.time + 1,
            },
          } as BoardObjectProps;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [setSudokuBoard, gameOverRef, sudokuBoardRef]),
  );

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
  function undo() {
    setSudokuBoard((currentBoard) => {
      if (currentBoard == null) {
        return currentBoard;
      }

      const moves =
        currentBoard.actionHistory[currentBoard.actionHistory.length - 1];
      if (!moves || moves.length === 0) {
        return currentBoard;
      }

      const puzzleState = clonePuzzleState(currentBoard.puzzleState);
      for (const move of moves) {
        puzzleState[move.cellLocation.r][move.cellLocation.c] = cloneCell(
          move.cell,
        );
      }

      return {
        ...currentBoard,
        puzzleState,
        actionHistory: currentBoard.actionHistory.slice(0, -1),
      };
    });
  }

  function reset() {
    if (sudokuBoard == null) {
      return;
    }

    if (boardMethods[props.type].hasResetActionButton() === true) {
      setSudokuBoard({
        ...sudokuBoard,
        actionHistory: [],
        puzzleState:
          boardMethods[props.type].getInitialPuzzleState(sudokuBoard),
      });
    }
  }

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
  function getHint() {
    if (sudokuBoard == null) {
      return;
    }

    const puzzleStateBeforeHint = clonePuzzleState(sudokuBoard.puzzleState);
    const boardForHint: BoardObjectProps = JSON.parse(
      JSON.stringify(sudokuBoard),
    );
    const { hint, updatedBoard } = boardMethods[props.type].getSudokuBoardHint(
      boardForHint,
      [...strategyHintOrderSetting],
    );
    const activeHint: ActiveHintState = {
      stage: 1,
      maxStage: 5,
      hint: {
        ...hint,
        simplifyNotesAfterPlacement:
          simplifyNotesSetting && featurePreviewSetting,
      },
      puzzleStateBeforeHint,
    };
    const nextBoard = {
      ...updatedBoard,
      selectedCells: [],
      activeHint,
    };

    saveGame(nextBoard);
    setSudokuBoard(nextBoard);
  }

  /**
   * Toggles whether or not the board is in note mode. In note mode, the user can
   * enter notes into the cells of the board. If the board is not in note mode, the
   * user can enter values into the cells of the board.
   */
  function toggleNoteMode() {
    setSudokuBoard((currentBoard) => {
      if (currentBoard == null) {
        return currentBoard;
      }

      return {
        ...currentBoard,
        inNoteMode: !currentBoard.inNoteMode,
      };
    });
  }

  /**
   * Called when the user hits the 'erase' button
   * If notes are present in selected cell, removes all notes
   * If value is present in selected cell, removes value if value is incorrect
   */
  function eraseSelected() {
    updateCellEntry(0);
  }

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
  function updateCellEntry(inputValue: number) {
    if (sudokuBoard == null) {
      return;
    }

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

    const nextBoard = cloneBoard(sudokuBoard);
    const newActionHistory: GameAction[] = [];
    let cellsHaveUpdates = false;

    const currentSelectedCells = getSelectedCells(nextBoard);

    // We do not need to take action if this is a given value
    for (let i = 0; i < currentSelectedCells.length; i++) {
      if (currentSelectedCells[i].type === "given") {
        continue;
      }

      const r: number = nextBoard.selectedCells[i].r;
      const c: number = nextBoard.selectedCells[i].c;
      const currentEntry = currentSelectedCells[i].entry;
      const currentType = currentSelectedCells[i].type;

      // We do not need to take action if value is correct
      if (
        currentType === "value" &&
        isValueCorrect(nextBoard.puzzleSolution[r][c], currentEntry as number)
      ) {
        continue;
      }

      cellsHaveUpdates = true;

      // Set new Cell Value
      const previousCell = cloneCell(currentSelectedCells[i]);
      nextBoard.puzzleState[r][c] = getUpdatedCell(
        inputValue,
        currentSelectedCells[i],
        nextBoard.inNoteMode,
      );

      // Incrementing numWrongCellsPlayed value
      const isMoveCorrect = boardMethods[props.type].isMoveCorrect(
        nextBoard,
        r,
        c,
        previousCell,
      );
      if (!isMoveCorrect) {
        nextBoard.statistics.numWrongCellsPlayed += 1;
      }

      newActionHistory.push({
        cell: previousCell,
        cellLocation: { c: c, r: r },
      });

      // Simplify Notes if setting is enabled and value is correct
      // This isn't the most performant way to do this but it is easy to read
      // We are looping through a bunch of cells we don't need to loop through
      // todo turn this into function
      if (
        simplifyNotesSetting &&
        featurePreviewSetting &&
        !nextBoard.inNoteMode &&
        isValueCorrect(nextBoard.puzzleSolution[r][c], inputValue)
      ) {
        for (const [rowIndex, row] of nextBoard.puzzleState.entries()) {
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
                const existingNotesArray = [...cell.entry];
                nextBoard.puzzleState[rowIndex][columnIndex] = {
                  type: "note",
                  entry: cell.entry.filter(
                    (entry: number) => entry !== inputValue,
                  ),
                };
                newActionHistory.push({
                  cell: {
                    entry: existingNotesArray,
                    type: "note",
                  },
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
    nextBoard.actionHistory.push(newActionHistory);

    if (isGameSolved(nextBoard)) {
      nextBoard.statistics = boardMethods[props.type].finishSudokuGame(
        nextBoard.statistics,
        props.type,
      );
      setSudokuBoard(nextBoard);
      gameOverRef.current = true;
      setGameOver(true);
    } else {
      saveGame(nextBoard);
      setSudokuBoard(nextBoard);
    }
  }

  /**
   * Sub function of @function updateCellEntry
   * Updates the selected cell updated based on the user input value and what is currently in the cell
   * @param inputValue User input 0-9
   * @param currentCell The current cell value and type
   * @param inNoteMode Whether note mode is enabled
   */
  function getUpdatedCell(
    inputValue: number,
    currentCell: CellProps,
    inNoteMode: boolean,
  ): CellProps {
    if (inputValue === 0) {
      return { type: "value", entry: 0 };
    }

    if (!inNoteMode) {
      return { type: "value", entry: inputValue };
    }

    if (currentCell.type === "value") {
      return { type: "note", entry: [inputValue] };
    }

    // handling case where there is one note remaining
    // and that is removed via note press
    if (
      currentCell.type === "note" &&
      currentCell.entry.length === 1 &&
      currentCell.entry[0] === inputValue
    ) {
      return { type: "value", entry: 0 };
    }

    if (currentCell.type === "note") {
      const updatedNotes = [...currentCell.entry];
      if (updatedNotes.includes(inputValue)) {
        return {
          type: "note",
          entry: updatedNotes.filter((note: number) => note !== inputValue),
        };
      }

      updatedNotes.push(inputValue);
      updatedNotes.sort((a: number, b: number) => a - b);
      return { type: "note", entry: updatedNotes };
    }

    return cloneCell(currentCell);
  }

  function setBoardSelectedCells(cells: CellLocation[]) {
    if (sudokuBoard == null) {
      return;
    }

    setSudokuBoard({
      ...sudokuBoard,
      selectedCells: cells,
    });
  }

  const renderTopBar = () => {
    return (
      <HeaderRow
        sudokuBoard={sudokuBoard}
        headerRowTitle={boardMethods[props.type].headerRowTitle}
        headerRowHintCount={boardMethods[props.type].headerRowHintCount}
      />
    );
  };

  const renderPuzzle = () => {
    return (
      <Puzzle
        RenderCell={RenderCell}
        sudokuBoard={sudokuBoard}
        sudokuHint={sudokuBoard.activeHint}
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
    if (sudokuBoard.activeHint) {
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
    if (sudokuBoard.activeHint) {
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
        handlePause={() =>
          boardMethods[props.type].handlePause(sudokuBoard, navigation)
        }
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
    if (!sudokuBoard.activeHint) {
      return;
    }

    const activeHint = sudokuBoard.activeHint;

    return (
      <Hint
        hint={activeHint.hint}
        stage={activeHint.stage}
        maxStage={activeHint.maxStage}
        incrementStage={updateHintStage}
        finishSudokuGame={boardMethods[props.type].finishSudokuGame}
      />
    );
  };

  const buildHintPreview = (
    activeHint: ActiveHintState,
    stage: ActiveHintState["stage"],
  ): CellProps[][] => {
    const previewBase = boardMethods[props.type].getHintPreviewBase(
      sudokuBoard,
      activeHint,
    );
    const puzzleState = clonePuzzleState(previewBase);
    const { hint } = activeHint;

    if (hint.strategy === "AMEND_NOTES" && stage >= 4) {
      const [row, column, ...notesToRemove] = hint.removals[0];
      const currentCell = puzzleState[row][column];
      const currentNotes =
        currentCell.type === "note" ? [...currentCell.entry] : [];
      const validNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        (note) => !notesToRemove.includes(note),
      );
      const previewNotes = [...new Set([...currentNotes, ...validNotes])].sort(
        (a, b) => a - b,
      );

      puzzleState[row][column] = {
        type: "note",
        entry:
          stage === 4
            ? previewNotes
            : previewNotes.filter((note) => !notesToRemove.includes(note)),
      };
      return puzzleState;
    }

    if (stage !== 5) {
      return puzzleState;
    }

    if (hint.strategy === "OBVIOUS_SINGLE") {
      const [row, column, value] = hint.placements[0];
      puzzleState[row][column] = { type: "value", entry: value };

      if (hint.simplifyNotesAfterPlacement) {
        for (const [rowIndex, rowCells] of puzzleState.entries()) {
          for (const [columnIndex, cell] of rowCells.entries()) {
            if (
              cell.type === "note" &&
              cell.entry.includes(value) &&
              (areCellsInSameRow(
                { r: rowIndex, c: columnIndex },
                { r: row, c: column },
              ) ||
                areCellsInSameColumn(
                  { r: rowIndex, c: columnIndex },
                  { r: row, c: column },
                ) ||
                areCellsInSameBox(
                  { r: rowIndex, c: columnIndex },
                  { r: row, c: column },
                ))
            ) {
              puzzleState[rowIndex][columnIndex] = {
                type: "note",
                entry: cell.entry.filter((note) => note !== value),
              };
            }
          }
        }
      }
      return puzzleState;
    }

    for (const [row, column, ...notesToRemove] of hint.removals) {
      const cell = puzzleState[row][column];
      if (cell.type === "note") {
        puzzleState[row][column] = {
          type: "note",
          entry: cell.entry.filter((note) => !notesToRemove.includes(note)),
        };
      }
    }
    return puzzleState;
  };

  const getHintAction = (
    puzzleStateBeforeHint: CellProps[][],
    finalPuzzleState: CellProps[][],
  ): GameAction[] => {
    const action: GameAction[] = [];
    for (let row = 0; row < puzzleStateBeforeHint.length; row++) {
      for (
        let column = 0;
        column < puzzleStateBeforeHint[row].length;
        column++
      ) {
        const previousCell = puzzleStateBeforeHint[row][column];
        const finalCell = finalPuzzleState[row][column];
        if (JSON.stringify(previousCell) !== JSON.stringify(finalCell)) {
          action.push({
            cellLocation: { r: row, c: column },
            cell: JSON.parse(JSON.stringify(previousCell)),
          });
        }
      }
    }
    return action;
  };

  function updateHintStage(
    stageOffset: -1 | 0 | 1,
    finishSudokuGame: SudokuVariantMethods["finishSudokuGame"],
  ) {
    if (sudokuBoard == null) {
      return;
    }

    const activeHint = sudokuBoard.activeHint!;

    if (stageOffset === 0 || activeHint.stage + stageOffset === 0) {
      const nextBoard = {
        ...sudokuBoard,
        puzzleState: clonePuzzleState(activeHint.puzzleStateBeforeHint),
        activeHint: null,
      };
      saveGame(nextBoard);
      setSudokuBoard(nextBoard);
      return;
    }

    const nextStage = activeHint.stage + stageOffset;
    if (nextStage === activeHint.maxStage + 1) {
      const finalPuzzleState = buildHintPreview(activeHint, 5);
      const hintAction = getHintAction(
        activeHint.puzzleStateBeforeHint,
        finalPuzzleState,
      );
      const nextBoard = cloneBoard(sudokuBoard);
      nextBoard.puzzleState = finalPuzzleState;
      nextBoard.actionHistory =
        hintAction.length === 0
          ? sudokuBoard.actionHistory
          : [...sudokuBoard.actionHistory, hintAction];
      nextBoard.activeHint = null;

      if (isGameSolved(nextBoard)) {
        nextBoard.statistics = finishSudokuGame(
          nextBoard.statistics,
          props.type,
        );
        setSudokuBoard(nextBoard);
        gameOverRef.current = true;
        setGameOver(true);
      } else {
        saveGame(nextBoard);
        setSudokuBoard(nextBoard);
      }
      return;
    }
    const targetStage = nextStage as ActiveHintState["stage"];
    const nextActiveHint: ActiveHintState = {
      ...activeHint,
      stage: targetStage,
    };
    const nextBoard = {
      ...sudokuBoard,
      puzzleState: buildHintPreview(activeHint, targetStage),
      activeHint: nextActiveHint,
    };
    saveGame(nextBoard);
    setSudokuBoard(nextBoard);
  }

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
