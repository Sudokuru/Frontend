/**
 * Group class
 */
export default class Group {
  private row: number;
  private col: number;
  private box: number;
  private values: number[];
  private mode: string;

  constructor() {
    this.row = -1;
    this.col = -1;
    this.box = -1;
    this.values = [];
    this.mode = "";
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
   * Sets the values of the group
   * @param values - values of the group
   */
  public setValues(values: number[]): void {
    this.values = values;
  }

  /**
   * Sets the mode of the group
   * @param mode - mode of the group
   */
  public setMode(mode: string): void {
    this.mode = mode;
  }

  /**
   * Returns the row of the group
   */
  public getRow(): number {
    return this.row;
  }

  /**
   * Returns the column of the group
   */
  public getCol(): number {
    return this.col;
  }

  /**
   * Returns the box of the group
   */
  public getBox(): number {
    return this.box;
  }

  /**
   * Returns the legacy SudokuBoard format of the group
   */
  public getGroup(): any {
    const group: any = [];
    if (this.row !== -1) {
      group.push({ type: "row", index: this.row });
    }
    if (this.col !== -1) {
      group.push({ type: "col", index: this.col });
    }
    if (this.box !== -1) {
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

  /**
   * Returns the legacy SudokuBoard format for removals
   */
  public getRemoval(): object {
    return {
      mode: this.mode,
      position: [this.row, this.col],
      values: this.values,
    };
  }

  /**
   * Returns the legacy SudokuBoard format for placements
   */
  public getPlacement(): object {
    return {
      mode: this.mode,
      position: [this.row, this.col],
      value: this.values[0],
    };
  }
}
