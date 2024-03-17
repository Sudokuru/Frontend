import Group from "./Group";

/**
 * Hint class
 */
export default class Hint {
  private stepCount: number;
  private groups: Group[][];
  private causes: Group[][];
  private removals: Group[][];
  private placement: Group[];

  /**
   * Creates a hint object
   * @param stepCount - number of steps in the hint
   */
  constructor(stepCount: number) {
    this.stepCount = stepCount;
    this.groups = [];
    this.causes = [];
    this.removals = [];
    for (let i: number = 0; i < stepCount; i++) {
      this.groups.push([]);
      this.causes.push([]);
      this.removals.push([]);
    }
    this.placement = [];
  }

  /**
   * Adds a group to the hint
   * @param step - step to add the group to
   * @param group - group to add
   */
  public addGroup(step: number, group: Group): void {
    this.groups[step].push(group);
  }

  /**
   * Adds causes to the hint
   * @param step - step to add the causes to
   * @param causes - causes to add
   */
  public addCauses(step: number, causes: number[][]): void {
    for (let i: number = 0; i < causes.length; i++) {
      const tempGroup: Group = new Group();
      tempGroup.setRow(causes[i][0]);
      tempGroup.setCol(causes[i][1]);
      this.causes[step].push(tempGroup);
    }
  }

  /**
   * Adds a removal to the hint
   * @param step - step to add the removal to
   * @param position - position of the removal
   * @param values - values of the removal
   * @param mode - mode of the removal
   */
  public addRemoval(
    step: number,
    position: number[],
    values: number[],
    mode: string,
  ): void {
    const tempGroup: Group = new Group();
    tempGroup.setRow(position[0]);
    tempGroup.setCol(position[1]);
    tempGroup.setValues(values);
    tempGroup.setMode(mode);
    this.removals[step].push(tempGroup);
  }

  /**
   * Adds a placement to the hint (must be called in order of the steps)
   * @param position - position of the placement
   * @param value - value of the placement
   * @param mode - mode of the placement
   */
  public addPlacement(position: number[], value: number, mode: string): void {
    const tempGroup: Group = new Group();
    tempGroup.setRow(position[0]);
    tempGroup.setCol(position[1]);
    tempGroup.setValues([value]);
    tempGroup.setMode(mode);
    this.placement.push(tempGroup);
  }

  /**
   * Adjusts groups to match pointing set format
   */
  public adjustForPointingSet(): void {
    // Get box involved in pointing set
    const box: number = this.groups[1][0].getBox();
    // Determine if row or column is involved in pointing set
    const row: number = this.groups[0][0].getRow();
    const col: number = this.groups[0][0].getCol();
    const isRow: boolean = row !== -1;
    // Create row or column group
    const temp: Group = new Group();
    if (isRow) {
      temp.setRow(row);
    } else {
      temp.setCol(col);
    }
    // Adjust groups to match pointing set format
    this.groups[0] = [];
    this.groups[0].push(new Group());
    this.groups[0][0].setBox(box);
    this.groups[1] = [];
    this.groups[1].push(temp);
    this.groups[2] = [];
    this.groups[2].push(temp);
    // Adjust removals to match pointing set format
    this.removals[0] = [];
  }

  /**
   * Returns the hint steps using legacy SudokuBoard format
   */
  public getHintSteps(): any[] {
    const hintSteps: any[] = [];
    for (let step: number = 0; step < this.stepCount; step++) {
      hintSteps.push({});
      if (this.groups[step].length > 0) {
        for (let group: number = 0; group < this.groups[step].length; group++) {
          hintSteps[step].groups = this.groups[step][group].getGroup();
        }
      }
      if (this.causes[step].length > 0) {
        hintSteps[step].causes = [];
        for (let cause: number = 0; cause < this.causes[step].length; cause++) {
          hintSteps[step].causes.push(this.causes[step][cause].getCause());
        }
      }
      if (this.removals[step].length > 0) {
        hintSteps[step].removals = [];
        for (
          let removal: number = 0;
          removal < this.removals[step].length;
          removal++
        ) {
          hintSteps[step].removals.push(
            this.removals[step][removal].getRemoval(),
          );
        }
      }
      if (this.placement.length > 0) {
        hintSteps[step].placements = this.placement[step].getPlacement();
      }
    }
    return hintSteps;
  }
}
