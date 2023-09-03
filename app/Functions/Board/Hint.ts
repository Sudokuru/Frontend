import Group from "./Group";

/**
 * Hint class
 */
export default class Hint {
  private stepCount: number;
  private groups: Group[][];

  /**
   * Creates a hint object
   * @param stepCount - number of steps in the hint
   */
  constructor(stepCount: number) {
    this.stepCount = stepCount;
    this.groups = [];
    for (let i: number = 0; i < stepCount; i++) {
      this.groups.push([]);
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
   * Returns the hint steps using legacy SudokuBoard format
   */
  public getHintSteps(): any[] {
    let hintSteps: any[] = [];
    for (let step: number = 0; step < this.stepCount; step++) {
      hintSteps.push({});
      if (this.groups[step].length > 0) {
        hintSteps[step].groups = [];
        for (let group: number = 0; group < this.groups[step].length; group++) {
          hintSteps[step].groups.push(this.groups[step][group].getGroup());
        }
      }
    }
    return hintSteps;
  }
}
