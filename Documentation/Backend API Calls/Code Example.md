# Calling the Backend

### Example for how to call the Backend using the Sudokuru API:

This example is calling the Drills.getGame() API of the Sudokuru.
Please reference this [documentation](https://github.com/SudoKuru/Sudokuru) for a list of all Sudokuru API calls

#### Import statements and constants

Note that these import statements may differ depending on where you are located in the app
because they are local references.

The Drills constant is used to make calls to the Drills API

```typescript
import {getKeyString} from "../Functions/Auth0/token";
import {USERACTIVEGAMESBFFURL} from '@env'
import {Drills} from 'sudokuru'

const Drills = sudokuru.Drills;
```

#### Function call

`USERACTIVEGAMESBFFURL` is an environment variable that stores the URL to aforementioned BFF.

```javascript
generateGame(USERACTIVEGAMESBFFURL,  ["HIDDEN_SINGLE"])
```

#### Function

The `strPuzzleToArray` function is used to convert the puzzle string retrieved from the Backend into
the format that the Board component can read and understand.

The `parseAPIAndAddNotes` function is used to convert the puzzle notes string retrieved from the Backend into
the format the Board component can read and understand.

the `getKeyString` function is imported from the Functions folder and is used to retrieve the access token
from local storage. This method is compatible with both web and mobile devices.


```javascript
async function generateGame(url, strategy) {
    let token = null;
    await getKeyString("access_token").then(
        result => {
            token = result;
            
        });
    
    let board = await Drills.getGame(url, strategy, token).then(game => {
        let board = makeBoard(strPuzzleToArray(game.puzzleCurrentState));
        board = parseAPIAndAddNotes(board, game.puzzleCurrentNotesState);
        return board;
    });
}
```
