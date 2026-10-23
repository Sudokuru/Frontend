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
} from "./../../Functions/LocalDatabase";

import {
  doesCellHaveConflict as coreDoesCellHaveConflict,
  isMoveCorrect as coreIsMoveCorrect,
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

import { getSudokuBoardHint as coreGetSudokuBoardHint } from "./Core/Functions/HintFunctions";
import { getSudokuBoardHint as drillGetSudokuBoardHint } from "./Drill/Functions/HintFunctions";

import type { Board, ClassicBoard, DrillBoard } from "./SudokuBoard";
import React, { JSX } from "react";
import { SudokuStrategy } from "sudokuru";
import { toTitle } from "../../Functions/Utils";

export interface SudokuResumeSnapshot {
  modeId: BoardObjectProps["variant"];
  detail: string;
  elapsedSeconds: number;
}

export interface SudokuVariantMethods {
  getResumeSnapshot(sudokuBoard: BoardObjectProps): SudokuResumeSnapshot;
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
  getResumeSnapshot(sudokuBoard: BoardObjectProps): SudokuResumeSnapshot {
    return {
      modeId: "classic",
      detail: toTitle(
        (sudokuBoard as ClassicObjectProps).statistics.difficulty,
      ),
      elapsedSeconds: sudokuBoard.statistics.time,
    };
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
    getResumeSnapshot(sudokuBoard: BoardObjectProps): SudokuResumeSnapshot {
      return {
        modeId: "drill",
        detail: toTitle(
          (sudokuBoard as DrillObjectProps).statistics.difficulty,
        ),
        elapsedSeconds: sudokuBoard.statistics.time,
      };
    },
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
};

export const boardMethods = {
  classic: { ...defaultMethods, ...overrides.classic },
  drill: { ...defaultMethods, ...overrides.drill },
} satisfies Record<GameVariant, SudokuVariantMethods>;

export const getSudokuResumeSnapshot = (sudokuBoard: BoardObjectProps) =>
  boardMethods[sudokuBoard.variant].getResumeSnapshot(sudokuBoard);
