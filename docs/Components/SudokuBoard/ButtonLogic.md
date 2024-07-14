✅ ❌

# Classic Variant

## Button Enabled/Disabled logic

❌ = Disabled ✅ = Enabled

| Single-Select Scenario      | NumKeys | Erase |
| :-------------------------- | :-----: | :---: |
| No cell is selected         |   ❌    |  ❌   |
| Empty cell is selected      |   ✅    |  ❌   |
| Cell with notes is selected |   ✅    |  ✅   |
| Given cell is selected      |   ❌    |  ❌   |
| Correct cell is selected    |   ❌    |  ❌   |
| Incorrect cell is selected  |   ✅    |  ✅   |

| Multi-Select Scenario                                                                       | NumKeys | Erase |
| :------------------------------------------------------------------------------------------ | :-----: | :---: |
| Multiple cells selected, with at least once cell matching single-select acceptance critiera |   ✅    |  ✅   |
| Multiple cells selected, with none of the cells matching single-select acceptance criteria  |   ❌    |  ❌   |

Undo button is always enabled unless the history stack is empty.

Hint button is always enabled unless there is an incorrect cell on the board.
This will change when incorrectCell hints get added to Sudokuru package.

A specific NumKey is disabled if all of the values have been inserted into the puzzle.

Buttons that are always enabled

- Toggle Note Mode button
- Pause Button

## HotKeys

### Mappings from buttons to hotkeys

0, "Delete", "Backspace", "e", "E" - Erase Button  
"u", "U" - Undo Button  
"p", "P" - Pause Button  
"t", "T", "n", "N" - Toggle Notes Button  
1-9 - NumKeys  
"ArrowLeft", "A", "a" - Move selected cells left  
"ArrowRight", "D", "d" - Move selected cells right  
"ArrowUp", "W", "w", - Move selected cells up  
"ArrowDown", "S", "s" - Move selected cells down
"Shift" - block multiselect key  
"Control", "Meta" - single multiselect key
