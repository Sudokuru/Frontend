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
