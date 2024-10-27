# Table of Contents

- [Puzzles](#puzzles)
  - [startGame()](#puzzlesstartgame)
  - [getGame()](#puzzlesgetgame)
  - [saveGame()](#puzzlessavegame)
  - [finishGame()](#puzzlesfinishgame)
- [Lessons](#lessons)
  - [getStrategies()](#lessonsgetstrategies)
  - [getSteps()](#lessonsgetsteps)
  - [getTutorial()](#lessonsgettutorial)
- [Statistics](#statistics)
  - [getLearnedLessons()](#statisticsgetlearnedlessons)
  - [saveLearnedLessons()](#statisticssavelearnedlessons)
  - [getStatistics()](#statisticsgetstatistics)
  - [deleteStatistics()](statisticsdeletestatistics)
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

### Puzzles

#### startGame()

1. Description: Returns puzzle only containing strategies specified, hasn't been solved by user, and has difficulty as close to the specified difficulty as possible.
2. Syntax
   ```typescript
   startGame(difficulty);
   ```
3. Parameters
   - difficulty: integer representing rd score, see Report.txt to see example values
4. Return Value: [activeGame](#activegame-object-properties) JSON object

#### getGame()

1. Description: Retrieves users active game if they have one, otherwise returns null
2. Syntax
   ```typescript
   const game = await getGame();
   ```
3. Return Value: [activeGame](#activegame-object-properties) JSON object if user has an active game, otherwise null

#### saveGame()

1. Description: Saves changes to users active game and returns true if successful
2. Syntax
   ```typescript
   saveGame(activeGame);
   ```
3. Parameters:
   - activeGame: [activeGame](#activegame-object-properties) JSON object containing only properties that are being updated
4. Return Value: None

#### finishGame()

1. Description: Deletes users active game and returns true if successful
2. Syntax
   ```typescript
   await finishGame(numHintsUsed: number, numWrongCellsPlayed: number, time: number, score: number);
   ```
3. Parameters:
   - numHintsUsed: the number of hints used from the game
   - numWrongCellsPlayed: the number of wrong cells from the game
   - time: the time from the game
   - score: the score from the game

### Lessons

#### getLessonStrategies()

1. Description: Returns an array containing strategy strings that lessons are available for
2. Syntax
   ```typescript
   const strategies = getLessonStrategies();
   ```
3. Return Value: string array e.g. ["AMEND_NOTES", "SIMPLIFY_NOTES", "NAKED_SET", ...]

#### getLessonSteps()

1. Description: Returns a 2d array containing "steps" which are arrays containing two strings, the first of which is text describing the image which is linked to by the url which is the second string in the subarray.
2. Syntax
   ```typescript
   const steps = getLessonSteps(strategy);
   ```
3. Parameters:
   - strategy: string representing type, can be any from Lessons.strategies
4. Return Value: 2d array e.g. [["Here is an example of the simplify notes strategy", "https://sudokuru.s3.amazonaws.com/hintExample2-V2.png"]].

### Statistics

#### getLearnedLessons()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   const learnedLessons = await getLearnedLessons();
   ```
3. Return Value: JSON array:
   Example:

```json
{
  "strategiesLearned": ["NAKED_SINGLE", "HIDDEN_SINGLE"]
}
```

#### saveLearnedLessons()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   saveLearnedLessons(learnedLessons);
   ```
3. Return Value: boolean

#### getStatistics()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   const statistics = await getStatistics();
   ```
3. Return Value: [statistics](#statistics-object-properties)

#### deleteStatistics()

1. Description: Returns an JSON object containing the strategies a user has learned
2. Syntax
   ```typescript
   await deleteStatistics();
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
