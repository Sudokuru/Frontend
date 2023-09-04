import { highlightCauses } from "./HintsParsing";

let testHintObject = {
  causes: [
    [0, 4],
    [0, 6],
    [1, 2],
    [2, 2],
    [2, 0],
    [2, 1],
  ],
  groups: [
    {
      type: "col",
      index: 0,
    },
    {
      type: "row",
      index: 2,
    },
    {
      type: "box",
      index: 0,
    },
  ],
  removals: [
    {
      mode: "delete",
      position: [0, 2],
      values: [2, 3, 5, 6, 8, 9],
    },
  ],
};

let testHintObjectWithoutCauses = {
  groups: [
    {
      type: "col",
      index: 0,
    },
    {
      type: "row",
      index: 2,
    },
    {
      type: "box",
      index: 0,
    },
  ],
  removals: [
    {
      mode: "delete",
      position: [0, 2],
      values: [2, 3, 5, 6, 8, 9],
    },
  ],
};

describe("Determine if cell is a cause", () => {
  it("should return true if current cell is a cause", () => {
    let validCauseOne: boolean = highlightCauses(testHintObject, 4, 0);
    expect(validCauseOne).toBeTruthy();

    let validCauseTwo: boolean = highlightCauses(testHintObject, 6, 0);
    expect(validCauseTwo).toBeTruthy();

    let validCauseThree: boolean = highlightCauses(testHintObject, 2, 1);
    expect(validCauseThree).toBeTruthy();

    let validCauseFour: boolean = highlightCauses(testHintObject, 2, 2);
    expect(validCauseFour).toBeTruthy();

    let validCauseFive: boolean = highlightCauses(testHintObject, 0, 2);
    expect(validCauseFive).toBeTruthy();

    let validCauseSix: boolean = highlightCauses(testHintObject, 1, 2);
    expect(validCauseSix).toBeTruthy();
  });

  it("should return false if current cell is not a cause", () => {
    // test case where row and column are equal and at minimum value
    let invalidCauseOne: boolean = highlightCauses(testHintObject, 0, 0);
    expect(invalidCauseOne).toBeFalsy();

    // test case where row and column are equal and at max value
    let invalidCauseTwo: boolean = highlightCauses(testHintObject, 8, 8);
    expect(invalidCauseTwo).toBeFalsy();

    // test case where column is greater than row
    let invalidCauseThree: boolean = highlightCauses(testHintObject, 1, 6);
    expect(invalidCauseThree).toBeFalsy();

    // Test case where row is greater than column
    let invalidCauseFour: boolean = highlightCauses(testHintObject, 3, 2);
    expect(invalidCauseFour).toBeFalsy();
  });

  it("should return false if row is less than a valid value", () => {
    let invalidCauseOne: boolean = highlightCauses(testHintObject, -1, 0);
    expect(invalidCauseOne).toBeFalsy();
  });

  it("should return false if row is greater than a valid value", () => {
    let invalidCauseOne: boolean = highlightCauses(testHintObject, 9, 0);
    expect(invalidCauseOne).toBeFalsy();
  });

  it("should return false if column is less than a valid value", () => {
    let invalidCauseOne: boolean = highlightCauses(testHintObject, 0, -1);
    expect(invalidCauseOne).toBeFalsy();
  });

  it("should return false if column is greater than a valid value", () => {
    let invalidCauseOne: boolean = highlightCauses(testHintObject, 0, 9);
    expect(invalidCauseOne).toBeFalsy();
  });

  it("should return false if hint object does not contain causes", () => {
    let invalidCauseOne: boolean = highlightCauses(
      testHintObjectWithoutCauses,
      4,
      0
    );
    expect(invalidCauseOne).toBeFalsy();
  });

  it("should return false if hint object is null", () => {
    let invalidCauseOne: boolean = highlightCauses(null, 4, 0);
    expect(invalidCauseOne).toBeFalsy();
  });
});
