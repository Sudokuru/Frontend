# Table of Contents

- [Puzzles Class](#puzzles-class)
  - [Setup](#setup)
  - [Puzzles.startGame()](#puzzlesstartgame)
  - [Puzzles.getGame()](#puzzlesgetgame)
  - [Puzzles.saveGame()](#puzzlessavegame)
  - [Puzzles.finishGame()](#puzzlesfinishgame)
  - [Puzzles.getRandomGame()](#puzzlesgetrandomgame)
- [Drills Class](#drills-class)
  - [Setup](#setup-1)
  - [Drills.strategies](#drillsstrategies)
  - [Drills.getGame()](#drillsgetgame)
  - [How to Use Drills](#how-to-use-drills)
- [Lessons Class](#lessons-class)
  - [Setup](#setup-2)
  - [Lessons.getStrategies()](#lessonsgetstrategies)
  - [Lessons.getSteps()](#lessonsgetsteps)
  - [Lessons.getTutorial()](#lessonsgettutorial)
- [Statistics Class](#statistics-class)
  - [Setup](#setup-3)
  - [Statistics.getLearnedLessons()](#statisticsgetlearnedlessons)
  - [Statistics.saveLearnedLessons()](#statisticssavelearnedlessons)
  - [Statistics.getStatistics()](#statisticsgetstatistics)
  - [Statistics.deleteStatistics()](statisticsdeletestatistics)
- [Statistics Object Properties](#statistics-object-properties)
  - [userID](#userid)
  - [dateRange](#daterange)
  - [score](#score)
  - [strategiesLearned](#strategieslearned)
  - [averageSolveTime](#averagesolvetime)
  - [fastestSolveTime](#fastestsolvetime)
  - [totalSolveTime](#totalsolvetime)
  - [numHintsUsed](#numhintsused)
  - [numWrongCellsPlayed](#numwrongcellsplayed)
  - [numGamesPlayed](#numgamesplayed)
- [Puzzle Object Properties](#puzzle-object-properties)
  - [puzzle](#puzzle)
  - [puzzleSolution](#puzzlesolution)
  - [strategies](#strategies)
  - [difficulty](#difficulty)
  - [drillStrategies](#drillstrategies)
- [activeGame Object Properties](#activegame-object-properties)
  - [userID](#userid)
  - [puzzle](#puzzle-1)
  - [currentTime](#currenttime)
  - [moves array](#moves-array)
    - [puzzleCurrentState](#puzzlecurrentstate)
    - [puzzleCurrentNotesState](#puzzlecurrentnotesstate)
  - [numHintsUsed](#numhintsused)
  - [numWrongCellsPlayed](#numwrongcellsplayed)
- [finishGame Object Properties](#finishgame-object-properties)
  - [score](#score)
  - [solveTime](#solvetime)
  - [numHintsUsed](#numhintsused)
  - [numWrongCellsPlayed](#numwrongcellsplayed)

### Puzzles Class

#### Setup

```typescript
import { Puzzles } from "sudokuru";
```

#### Puzzles.startGame()

1. Description: Returns puzzle only containing strategies specified, hasn't been solved by user, and has difficulty as close to the specified difficulty as possible.
2. Syntax
   ```typescript
   Puzzles.startGame(url, difficulty, strategies, token).then(game => {
       if (game !== null) {
           console.log(game);
       }
       else {
           console.log("Unexpected error when starting game");
       }
   ```
3. Parameters
   - url: Server url e.g. "http://localhost:3100/"
   - difficulty: integer representing rd score, see Report.txt to see example values
   - strategies: array of strategies that are allowed to be in returned puzzle e.g. [ "NAKED_SINGLE" ]
   - token: string authentication token
4. Return Value: [activeGame](#activegame-object-properties) JSON object

#### Puzzles.getGame()

1. Description: Retrieves users active game if they have one, otherwise returns null
2. Syntax
   ```typescript
   Puzzles.getGame(url, token).then((game) => {
     if (game !== null) {
       console.log(game);
     } else {
       console.log("User doesn't have an activeGame");
     }
   });
   ```
3. Parameters:
   - url: Server url e.g. "http://localhost:3100/"
   - token: string authentication token
4. Return Value: [activeGame](#activegame-object-properties) JSON object if user has an active game, otherwise null

#### Puzzles.saveGame()

1. Description: Saves changes to users active game and returns true if successful
2. Syntax
   ```typescript
   Puzzles.saveGame(url, activeGame, puzzle, token).then((res) => {
     if (res) {
       console.log("Game progress was saved successfully");
     }
   });
   ```
3. Parameters:
   - url: Server url e.g. "http://localhost:3100/"
   - activeGame: [activeGame](#activegame-object-properties) JSON object containing only properties that are being updated
   - puzzle: a string containing the initial puzzle state
   - token: string authentication token
4. Return Value: true if game was saved successfully

#### Puzzles.finishGame()

1. Description: Deletes users active game and returns true if successful
2. Syntax
   ```typescript
   Puzzles.finishGame(url, puzzle, token).then((res) => {
     if (res) {
       console.log("Game was deleted successfully");
     }
   });
   ```
3. Parameters:
   - url: Server url e.g. "http://localhost:3100/"
   - puzzle: a string containing the initial puzzle state
   - token: string authentication token
     [finishGame](#finishgame-object-properties) JSON object if game exists and has been ended, otherwise null

#### Puzzles.getRandomGame()

1. Description: Returns a random game to be used by landing page display
2. Syntax
   ```typescript
   Puzzles.getRandomGame();
   ```
3. Return Value: [activeGame](#activegame-object-properties) JSON object

### Drills Class

#### Setup

```typescript
import { Drills } from "sudokuru";
```

#### Drills.strategies

1. Description: 2d array, subarrays contain strategy strings that drills are available for, the first element in each subarray with more than one element is the name of the group of strategies e.g. [["NAKED_SET", "NAKED_SINGLE", "NAKED_PAIR", ...]].

#### Drills.getGame()

1. Description: Returns board and notes state for a drill of the given strategy type if there is one
2. Syntax
   ```typescript
   Drills.getGame(url, strategy, token).then((drill) => {
     if (drill !== null) {
       console.log(drill);
     } else {
       console.log("No drill was found for the given strategy type");
     }
   });
   ```
3. Parameters:
   - url: Server url e.g. "http://localhost:3100/"
   - strategy: string representing strategy type, can be any from Drills.getDrillStrategies()
   - token: string authentication token
4. Return Value: JSON object containing puzzleCurrentState,puzzleCurrentNotesState, and puzzleSolution as described in [activeGame](#activegame-object-properties) if drill found, otherwise null

#### How to Use Drills

Once you get a drill game using Drills.getGame() and one of the supported strategies from Drills.strategies you just need to get a hint. To do that you can use [Puzzles.getHint()](#puzzlesgethint) using the board and notes from Drills.getGame() and the strategy you are using put inside of an array.

### Lessons Class

#### Setup

```typescript
import { Lessons } from "sudokuru";
```

#### Lessons.getStrategies()

1. Description: Returns an array containing strategy strings that lessons are available for
2. Syntax
   ```typescript
   Lessons.getStrategies().then((strategies) => {
     console.log(strategies);
   });
   ```
3. Return Value: string array e.g. ["AMEND_NOTES", "SIMPLIFY_NOTES", "NAKED_SET", ...]

#### Lessons.getSteps()

1. Description: Returns a 2d array containing "steps" which are arrays containing two strings, the first of which is text describing the image which is linked to by the url which is the second string in the subarray.
2. Syntax
   ```typescript
   Lessons.getSteps(strategy).then((steps) => {
     console.log(steps);
   });
   ```
3. Parameters:
   - strategy: string representing type, can be any from Lessons.strategies
4. Return Value: 2d array e.g. [["Here is an example of the simplify notes strategy", "https://sudokuru.s3.amazonaws.com/hintExample2-V2.png"]].

#### Lessons.getTutorial()

1. Description: Returns a 2d string array containing "steps" which are arrays containing two strings, the first of which is text describing the image which is linked to by the url which is the second string in the subarray for the first few lessons.
2. Syntax
   ```typescript
   Lessons.getTutorial().then((tutorial) => {
     console.log(tutorial);
   });
   ```
3. Return Value: 2d array e.g. [["Here is an example of the simplify notes strategy", "https://sudokuru.s3.amazonaws.com/hintExample2-V2.png"]].

### Statistics Class

#### Setup

```shell
import {Statistics} from 'sudokuru';
```

#### Statistics.getLearnedLessons()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   Statistics.getLearnedLessons(url, token).then((lessons) => {
     if (lessons !== null) {
       console.log(lessons);
     } else {
       console.log("User has not completed any lessons");
     }
   });
   ```
3. Return Value: JSON array:
   Example:

```json
{
  "strategiesLearned": ["NAKED_SINGLE", "HIDDEN_SINGLE"]
}
```

#### Statistics.saveLearnedLessons()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   Statistics.saveLearnedLessons(url, learnedLessons, token).then((res) => {
     if (res) {
       console.log("User's learned lessons were updated successfully!");
     }
   });
   ```
3. Return Value: boolean

#### Statistics.getStatistics()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   Statistics.getStatistics(url, token).then((statistics) => {
     if (statistics !== null) {
       console.log(statistics);
     } else {
       console.log("User does not have any game statistics!");
     }
   });
   ```
3. Return Value: [statistics](#statistics-object-properties)

#### Statistics.deleteStatistics()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   Statistics.deleteStatistics(url, token).then((res) => {
     if (res) {
       console.log("User's statistics were deleted successfully!");
     }
   });
   ```
3. Return Value: boolean

# Statistics Object Properties

## userID

```json
"P7JS989SM4DS058KAZ2Y5CNK80Q3"
```

Unique string representing the user (who this game belongs to)

## dateRange

```json
"1111-11-11T00:00:00.000Z"
```

Date representing what day the statistics object is tracking. "1111-11-11" is a special case representing
the object that stores the user's total statistics. Format: YYYY-MM-DD

## score

```json
200
```

Integer representing the user's total score

## strategiesLearned

```json
["NAKED_SINGLE", "HIDDEN_SINGLE"]
```

Array of strategies that the user has learned. Only stored in total statistics object

## averageSolveTime

```json
200
```

Average solve time of the user (time spent playing) in seconds

## fastestSolveTime

```json
200
```

Fastest solve time of the user (time spent playing) in seconds

## totalSolveTime

```json
200
```

Total solve time of the user (time spent playing) in seconds

## numHintsUsed

```json
3
```

Number of hints the user has requested

## numWrongCellsPlayed

```json
108
```

Number of times the user has entered the wrong number into a cell

## numGamesPlayed

```json
22
```

Number of games the user has played

# Puzzle Object Properties

## puzzle

```json
310084002200150006570003010423708095760030000009562030050006070007000900000001500
```

Initial puzzle state, 81 numeric characters, zeroes represent empty cells

## puzzleSolution

```json
316984752298157346574623819423718695765439128189562437851396274637245981942871563
```

Final puzzle state, 81 numeric characters

## strategies

```json
["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR", "NAKED_TRIPLET"]
```

Array of strings representing strategies the solver used to figure out puzzle solution

## difficulty

```json
44
```

Integer representing difficulty of puzzle which is directly related to how long it would typically take a human to solve it

## drillStrategies

```json
["HIDDEN_SINGLE", "NAKED_SEXTUPLET"]
```

Array of strings representing strategies that can be used on the puzzle in its intial state

# activeGame Object Properties

Stores data for game that user is playing or has paused.

## userID

```json
"P7JS989SM4DS058KAZ2Y5CNK80Q3"
```

Unique string representing the user (who this game belongs to)

## puzzle

```json
"003070040006002301089000000000107080517000006000400000271009005095000000000020000"
```

Initial puzzle state, 81 numeric characters, zeroes represent empty cells

## puzzleSolution

```json
"123675948456982371789314562964157283517238496832496157271849635395761824648523719"
```

Solved puzzle state, 81 numeric characters

## currentTime

```json
774
```

Number of seconds that has elapsed during gameplay

## difficulty

```json
24
```

The difficulty of the puzzle

## moves array

Contains state of the puzzle and user notes at each step in order first to latest (enables undo button)

### puzzleCurrentState

```json
"003070040006002301089000000000107080517000006000400000271009005095000000000020000"
```

Current puzzle state, 81 numeric characters, zeroes represent empty cells

### puzzleCurrentNotesState

```json
"111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"
```

729 characters, 9 per cell representing numbers 1-9 in order, cells going left to right and top to bottom, ones represent note being in cell and zeros represent note not in cell

## numHintsUsed

```json
3
```

Number of hints the user has requested during the game

## numWrongCellsPlayed

```json
108
```

Number of times the user has entered the wrong number into a cell

## numHintsUsedPerStrategy

```json
"NAKED_SINGLE": 4,
"HIDDEN_SINGLE": 8,
"NAKED_PAIR": 15,
"NAKED_TRIPLET": 16,
"NAKED_QUADRUPLET": 23,
"NAKED_QUINTUPLET": 42,
"NAKED_SEXTUPLET": 0,
"NAKED_SEPTUPLET": 0,
"NAKED_OCTUPLET": 0,
"HIDDEN_PAIR": 0,
"HIDDEN_TRIPLET": 0,
"HIDDEN_QUADRUPLET": 0,
"HIDDEN_QUINTUPLET": 0,
"HIDDEN_SEXTUPLET": 0,
"HIDDEN_SEPTUPLET": 0,
"HIDDEN_OCTUPLET": 0,
"POINTING_PAIR": 0,
"POINTING_TRIPLET": 0,
"BOX_LINE_REDUCTION": 0,
"X_WING": 0,
"SWORDFISH": 0,
"SINGLES_CHAINING": 0
```

Number of times each hint type has been given to the user

# finishGame Object Properties

## score

```json
69
```

User's score (max value is 100)

## solveTime

```json
234
```

User's solve time in seconds

## numHintsUsed

```json
4
```

The number of hits the user used.

## numWrongCellsPlayed

```json
6
```

The number of incorrect cells the user played
