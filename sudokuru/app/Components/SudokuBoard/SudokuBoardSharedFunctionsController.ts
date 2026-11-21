import {
  DrillObjectProps,
  BoardObjectProps,
  ClassicGameStatistics,
  DrillGameStatistics,
  GameVariant,
  CellProps,
  ClassicObjectProps,
  PersistedHintPayload,
  ActiveHintState,
  CellLocation,
} from "./../../Functions/LocalDatabase";

import {
  doesCellHaveConflict as coreDoesCellHaveConflict,
  isMoveCorrect as coreIsMoveCorrect,
  areCellUpdatesDisabled,
} from "./Core/Functions/CellFunctions";
import {
  doesCellHaveConflict as drillDoesCellHaveConflict,
  isMoveCorrect as drillIsMoveCorrect,
} from "./Drill/Functions/CellFunctions";

import {
  headerRowHintCount as coreHeaderRowHintCount,
  headerRowTitle as coreHeaderRowTitle,
} from "./Core/Functions/HeaderRowFunctions";
import {
  headerRowHintCount as drillHeaderRowHintCount,
  headerRowTitle as drillHeaderRowTitle,
} from "./Drill/Functions/HeaderRowFunctions";
import {
  finishSudokuGame as coreFinishGameStatistics,
  handlePause as coreHandlePause,
} from "./Core/Functions/BoardFunctions";
import {
  finishSudokuGame as drillFinishGameStatistics,
  handlePause as drillHandlePause,
  getInitialPuzzleState as drillGetInitialPuzzleState,
} from "./Drill/Functions/BoardFunctions";
import { generateGame as coreGenerateGame } from "./Core/Functions/GenerateGameFunctions";
import { generateGame as drillGenerateGame } from "./Drill/Functions/GenerateGameFunctions";

import { EndGameModal as CoreEndGameModal } from "./Core/Components/EndGameModal";
import { EndGameModal as DrillEndGameModal } from "./Drill/Components/EndGameModal";

import {
  getSudokuBoardHint as coreGetSudokuBoardHint,
  getSudokuHint,
} from "./Core/Functions/HintFunctions";
import { getSudokuBoardHint as drillGetSudokuBoardHint } from "./Drill/Functions/HintFunctions";

import type { Board, ClassicBoard, DrillBoard } from "./SudokuBoard";
import React, { JSX } from "react";
import { SudokuStrategy } from "sudokuru";
import {
  getActiveFocusClassicGame,
  getActiveFocusDrillGame,
} from "../../Api/Puzzles";
import {
  createClassicFocusStep,
  getFocusActionHint,
  createFocusStep,
  focusCellHasConflict,
  getFocusStep,
  updateClassicFocus,
} from "./Focus/FocusFunctions";
import { isEraseButtonDisabled } from "./Core/Functions/ActionRowFunctions";
import { cloneCell } from "./Core/Functions/CloneFunctions";
import { wrapDigit } from "./SudokuBoardFunctions";
import { isCellAHintFocus } from "./Core/Functions/RenderCellFunctions";
import {
  navigateFocusCells,
  keepFocusSelectionExposed,
} from "./Focus/FocusNavigationFunctions";

export interface SudokuVariantMethods {
  initialHintStage: ActiveHintState["stage"];
  extraLayoutHeight: number;
  initializeNotes(preference: boolean): boolean;
  simplifyNotes(preference: boolean): boolean;
  prepareBoard(
    board: BoardObjectProps,
    strategies: SudokuStrategy[],
  ): BoardObjectProps;
  getGuidance(board: BoardObjectProps): PersistedHintPayload | undefined;
  getDisplayHint(board: BoardObjectProps): ActiveHintState | null;
  usesSelectionHighlights(): boolean;
  isCellExposed(board: BoardObjectProps, r: number, c: number): boolean;
  getNavigatedCells(
    board: BoardObjectProps,
    direction: CellLocation,
  ): CellLocation[];
  areCellUpdatesDisabled(
    board: BoardObjectProps,
    r: number,
    c: number,
  ): boolean;
  isEraseButtonDisabled(board: BoardObjectProps): boolean;
  getClearedCell(board: BoardObjectProps, r: number, c: number): CellProps;
  doesCellHaveConflict(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
  ): boolean;
  isMoveCorrect(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
    currentEntry: CellProps,
  ): boolean;
  headerRowTitle(sudokuBoard: BoardObjectProps): string;
  headerRowHintCount(sudokuBoard: BoardObjectProps): string;
  finishSudokuGame(
    statistics: ClassicGameStatistics | DrillGameStatistics,
    variant: GameVariant,
  ): ClassicGameStatistics | DrillGameStatistics;
  generateGame(
    board: Board,
    initializeNotes: boolean,
    strategies: SudokuStrategy[],
  ): Promise<BoardObjectProps | null>;
  handlePause(sudokuBoard: BoardObjectProps, navigation: any): void;
  getEndGameModal({
    statistics,
  }: {
    statistics: ClassicGameStatistics | DrillGameStatistics;
  }): JSX.Element;
  hasResetActionButton(): boolean;
  hasEraseActionButton(): boolean;
  getInitialPuzzleState(sudokuBoard: BoardObjectProps): CellProps[][];
  getHintPreviewBase(
    sudokuBoard: BoardObjectProps,
    activeHint: ActiveHintState,
  ): CellProps[][];
  getSudokuBoardHint: (
    sudokuBoard: BoardObjectProps,
    strategyArray: SudokuStrategy[],
  ) => {
    hint: PersistedHintPayload;
    updatedBoard: BoardObjectProps;
  };
}

// Default methods for all variants
const defaultMethods: SudokuVariantMethods = {
  initialHintStage: 1,
  extraLayoutHeight: 0,
  initializeNotes: (preference) => preference,
  simplifyNotes: (preference) => preference,
  prepareBoard: (board) => board,
  getGuidance: () => undefined,
  getDisplayHint: (board) => board.activeHint,
  usesSelectionHighlights(): boolean {
    return true;
  },
  isCellExposed: () => true,
  getNavigatedCells: (board, direction) =>
    board.selectedCells.map((cell) => ({
      r: wrapDigit(cell.r + direction.r),
      c: wrapDigit(cell.c + direction.c),
    })),
  isEraseButtonDisabled,
  getClearedCell: () => ({ type: "value", entry: 0 }),
  areCellUpdatesDisabled(board, r, c) {
    return areCellUpdatesDisabled(
      board.puzzleState[r][c],
      board.puzzleSolution[r][c],
    );
  },
  doesCellHaveConflict(sudokuBoard: BoardObjectProps, r: number, c: number) {
    return coreDoesCellHaveConflict(sudokuBoard, r, c);
  },
  isMoveCorrect(
    sudokuBoard: BoardObjectProps,
    r: number,
    c: number,
    currentEntry: CellProps,
  ) {
    return coreIsMoveCorrect(sudokuBoard, r, c, currentEntry);
  },
  headerRowTitle(sudokuBoard: BoardObjectProps) {
    return coreHeaderRowTitle(sudokuBoard);
  },
  headerRowHintCount(sudokuBoard: BoardObjectProps) {
    return coreHeaderRowHintCount(sudokuBoard as ClassicObjectProps);
  },
  finishSudokuGame(
    statistics: ClassicGameStatistics,
    variant: GameVariant,
  ): ClassicGameStatistics {
    return coreFinishGameStatistics(statistics, variant);
  },
  generateGame(
    board: ClassicBoard,
    initializeNotes: boolean,
  ): Promise<BoardObjectProps | null> {
    return coreGenerateGame(board, initializeNotes);
  },
  handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
    return coreHandlePause(sudokuBoard, navigation);
  },
  getEndGameModal({ statistics }: { statistics: ClassicGameStatistics }) {
    return React.createElement(CoreEndGameModal, { statistics });
  },
  hasResetActionButton(): boolean {
    return false;
  },
  // todo implement for classic - right now just returns empty array
  getInitialPuzzleState(sudokuBoard: ClassicObjectProps) {
    return Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({}) as CellProps),
    );
  },
  getHintPreviewBase(
    sudokuBoard: ClassicObjectProps,
    activeHint: ActiveHintState,
  ) {
    return activeHint.puzzleStateBeforeHint;
  },
  hasEraseActionButton(): boolean {
    return true;
  },
  getSudokuBoardHint(
    sudokuBoard: BoardObjectProps,
    strategyArray: SudokuStrategy[],
  ) {
    return coreGetSudokuBoardHint(
      sudokuBoard as ClassicObjectProps,
      strategyArray,
    );
  },
};

// Any per-variant overrides (only override what you really need)
const overrides: Record<GameVariant, Partial<SudokuVariantMethods>> = {
  drill: {
    doesCellHaveConflict(sudokuBoard: DrillObjectProps, r: number, c: number) {
      return drillDoesCellHaveConflict(sudokuBoard, r, c);
    },
    isMoveCorrect(
      sudokuBoard: DrillObjectProps,
      r: number,
      c: number,
      currentEntry: CellProps,
    ) {
      return drillIsMoveCorrect(sudokuBoard, r, c, currentEntry);
    },
    headerRowTitle(sudokuBoard: DrillObjectProps) {
      return drillHeaderRowTitle(sudokuBoard);
    },
    headerRowHintCount(sudokuBoard: DrillObjectProps) {
      return drillHeaderRowHintCount(sudokuBoard);
    },
    finishSudokuGame(
      statistics: DrillGameStatistics,
      variant: GameVariant,
    ): DrillGameStatistics {
      return drillFinishGameStatistics(statistics, variant);
    },
    generateGame(
      board: DrillBoard,
      initializeNotes: boolean,
    ): Promise<BoardObjectProps | null> {
      return drillGenerateGame(board, initializeNotes);
    },
    handlePause(sudokuBoard: BoardObjectProps, navigation: any) {
      return drillHandlePause(sudokuBoard, navigation);
    },
    getEndGameModal({ statistics }: { statistics: DrillGameStatistics }) {
      return React.createElement(DrillEndGameModal, { statistics });
    },
    hasResetActionButton(): boolean {
      return true;
    },
    getInitialPuzzleState(sudokuBoard: DrillObjectProps) {
      return drillGetInitialPuzzleState(sudokuBoard);
    },
    getHintPreviewBase(sudokuBoard: DrillObjectProps) {
      return drillGetInitialPuzzleState(sudokuBoard);
    },
    hasEraseActionButton(): boolean {
      return false;
    },
    getSudokuBoardHint(
      sudokuBoard: BoardObjectProps,
      strategyArray: SudokuStrategy[],
    ) {
      return drillGetSudokuBoardHint(
        sudokuBoard as DrillObjectProps,
        strategyArray,
      );
    },
  },
  // classic has no overrides since classic is the default
  classic: {},
  "focus-classic": {},
  "focus-drill": {},
};

const isFocusCellExposed = (
  board: BoardObjectProps,
  r: number,
  c: number,
): boolean => {
  const hint = getFocusStep(board)?.hint;
  if (!hint) return true;
  return (
    isCellAHintFocus(board.activeHint ?? { stage: 3, hint }, r, c) ||
    hint.cause.some(([row, column]) => row === r && column === c) ||
    focusCellHasConflict(board, r, c)
  );
};

const exposeFocusSelection = (board: BoardObjectProps): BoardObjectProps =>
  keepFocusSelectionExposed(board, (r, c) => isFocusCellExposed(board, r, c));

const focusMethods: Partial<SudokuVariantMethods> = {
  // The visible region already conveys the relevant peers, and identical
  // values are mostly masked; selection tints would only add noise.
  usesSelectionHighlights: () => false,
  isCellExposed: isFocusCellExposed,
  getNavigatedCells: (board, direction) =>
    navigateFocusCells(board, direction, (r, c) =>
      isFocusCellExposed(board, r, c),
    ),
  prepareBoard: exposeFocusSelection,
  initialHintStage: 4,
  extraLayoutHeight: 0,
  initializeNotes: () => true,
  simplifyNotes: () => true,
  getGuidance: (board) => getFocusStep(board)?.hint,
  getDisplayHint(board) {
    const step = getFocusStep(board);
    return (
      board.activeHint ??
      (step
        ? {
            stage: 3,
            maxStage: 5,
            hint: step.hint,
            puzzleStateBeforeHint: step.puzzleStateBeforeStep,
          }
        : null)
    );
  },
  doesCellHaveConflict: focusCellHasConflict,
  isMoveCorrect: (board, r, c) => !focusCellHasConflict(board, r, c),
  isEraseButtonDisabled(board) {
    return !board.selectedCells.some(
      ({ r, c }) =>
        focusCellHasConflict(board, r, c) ||
        board.puzzleState[r][c].type === "note",
    );
  },
  getClearedCell(board, r, c) {
    const before = getFocusStep(board)?.puzzleStateBeforeStep[r][c];
    return before && focusCellHasConflict(board, r, c)
      ? cloneCell(before)
      : { type: "value", entry: 0 };
  },
  areCellUpdatesDisabled(board, r, c) {
    const cell = board.puzzleState[r][c];
    const before = getFocusStep(board)?.puzzleStateBeforeStep[r][c];
    return (
      cell.type === "given" ||
      (before?.type === "value" &&
        before.entry !== 0 &&
        !focusCellHasConflict(board, r, c))
    );
  },
  getHintPreviewBase(board, activeHint) {
    return (
      getFocusStep(board)?.puzzleStateBeforeStep ??
      activeHint.puzzleStateBeforeHint
    );
  },
};

export const boardMethods: Record<GameVariant, SudokuVariantMethods> = {
  classic: { ...defaultMethods, ...overrides.classic },
  drill: { ...defaultMethods, ...overrides.drill },
  "focus-classic": {
    ...defaultMethods,
    ...focusMethods,
    prepareBoard(board: BoardObjectProps, strategies: SudokuStrategy[]) {
      if ("initialPuzzleState" in board)
        throw new Error("Expected classic board");
      return exposeFocusSelection(updateClassicFocus(board, strategies));
    },
    handlePause(board: BoardObjectProps, navigation: any) {
      coreHandlePause(board, {
        navigate: () => navigation.navigate("PlayPage", { focus: "true" }),
      });
    },
    getEndGameModal({ statistics }: { statistics: ClassicGameStatistics }) {
      return React.createElement(CoreEndGameModal, { statistics, focus: true });
    },
    async generateGame(
      board: ClassicBoard,
      initializeNotes: boolean,
      strategies: SudokuStrategy[],
    ) {
      if (board.action === "ResumeGame") {
        const saved = await getActiveFocusClassicGame();
        if (saved)
          return exposeFocusSelection(updateClassicFocus(saved, strategies));
      }
      const game = await coreGenerateGame(
        { ...board, type: "classic", action: "StartGame" },
        true,
      );
      if (!game || "initialPuzzleState" in game) return null;
      const focusBoard: ClassicObjectProps = {
        ...game,
        variant: "focus-classic",
      };
      return {
        ...focusBoard,
        focus: { steps: [createClassicFocusStep(focusBoard, strategies)] },
      };
    },
    getSudokuBoardHint(board: BoardObjectProps, strategies: SudokuStrategy[]) {
      if ("initialPuzzleState" in board)
        throw new Error("Expected classic board");
      return coreGetSudokuBoardHint(
        board,
        strategies,
        getFocusActionHint(board),
      );
    },
    getHintPreviewBase(board: BoardObjectProps, activeHint: ActiveHintState) {
      return activeHint.puzzleStateBeforeHint;
    },
    finishSudokuGame(statistics: ClassicGameStatistics, variant: GameVariant) {
      return coreFinishGameStatistics(
        statistics,
        variant,
        "focus_classic_statistics",
      );
    },
  },
  "focus-drill": {
    ...defaultMethods,
    ...overrides.drill,
    ...focusMethods,
    handlePause(board: BoardObjectProps, navigation: any) {
      drillHandlePause(board, {
        navigate: () => navigation.navigate("DrillPage", { focus: "true" }),
      });
    },
    getEndGameModal({ statistics }: { statistics: DrillGameStatistics }) {
      return React.createElement(DrillEndGameModal, {
        statistics,
        focus: true,
      });
    },
    async generateGame(
      board: DrillBoard,
      initializeNotes: boolean,
      strategies: SudokuStrategy[],
    ) {
      if (board.action === "ResumeGame") {
        const saved = await getActiveFocusDrillGame();
        if (saved) return exposeFocusSelection(saved);
      }
      const game = await drillGenerateGame(
        { ...board, type: "drill", action: "StartGame" },
        true,
      );
      if (!game || !("initialPuzzleState" in game)) return null;
      const focusBoard: DrillObjectProps = { ...game, variant: "focus-drill" };
      const hint = getSudokuHint(game.initialPuzzleState, [
        game.statistics.difficulty,
      ]);
      return {
        ...focusBoard,
        focus: {
          steps: [createFocusStep(focusBoard, hint, game.puzzleSolution)],
        },
      };
    },
    getSudokuBoardHint(board: BoardObjectProps, strategies: SudokuStrategy[]) {
      const hint = getFocusStep(board)?.hint;
      if (!hint || !("initialPuzzleState" in board))
        throw new Error("Missing drill focus step");
      return {
        hint,
        updatedBoard: {
          ...board,
          statistics: { ...board.statistics, hintUsed: true },
        },
      };
    },
  },
} satisfies Record<GameVariant, SudokuVariantMethods>;

export const getClassicVariant = (focus: boolean): ClassicBoard["type"] =>
  focus ? "focus-classic" : "classic";
export const getDrillVariant = (focus: boolean): DrillBoard["type"] =>
  focus ? "focus-drill" : "drill";
