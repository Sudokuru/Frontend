/**
 * Hint class
 */
export default class Hint {
  private stepCount: number;

  /**
   * Creates a hint object
   * @param stepCount - number of steps in the hint
   */
  constructor(stepCount: number) {
    this.stepCount = stepCount;
  }

  /**
   * Returns the hint steps using legacy SudokuBoard format
   */
  public getHintSteps(): any[] {
    let hintSteps: any[] = [];
    for (let step: number = 0; step < this.stepCount; step++) {
      hintSteps.push({});
    }
    return hintSteps;
  }
}
