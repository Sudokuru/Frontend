# Board Variants

Sudoku Board variants are implemented using [Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide) and the [Strategy Pattern](https://refactoring.guru/design-patterns/strategy). 

## Classic Variant

Sudoku game with 9x9 grid.

Below are the difficulties for Classic variant, from easiest to most challenging:

- novice
- amateur
- layman
- trainee
- protege
- professional
- pundit
- master
- grandmaster

Currently we have 500 of each difficulty stored in app/Data/puzzles.

## Drill Variant

Sudoku game with 9x9 grid. Guaranteed to have a certain strategy avaliable as a next move. The user must follow the correct steps to solve the strategy and complete the drill.

## Lesson Variant
