/**
 * Shared layout constants and helpers for game board sizing and navigation
 * header visibility. This module has no SudokuBoard dependencies and is safe
 * to import from navigation and UI layers without pulling in game logic.
 */
export const MOBILE_BREAKPOINT = 768;

export const NAV_HEADER_HEIGHT = 60;
export const NAV_HEADER_SAFETY_PADDING = 12;

const HEADER_ROW_HEIGHT_IN_CELLS_MOBILE = 1.3;
const PUZZLE_HEIGHT_IN_CELLS = 9;
const ACTION_ROW_HEIGHT_IN_CELLS_MOBILE = 1.45;
const NUMBER_CONTROL_HEIGHT_IN_CELLS = 1.65;

const MOBILE_BOARD_LAYOUT_HEIGHT_IN_CELLS =
  HEADER_ROW_HEIGHT_IN_CELLS_MOBILE +
  PUZZLE_HEIGHT_IN_CELLS +
  ACTION_ROW_HEIGHT_IN_CELLS_MOBILE +
  NUMBER_CONTROL_HEIGHT_IN_CELLS;

export const isNavHeaderVisible = (width: number, height: number): boolean => {
  const cellSizeFromWidth = width / 9;
  const requiredContentHeight =
    cellSizeFromWidth * MOBILE_BOARD_LAYOUT_HEIGHT_IN_CELLS;
  const availableHeightWithHeader =
    height - NAV_HEADER_HEIGHT - NAV_HEADER_SAFETY_PADDING;
  return (
    width >= MOBILE_BREAKPOINT ||
    requiredContentHeight <= availableHeightWithHeader
  );
};
