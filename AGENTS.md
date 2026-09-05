# General

Avoid typecasting when possible.

# Playwright

Use `toBeInViewport({ ratio: 1 })`, not `toBeVisible()`, when asserting that UI is visible.

# Sudoku Board Architecture

Conditional logic based on Sudoku board variant type must not live in `SudokuBoard.tsx` or any other file. `SudokuBoardSharedFunctionsController.ts` must handle it. 

Update SudokuBoard state directly only in `SudokuBoard.tsx`, using the `setSudokuBoard()` function.  
