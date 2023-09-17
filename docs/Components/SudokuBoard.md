# Stuff to track

## Board Object

#### hintSteps

An array that contains Hint Objects (causes, groups, removals)

### currentStep

An integer that contains what current step of Hint the user is on

#### hintStratName

A string that contains what strategy of hint the user has

#### inHintMode

A boolean that determines if the puzzle is in hint mode or not

#### hintInfo

A string that contains the hint text

#### inNoteMode

A boolean that determines if the puzzle is in note mode

#### selected

A boolean that determines if something is selected (not sure about this?)
It may be an object that returns x and y values of selected cell

#### hintAction

A string that contains more hint text

#### puzzle

Contains a list of size 9. Each list has an Array of size 9  
Each array contains a map with 'value', 'prefilled', and 'notes'

value is a number
prefilled is a boolean
notes is a Set of some stuff

## Props

gameType: A string that determines the game type. Currently can be 'Demo', 'Drill', or 'Puzzle'
strategies: An array of strings (strategies) that the board can use to solve the puzzle
difficulty?: The difficulty of the puzzle to retrieve
navigation?: navigation object so that SudokuBoard can navigate away from the page
showGameResults?: function that can be called to show game results

currently showGameResults is called outside of the Sudoku Board component. This is because the Alert was restricted by the size of the SudokuBoard view, and would not use up the full screen.
