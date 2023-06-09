/**
 * Given the x and y coordinates of a cell, returns the index of the box the cell is in
 * @param x - x coordinate of cell
 * @param y - y coordinate of cell
 * @returns - index of the box the cell is in
 */
function getBoxIndexFromXY(x: number, y: number):number {
    return Math.floor(x / 3) * 3 + Math.floor(y / 3);
}

/**
 * Given a group type, index, and cell position, returns true if the group should be highlighted, false otherwise
 * @param groupType - row, col, or box
 * @param index - index of the group
 * @param row - row of the cell
 * @param col - column of the cell
 * @param box - box of the cell
 * @returns true if the group should be highlighted, false otherwise
 */
function highlightGroup(groupType: string, index: any, row: any, col: any, box: any):boolean {
    if (groupType == "row" && index == row) return true;
    if (groupType == "col" && index == col) return true;
    if (groupType == "box" && index == box) return true;
    return false;
  }

  /**
  * Given hint data and cell location returns true if the current group should be highlighted, false otherwise
  * @param currentHint - hint data
  * @param row - row cell is in
  * @param col - column cell is in
  */
 export function highlightGroups(currentHint: any, row: any, col: any):boolean {
   if (currentHint.groups) {
     // group highlighting
     for (let i = 0; i < currentHint.groups.length; i++) {
       // If the group matches hint, highlight the group
       if (highlightGroup(currentHint.groups[i].type, currentHint.groups[i].index, row, col, getBoxIndexFromXY(col, row))) {
         return true;
       }
     }
   }
   return false;
 }