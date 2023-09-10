const LOCAL_STORAGE_ALL_LEARNED_LESSONS =
  '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]';

const PLAY_DRAWER_BUTTON = "[data-testid=PlayButton]";
const TOGGLE_NOTE_MODE_BUTTON = "[data-testid=toggleNoteModeButton]";
const ERASE_BUTTON = "[data-testid=eraseButton]";
const SUDOKU_BOARD = "[data-testid=sudokuBoard]";
const HINT_BUTTON = "[data-testid=hintButton]";
const OPEN_DRAWER_NAVIGATION = "[data-testid=OpenDrawerNavigation]";
const PAUSE_BUTTON = "[data-testid=PauseButton]";
const UNDO_BUTTON = "[data-testid=undoButton]";
const START_NEW_GAME_BUTTON = "[data-testid='StartNewGameButton-text']";
const HINT_RIGHT_ARROW = "[data-testid='hintRightArrow']";
const HINT_LEFT_ARROW = "[data-testid='hintLeftArrow']";
const HINT_CHECK_MARK = "[data-testid='hintCheckMark']";
const DRILL_DRAWER_BUTTON = "[data-testid=DrillButton]";

function NUMBER_BUTTON(number: number): string {
  return "[data-testid=numberControl" + number + "]";
}

function CELL(row: number, column: number): string {
  return "[data-testid^=cellr" + row + "c" + column + "]";
}

function CELL_WITH_VALUE(row: number, column: number, value: number): string {
  return "[data-testid=cellr" + row + "c" + column + "value\\:" + value + "]";
}

function CELL_WITH_NOTES(row: number, column: number, notes: string): string {
  return "[data-testid=cellr" + row + "c" + column + "notes\\:" + notes + "]";
}

export {
  LOCAL_STORAGE_ALL_LEARNED_LESSONS,
  PLAY_DRAWER_BUTTON,
  TOGGLE_NOTE_MODE_BUTTON,
  ERASE_BUTTON,
  SUDOKU_BOARD,
  HINT_BUTTON,
  OPEN_DRAWER_NAVIGATION,
  PAUSE_BUTTON,
  NUMBER_BUTTON,
  UNDO_BUTTON,
  START_NEW_GAME_BUTTON,
  HINT_CHECK_MARK,
  HINT_LEFT_ARROW,
  HINT_RIGHT_ARROW,
  CELL,
  CELL_WITH_VALUE,
  CELL_WITH_NOTES,
  DRILL_DRAWER_BUTTON,
};
