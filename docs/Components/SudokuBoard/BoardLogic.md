# Classic Variant

## Insertion Logic

```mermaid
flowchart
    PencilButtonState[Note Button State]
    InsertStart{{User Selects Cells}}
    InsertValue[User Presses HotKey/Button <br> to insert value into Cells]
    InsertNote[User Presses HotKey/Button <br>to insert note into Cells]
    PushHistory[Board pushes existing cell state <br> to ActionHistory array]
    UpdateCell[Cells is/are updated with new content]

    PencilButtonState --> InsertStart
    InsertStart --> |If Note button is disabled|InsertValue
    InsertStart --> |If Note button is enabled|InsertNote
    InsertValue --> |If Insert is Valid|PushHistory
    InsertNote --> |If Insert is Valid|PushHistory
    PushHistory --> UpdateCell
```

## Undo Logic

```mermaid
flowchart
    UndoStart{{User Enters Undo}}
    UpdateUndoCell[Cell is updated with <br> top value of ActionHistory array]
    RemoveHistory[Top value of ActionHistory array is removed]

    UndoStart --> UpdateUndoCell
    UpdateUndoCell --> RemoveHistory
```

## Invalid Entry Logic

For classic variant - we check after a user performs a move to see if the cell is incorrect or not to determine if we should increment the mistake count. 

For drill variant:
- If the user inserts or removes a value we use the same logic as in the classic variant. 
- If the user inserts a note we check to solution to see if the note is present and add a mistake if the note added is not in the solution.
- If the user removes a note we check the solution to see if the note is present and add a mistake if the note removed is in the solution.

<br>

For the purposes of cell insertion and undo logic, the Erase button is treated as an insertion of the value `0` and follows the same logic as any other value insertion.

Below is how the board represents an "Empty" cell:

```json
{ "type": "value", "entry": 0 }
```

## When is the game saved to localstorage

- After an insertion into a cell
- Before pausing the game

## How the game score is calculated

The game score is broken up into 3 different subscores.
Subscores will always be greater than or equal to 0, which means a negative score is not possible. These subscores are added together to get a score between 0-100.

The subscores are divided as follows:

### Time Score

This is based on the total time taken to complete the puzzle.

Users can get a maximum of 30 points. Users get 0 points if their game takes 30 minutes. Users get 30 points if their game takes less than 1 minute, with every minute docking 1 point from the subscore.

### Difficulty Score

This is based on the difficulty of the puzzle.

Users can get a maximum of 40 points. Users get 0 points for a novice puzzle, 5 points for an amateur puzzle, 10 points for a layman puzzle, and so on.

### Incorrect cells and hints score

This is based on the number of incorrect cells and hints during the game.

Users can get a maximum of 30 points, with every hint asked for or incorrect cell placed decreasing the score by 5.

## End Game Screen

When a game ends, the following information is displayed to the user

- Score
- Time spent
- Number of Hints used
- Number of Hints used per strategy
- Mistakes made
- Difficulty

Here is an example of the JSON object used to save the statistics and display the score.

```json
{
  "totalScore": 72,
  "numGamesPlayed": 1,
  "fastestSolveTime": 334,
  "averageSolveTime": 334,
  "totalSolveTime": 334,
  "numHintsUsed": 0,
  "numHintsUsedPerStrategy": [],
  "numWrongCellsPlayed": 3
}
```
