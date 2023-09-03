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
