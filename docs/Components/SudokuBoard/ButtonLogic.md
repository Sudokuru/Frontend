✅ ❌

# Classic Variant

## Button Enabled/Disabled logic

❌ = Disabled ✅ = Enabled

| Scenario                    | NumKeys | Erase |
| :-------------------------- | :-----: | :---: |
| No cell is selected         |   ❌    |  ❌   |
| Empty cell is selected      |   ✅    |  ❌   |
| Cell with notes is selected |   ✅    |  ✅   |
| Given cell is selected      |   ❌    |  ❌   |
| Correct cell is selected    |   ❌    |  ❌   |
| Incorrect cell is selected  |   ✅    |  ✅   |

Undo button is always enabled unless the history stack is empty.

Hint button is always enabled unless there is an incorrect cell on the board.
This will change when incorrectCell hints get added to Sudokuru package.

A specific NumKey is disabled if all of the values have been inserted into the puzzle.

Buttons that are always enabled

- Toggle Note Mode button
- Pause Button

## HotKeys

### Mappings from buttons to hotkeys

0 - Erase Button  
1-9 - NumKeys
