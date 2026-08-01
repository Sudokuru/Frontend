# Playwright

Use `toBeInViewport({ ratio: 1 })`, not `toBeVisible()`, when asserting that UI is visible.

# Sudoku Board Architecture

Conditional logic based on Sudoku board varient type shouldn't live in SudokuBoard.tsx or elsewhere. It should be handled by `SudokuBoardSharedFunctionsController.ts`.

SudokuBoard state should only directly be updated in SudokuBoard.tsx file (usage of setSudokuBoard() function)
