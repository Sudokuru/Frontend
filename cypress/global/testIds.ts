export const ACTIVE_GAME =
  '[{"variant":"classic","version":"1.0.0","selectedCell":null,"puzzle":[[{"type":"value","entry":1},{"type":"value","entry":2},{"type":"given","entry":3},{"type":"value","entry":6},{"type":"given","entry":7},{"type":"value","entry":5},{"type":"value","entry":9},{"type":"given","entry":4},{"type":"value","entry":8}],[{"type":"value","entry":4},{"type":"value","entry":5},{"type":"given","entry":6},{"type":"value","entry":9},{"type":"value","entry":8},{"type":"given","entry":2},{"type":"given","entry":3},{"type":"value","entry":7},{"type":"given","entry":1}],[{"type":"value","entry":7},{"type":"given","entry":8},{"type":"given","entry":9},{"type":"value","entry":3},{"type":"value","entry":1},{"type":"value","entry":4},{"type":"value","entry":5},{"type":"value","entry":6},{"type":"value","entry":2}],[{"type":"value","entry":9},{"type":"value","entry":6},{"type":"value","entry":4},{"type":"given","entry":1},{"type":"value","entry":5},{"type":"given","entry":7},{"type":"value","entry":2},{"type":"given","entry":8},{"type":"value","entry":3}],[{"type":"given","entry":5},{"type":"given","entry":1},{"type":"given","entry":7},{"type":"value","entry":2},{"type":"value","entry":3},{"type":"value","entry":8},{"type":"value","entry":4},{"type":"value","entry":9},{"type":"given","entry":6}],[{"type":"value","entry":8},{"type":"value","entry":3},{"type":"value","entry":2},{"type":"given","entry":4},{"type":"value","entry":9},{"type":"value","entry":6},{"type":"value","entry":1},{"type":"value","entry":5},{"type":"value","entry":7}],[{"type":"given","entry":2},{"type":"given","entry":7},{"type":"given","entry":1},{"type":"value","entry":8},{"type":"value","entry":4},{"type":"given","entry":9},{"type":"value","entry":6},{"type":"value","entry":3},{"type":"given","entry":5}],[{"type":"value","entry":3},{"type":"given","entry":9},{"type":"given","entry":5},{"type":"value","entry":7},{"type":"value","entry":6},{"type":"value","entry":1},{"type":"value","entry":1},{"type":"value","entry":0},{"type":"note","entry":[4,5]}],[{"type":"value","entry":6},{"type":"value","entry":4},{"type":"value","entry":8},{"type":"value","entry":5},{"type":"given","entry":2},{"type":"value","entry":3},{"type":"value","entry":7},{"type":"value","entry":1},{"type":"value","entry":9}]],"puzzleSolution":[[1,2,3,6,7,5,9,4,8],[4,5,6,9,8,2,3,7,1],[7,8,9,3,1,4,5,6,2],[9,6,4,1,5,7,2,8,3],[5,1,7,2,3,8,4,9,6],[8,3,2,4,9,6,1,5,7],[2,7,1,8,4,9,6,3,5],[3,9,5,7,6,1,8,2,4],[6,4,8,5,2,3,7,1,9]],"statistics":{"difficulty":"easy","internalDifficulty":348,"numHintsUsed":0,"numWrongCellsPlayed":235,"score":0,"time":374},"inNoteMode":false,"actionHistory":[]}]';
export const ACTIVE_GAME_TWO =
  '[{"puzzle":"003070040006002301089000000000107080517000006000400000271009005095000000000020000","puzzleSolution":"123675948456982371789314562964157283517238496832496157271849635395761824648523719","moves":[{"puzzleCurrentState":"123675948456982371789314562964157283517238496832496157271849635395761100648523719","puzzleCurrentNotesState":"000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000"}],"strategies":["NAKED_SINGLE","HIDDEN_SINGLE","NAKED_PAIR"],"difficulty":400,"drillStrategies":["NAKED_SINGLE","POINTING_PAIR","POINTING_TRIPLET"],"currentTime":200,"numWrongCellsPlayed":200, "numHintsUsed":50}]';

export const LOCAL_STORAGE_ALL_LEARNED_LESSONS =
  '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE","SIMPLIFY_NOTES","NAKED_SET","HIDDEN_SINGLE","HIDDEN_SET","POINTING_SET"]';
export const LOCAL_STORAGE_SOME_LEARNED_LESSONS =
  '["SUDOKU_101","AMEND_NOTES","NAKED_SINGLE"]';

export const PLAY_DRAWER_BUTTON = "[data-testid=PlayButton]";
export const LEARN_DRAWER_BUTTON = "[data-testid=LearnButton]";
export const TOGGLE_NOTE_MODE_BUTTON = "[data-testid=toggleNoteModeButton]";
export const ERASE_BUTTON = "[data-testid=eraseButton]";
export const SUDOKU_BOARD = "[data-testid=sudokuBoard]";
export const HINT_BUTTON = "[data-testid=hintButton]";
export const OPEN_DRAWER_NAVIGATION = "[data-testid=OpenDrawerNavigation]";
export const PAUSE_BUTTON = "[data-testid=PauseButton]";
export const UNDO_BUTTON = "[data-testid=undoButton]";
export const START_NEW_GAME_BUTTON = "[data-testid='StartNewGameButton-text']";
export const HINT_RIGHT_ARROW = "[data-testid='hintRightArrow']";
export const HINT_LEFT_ARROW = "[data-testid='hintLeftArrow']";
export const HINT_CHECK_MARK = "[data-testid='hintCheckMark']";
export const DRILL_DRAWER_BUTTON = "[data-testid=DrillButton]";
export const DISMISS_DRILL_TUTORIAL_CHECKBOX =
  "[data-testid=dismissDrillTutorial]";
export const HIDE_DRILL_TUTORIAL_BUTTON =
  "[data-testid=hideDrillTutorialButton]";
export const CONTACT_DRAWER_BUTTON = "[data-testid=ContactButton]";

export const VIEW_STATISTICS_PAGE_BUTTON =
  "[data-testid=ViewStatisticsPageButton]";
export const VIEW_PROFILE_PAGE_BUTTON = "[data-testid=ViewProfilePageButton]";
export const VIEW_HOME_PAGE_BUTTON = "[data-testid=ViewHomePageButton]";

export const END_GAME_SCORE = "[data-testid=score]";
export const END_GAME_TIME = "[data-testid=time]";
export const END_GAME_NUM_HINTS_USED = "[data-testid=numHintsUsed]";
export const END_GAME_NUM_WRONG_CELLS_PLAYED =
  "[data-testid=numWrongCellsPlayed]";
export const END_GAME_DIFFICULTY = "[data-testid=difficulty]";

export const STATISTICS_TOTAL_SCORE = "[data-testid=totalScore]";
export const STATISTICS_NUM_GAMES_PLAYED = "[data-testid=numGamesPlayed]";
export const STATISTICS_FASTEST_SOLVE_TIME = "[data-testid=fastestSolveTime]";
export const STATISTICS_AVERAGE_SOLVE_TIME = "[data-testid=averageSolveTime]";
export const STATISTICS_TOTAL_SOLVE_TIME = "[data-testid=totalSolveTime]";
export const STATISTICS_NUM_HINTS_USED = "[data-testid=numHintsUsed]";
export const STATISTICS_NUM_WRONG_CELLS_PLAYED =
  "[data-testid=numWrongCellsPlayed]";

export const DARK_THEME_ENABLED_TOGGLE = "[data-testid=DarkThemeEnabled]";
export const DARK_THEME_DISABLED_TOGGLE = "[data-testid=DarkThemeDisabled]";
export const HIGHLIGHT_IDENTICAL_VALUES_ENABLED =
  "[data-testid=HighlightIdenticalValuesEnabled]";
export const HIGHLIGHT_IDENTICAL_VALUES_DISABLED =
  "[data-testid=HighlightIdenticalValuesDisabled]";
export const HIGHLIGHT_BOX_ENABLED = "[data-testid=HighlightBoxEnabled]";
export const HIGHLIGHT_BOX_DISABLED = "[data-testid=HighlightBoxDisabled]";
export const HIGHLIGHT_ROW_ENABLED = "[data-testid=HighlightRowEnabled]";
export const HIGHLIGHT_ROW_DISABLED = "[data-testid=HighlightRowDisabled]";
export const HIGHLIGHT_COLUMN_ENABLED = "[data-testid=HighlightColumnEnabled]";
export const HIGHLIGHT_COLUMN_DISABLED =
  "[data-testid=HighlightColumnDisabled]";

export const HOME_LEARN_BUTTON = "[data-testid=HomeLearnButton]";
export const HOME_DRILL_BUTTON = "[data-testid=HomeDrillButton]";
export const HOME_PLAY_BUTTON = "[data-testid=HomePlayButton]";

export function NUMBER_BUTTON(number: number): string {
  return "[data-testid=numberControl" + number + "]";
}

export function CELL(row: number, column: number): string {
  return "[data-testid^=cellr" + row + "c" + column + "]";
}

export function CELL_WITH_VALUE(
  row: number,
  column: number,
  value: number,
): string {
  return "[data-testid=cellr" + row + "c" + column + "value\\:" + value + "]";
}

export function CELL_WITH_NOTES(
  row: number,
  column: number,
  notes: string,
): string {
  return "[data-testid=cellr" + row + "c" + column + "notes\\:" + notes + "]";
}
