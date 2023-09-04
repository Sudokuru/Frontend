import Group from "./Group";

/**
 * Hint class
 */
export default class Hint {
  private stepCount: number;
  private groups: Group[][];
  private causes: Group[][];
  private removals: Group[][];

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
      let tempGroup: Group = new Group();
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
   */
  public addRemoval(step: number, position: number[], values: number[]): void {
    let tempGroup: Group = new Group();
    tempGroup.setRow(position[0]);
    tempGroup.setCol(position[1]);
    tempGroup.setValues(values);
    this.removals[step].push(tempGroup);
  }

  /**
   * Returns the hint steps using legacy SudokuBoard format
   */
  public getHintSteps(): any[] {
    let hintSteps: any[] = [];
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
            this.removals[step][removal].getRemoval()
          );
        }
      }
    }
    return hintSteps;
  }
}
