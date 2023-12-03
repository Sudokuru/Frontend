# Classic Variant

## Insertion Logic

```mermaid
flowchart
    PencilButtonState[Note Button State]
    InsertStart{{User Selects Cell}}
    InsertValue[User Presses HotKey/Button <br> to insert value into Cell]
    InsertNote[User Presses HotKey/Button <br>to insert note into Cell]
    PushHistory[Board pushes existing cell state <br> to ActionHistory array]
    UpdateCell[Cell is updated with new value]

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

<br>

For the purposes of cell insertion and undo logic, the Erase button is treated as an insertion of the value `0` and follows the same logic as any other value insertion.

Below is how the board represents an "Empty" cell:

```json
{ "type": "value", "entry": 0 }
```

## When is the game saved to localstorage

- After an insertion into a cell
- Before pausing the game
