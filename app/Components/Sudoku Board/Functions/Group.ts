/**
 * Group class
 */
export default class Group {
  private row: number;
  private col: number;
  private box: number;

  constructor() {
    this.row = this.col = this.box = -1;
  }

  /**
   * Sets the row of the group
   * @param row - row of the group
   */
  public setRow(row: number): void {
    this.row = row;
  }

  /**
   * Sets the column of the group
   * @param col - column of the group
   */
  public setCol(col: number): void {
    this.col = col;
  }

  /**
   * Sets the box of the group
   * @param box - box of the group
   */
  public setBox(box: number): void {
    this.box = box;
  }

  /**
   * Returns the legacy SudokuBoard format of the group
   */
  public getGroup(): any {
    let group: any = [];
    if (this.row != -1) {
      group.push({ type: "row", index: this.row });
    }
    if (this.col != -1) {
      group.push({ type: "col", index: this.col });
    }
    if (this.box != -1) {
      group.push({ type: "box", index: this.box });
    }
    return group;
  }

  /**
   * Returns the legacy SudokuBoard format for causes
   */
  public getCause(): number[] {
    return [this.row, this.col];
  }
}
