import { Set } from "immutable";
import Hint from "./Hint";
import Group from "./Group";

/**
 * Given the x and y coordinates of a cell, returns the index of the box the cell is in
 * @param x - x coordinate of cell
 * @param y - y coordinate of cell
 * @returns - index of the box the cell is in
 */
function getBoxIndexFromXY(x: number, y: number): number {
  return Math.floor(x / 3) * 3 + Math.floor(y / 3);
}

/**
 * Given the type and index of a group that should be highlighted along with a cell position, returns true if the cell is in the given group and thus should be highlighted, false otherwise
 * @param groupType - row, col, or box
 * @param index - index of the group
 * @param row - row of the cell
 * @param col - column of the cell
 * @param box - box of the cell
 * @returns true if the cell should be highlighted, false otherwise
 */
function highlightGroup(
  groupType: string,
  index: number,
  row: number,
  col: number,
  box: number
): boolean {
  if (groupType == "row" && index == row) return true;
  if (groupType == "col" && index == col) return true;
  if (groupType == "box" && index == box) return true;
  return false;
}

/**
 * Given hint data and cell location returns true if the current cell should be highlighted because of the group it is in, false otherwise
 * @param currentHint - hint data
 * @param row - row cell is in
 * @param col - column cell is in
 */
export function highlightGroups(
  currentHint: any,
  row: number,
  col: number
): boolean {
  if (currentHint.groups) {
    // group highlighting
    for (let i = 0; i < currentHint.groups.length; i++) {
      // If the group matches hint, highlight the cell
      if (
        highlightGroup(
          currentHint.groups[i].type,
          currentHint.groups[i].index,
          row,
          col,
          getBoxIndexFromXY(col, row)
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Given hint data and cell location returns true if the current cell should be highlighted because of the cause it is in, false otherwise
 * @param currentHint - hint data
 * @param row - row cell is in
 * @param col - column cell is in
 * @returns true if the current cell should be highlighted because of the cause it is in, false otherwise
 */
export function highlightCauses(
  currentHint: any,
  row: number,
  col: number
): boolean {
  if (currentHint && currentHint.causes) {
    for (let i = 0; i < currentHint.causes.length; i++) {
      let currentCause_x = currentHint.causes[i][0];
      let currentCause_y = currentHint.causes[i][1];
      if (currentCause_x == col && currentCause_y == row) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Given hint data and cell location sets the removal highlights for the cell
 * @param isRemovalHighlight - array of booleans representing whether or not each number should be highlighted for removal
 * @param currentHint - hint data
 * @param row - row cell is in
 * @param col - column cell is in
 */
export function setRemovalHighlights(
  isRemovalHighlight: boolean[],
  currentHint: any,
  row: number,
  col: number
): void {
  if (currentHint.removals) {
    for (let i = 0; i < currentHint.removals.length; i++) {
      let currentRemoval = currentHint.removals[i];
      let currentRemoval_x = currentRemoval.position[0];
      let currentRemoval_y = currentRemoval.position[1];
      if (currentRemoval_x == col && currentRemoval_y == row) {
        if (currentRemoval.mode == "highlight") {
          for (let j = 0; j < currentRemoval.values.length; j++) {
            isRemovalHighlight[currentRemoval.values[j] - 1] = true;
          }
        }
      }
    }
  }
  return;
}

/**
 * Given hint data and cell location sets the placement highlights for the cell
 * @param isPlacementHighlight - array of booleans representing whether or not each number should be highlighted for placement
 * @param currentHint - hint data
 * @param row - row cell is in
 * @param col - column cell is in
 */
export function setPlacementHighlights(
  isPlacementHighlight: boolean[],
  currentHint: any,
  row: any,
  col: any
): void {
  if (currentHint.placements) {
    let currentPlacement = currentHint.placements;
    let currentPlacement_x = currentPlacement.position[0];
    let currentPlacement_y = currentPlacement.position[1];
    if (currentPlacement_x == col && currentPlacement_y == row) {
      if (currentPlacement.mode == "highlight") {
        isPlacementHighlight[currentPlacement.value - 1] = true;
      }
    }
  }
  return;
}

/**
 * Given hint object and group data, adds the group to the hint object
 * @param hint - hint object to add group to
 * @param hintStepNumber - step number to add group to
 * @param group - group to add
 */
export function addGroupToHint(
  hint: Hint,
  hintStepNumber: number,
  group: any[]
): void {
  let tempGroup: Group = new Group();
  for (let i: number = 0; i < group.length; i++) {
    if (group[i].type === "row") {
      tempGroup.setRow(group[i].index);
    } else if (group[i].type === "col") {
      tempGroup.setCol(group[i].index);
    } else if (group[i].type === "box") {
      tempGroup.setBox(group[i].index);
    }
  }
  hint.addGroup(hintStepNumber, tempGroup);
  return;
}

export const addEveryNote = (x: number, y: number, board: Object) => {
  let notes = board.get("puzzle").getIn([x, y]).get("notes") || Set();
  for (let i = 1; i <= 9; i++) {
    if (!notes.has(i)) {
      notes = notes.add(i);
    }
  }
  board = board.setIn(["puzzle", x, y, "notes"], notes);
  return board;
};

/**
 * Given a board and a list of notes being removed, adds notes to the board for every note being removed
 * @param board - board to add notes to
 * @param removals - array of removals to add notes for
 * @returns board with notes added
 */
export function addEveryRemovalNoteToBoard(board: any, removals: any[]): any {
  for (let i = 0; i < removals.length; i++) {
    board = addEveryNote(
      removals[i].position[0],
      removals[i].position[1],
      board
    );
  }
  return board;
}

/**
 * Creates a hint object from the given hint data
 * @param steps - number of steps in the hint
 * @param groups - groups involved in the hint
 * @param causes - causes involved in the hint
 * @param removals - removals involved in the hint
 * @param removalModes - modes of the removals involved in the hint at each step
 * @returns
 */
export function getHintObject(
  steps: number,
  groups: any[],
  causes: number[][],
  removals: any[],
  removalModes: string[]
): Hint {
  let hint: Hint = new Hint(steps);
  for (let step: number = 0; step < steps; step++) {
    addGroupToHint(hint, step, groups);
    hint.addCauses(step, causes);
    for (let removal: number = 0; removal < removals.length; removal++) {
      hint.addRemoval(
        step,
        removals[removal].position,
        removals[removal].values,
        removalModes[step]
      );
    }
  }
  return hint;
}
