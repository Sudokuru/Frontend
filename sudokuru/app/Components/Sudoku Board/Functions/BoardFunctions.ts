import {useWindowDimensions} from "react-native";
import {Set} from "immutable";
import { Puzzles } from "sudokuru"
/*
 * This is a temporary place to store functions
 * todo functions will be documented, sorted, and optimized
 */

/*
 * This function retrieves the user's device size and calculates the cell size
 * board has width and height dimensions of 1 x 1.44444
 */
export function getCellSize()
{
    const size = useWindowDimensions();

    return Math.min(size.width * 1.44444, size.height) / 15;
}

export function getNumberOfGroupsAssignedForNumber(number: any, groups: any) {
    return groups.reduce((accumulator: any, row: any) =>
        accumulator + (row.get(number) > 0 ? 1 : 0), 0);
}

export function updateBoardWithNumber({ x, y, number, fill = true, board }: any) {

    let cell = board.get('puzzle').getIn([x, y]);
    cell = cell.delete('notes');
    cell = fill ? cell.set('value', number) : cell.delete('value');

    const increment = fill ? 1 : -1;
    const rowPath = ['choices', 'rows', x, number];
    const columnPath = ['choices', 'columns', y, number];
    const squarePath = ['choices', 'squares', ((Math.floor(x / 3)) * 3) + Math.floor(y / 3), number];

    return board.setIn(rowPath, board.getIn(rowPath) + increment)
        .setIn(columnPath, board.getIn(columnPath) + increment)
        .setIn(squarePath, board.getIn(squarePath) + increment)
        .setIn(['puzzle', x, y], cell);
}

export const checkSolution = (solution: any, x: any, y: any, value: any) => {
    let cellNum = getCellNumber(y, x); // Flipping x and y because of how the solution string is formatted
    let solutionValue = solution.charAt(cellNum);

    return solutionValue == value;
}

export function replaceChar(origString: any, replaceChar: any, index: any) {
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);

    return firstPart + replaceChar + lastPart;
}

// function that converts x,y cell coords to a number
export const getCellNumber = (x: any, y: any) => {
    return y + x * 9;
};

export const getBoxIndexFromCellNum = (cellNum: any) => {
    return Math.floor((cellNum % 9) / 3);
}

export const getBoxIndexFromXY = (x: any,y: any) => {
    return Math.floor(x / 3) * 3 + Math.floor(y / 3);
}

export const getCausesFromHint = (hint: any) => {
    let causes = []
    for (let i = 0; i < hint.cause.length; i++)
    {
        causes.push(hint.cause[i])
    }
    return causes
}

export const getGroupsFromHint = (hint: any) => {
    let groups = []
    let temp: any = {}
    for (let i = 0; i < hint.groups.length; i++)
    {
        temp = {}
        switch (hint.groups[i][0])
        {
            case 0: // column
                temp.type = "col"
                temp.index = hint.groups[i][1]
                break;
            case 1: // row
                temp.type = "row"
                temp.index = hint.groups[i][1]
                break;
            case 2: // box
                temp.type = "box"
                temp.index = hint.groups[i][1]
                break;
        }
        groups.push(temp)
    }
    return groups
}

export const getPlacementsFromHint = (hint: any) => {
    let placements = []
    let temp: any = {}
    for (let i = 0; i < hint.placements.length; i++)
    {
        temp = {}
        temp.position = []
        temp.position.push(hint.placements[i][0])
        temp.position.push(hint.placements[i][1])
        temp.value = hint.placements[i][2]
        placements.push(temp)
    }
    return placements
}

export const getRemovalsFromHint = (board: any, hint: any) => {
    let removals = []
    let temp: any = {}
    for (let i = 0; i < hint.removals.length; i++)
    {
        let x = hint.removals[i][0]
        let y = hint.removals[i][1]
        temp = {}
        temp.position = []
        temp.position.push(x)
        temp.position.push(y)
        temp.values = []
        temp.values.push()
        for (let j = 2; j < hint.removals[i].length; j++)
            temp.values.push(hint.removals[i][j])

        removals.push(temp)
    }
    return removals
}

// for each cell that is a part of the hint, store the coordinates and the resulting state
// if there is a notes field for the cell, the notes must match
// if there is a value field for the cell, the value must match
export function getDrillSolutionCells(board: any, solution: any, strategies: any)
{
    let drillSolutionCells = [];
    let hint = getHint(board, solution, strategies);
    if (hint)
    {
        for (let i = 0; i < hint.removals.length; i++)
        {
            let temp: any = {};
            let currRemoval = hint.removals[i];
            temp.x = currRemoval[0];
            temp.y = currRemoval[1];
            temp.notes = board.get('puzzle').getIn([temp.x, temp.y]).get('notes');
            for (let j = 2; j < currRemoval.length; j++)
            {
                temp.notes = temp.notes.delete(currRemoval[j]);
            }
            drillSolutionCells.push(temp);
        }

        if (hint.placements[0])
        {
            let temp: any = {}
            temp.x = hint.placements[0][0];
            temp.y = hint.placements[0][1];
            temp.value = hint.placements[0][2];
            drillSolutionCells.push(temp);
        }
    }
    return drillSolutionCells;
};

// https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
export const formatTime = (inputSeconds: number) => {
    // Get minutes and remaining seconds
    const days = Math.floor(inputSeconds / (3600*24));
    const hours = Math.floor(inputSeconds % (3600*24) / 3600);
    const minutes = Math.floor(inputSeconds % 3600 / 60);
    const seconds = Math.floor(inputSeconds % 60);
    // Pad with zeros if needed
    const paddedDays = days > 0 ? (days < 10 ? "0" : "") + days + ":" : "";
    const paddedHours = hours > 0 ? (hours < 10 ? "0" : "") + hours + ":" : (hours == 0 && days != 0) ? "00" : "";
    const paddedMinutes = minutes > 0 ? (minutes < 10 ? "0" : "") + minutes + ":" : (minutes == 0 && hours != 0) ? "00" : "";
    const paddedSeconds = seconds > 0 ? (seconds < 10 ? "0" : "") + seconds : (seconds == 0 && minutes != 0) ? "00" : "0";

    // Return formatted string
    return `${paddedDays}${paddedHours}${paddedMinutes}${paddedSeconds}`;
};

// USAGE
// board = addNumberAsNote(...)
function addNumberAsNote (number: any, board: any, i: any, j: any) {
    let selectedCell = board.get('puzzle').getIn([i, j]);
    if (!selectedCell)
    {
        return;
    }
    const prefilled = selectedCell.get('prefilled');
    if (prefilled)
    {
        return;
    }
    // @ts-ignore
    let notes = selectedCell.get('notes') || new Set();
    notes = notes.add(number);
    selectedCell = selectedCell.set('notes', notes);
    board = board.setIn(['puzzle', i, j], selectedCell);
    return board;
};

export function componentBoardValsToArray(board: any)
{
    let boardArray = [];
    let temp = [];
    for (let i = 0; i < 9; i++)
    {
        temp = [];
        for (let j = 0; j < 9; j++)
        {
            let currVal = board.get('puzzle').getIn([i, j, 'value']);
            temp.push(!currVal ? "0" : currVal.toString());
        }
        boardArray.push(temp);
    }
    return boardArray;
}

function componentBoardNotesToArray(board: any)
{
    let notesArray = [];
    let temp: any = [];
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            temp = [];
            let notesSetFromComponent = board.get('puzzle').getIn([i, j, 'notes']);
            if (!notesSetFromComponent)
            {
                notesArray.push(temp);
                continue;
            }
            for (let k = 1; k <= 9; k++)
            {
                if (notesSetFromComponent.includes(k))
                {
                    temp.push((k).toString());
                }
            }
            notesArray.push(temp);
        }
    }
    return notesArray;
}

function componentSolutionValsToArray(solution: any)
{
    let solArray = [];
    let temp = [];
    for (let i = 0; i < 9; i++)
    {
        temp = [];
        for (let j = 0; j < 9; j++)
        {
            temp.push(solution[9 * j + i].toString());
        }
        solArray.push(temp);
    }
    return solArray;
}

export function getHint(board: any, solution: any, strategies: any)
{
    let hintStrategies = [...strategies];
    hintStrategies.push("AMEND_NOTES", "SIMPLIFY_NOTES");
    let boardArray = componentBoardValsToArray(board);
    let notesArray = componentBoardNotesToArray(board);
    let solutionArray = componentSolutionValsToArray(solution);
    let hint;
    try {
        hint = Puzzles.getHint(boardArray, notesArray, hintStrategies, solutionArray);
    } catch (e) {
        console.log(e);
    }
    return hint;
}

export function parseApiAndAddNotes(board: any, puzzleCurrentNotesState: any, isDrill: boolean)
{
    if (!puzzleCurrentNotesState)
    {
        return;
    }
    if (puzzleCurrentNotesState.length != 729)
    {
        return;
    }
    let stringIndex = 0;
    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++)
        {
            for (let currNoteIndex = 0; currNoteIndex < 9; currNoteIndex++)
            {
                stringIndex = 81 * i + 9 * j + currNoteIndex;

                if (puzzleCurrentNotesState.charAt(stringIndex) == 1){
                    if (isDrill){
                        board = addNumberAsNote(currNoteIndex + 1, board, j, i);
                    } else {
                        board = addNumberAsNote(currNoteIndex + 1, board, i, j);
                    }
                }
            }
        }
    }
    return board;
}

export function strPuzzleToArray(str: any) {
    let arr: any = [];
    for (let i = 0; i < str.length; i += 9) {
        arr.push(str.slice(i, i + 9).split('').map(Number));
    }
    // @ts-ignore
    let output = arr[0].map((_: any, colIndex: any) => arr.map(row => row[colIndex]));
    return { puzzle: output };
}