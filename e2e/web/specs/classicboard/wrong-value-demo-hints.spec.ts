import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  wrongValueDemoCases as wrongValueDemoHintCases,
  WrongValueDemoCase,
} from "../../../../sudokuru/app/Data/hints/demo_wrong_value_hints";

const getWrongValueDemoCase = (
  id: WrongValueDemoCase["id"],
): WrongValueDemoCase => {
  const demoCase = wrongValueDemoHintCases.find(
    (candidate) => candidate.id === id,
  );
  if (!demoCase) {
    throw new Error(`Could not find wrong value demo case ${id}`);
  }
  return demoCase;
};

const getStageText = (demoCase: WrongValueDemoCase, stageIndex: number) => {
  const text = demoCase.hint.stages[stageIndex]?.text;
  if (!text) {
    throw new Error(
      `Could not find stage ${stageIndex + 1} text for ${demoCase.id}`,
    );
  }
  return text;
};

const getWrongCell = (demoCase: WrongValueDemoCase) => {
  const wrongValue = demoCase.hint.stages.flatMap(
    (stage) => stage.removeValues ?? [],
  )[0];
  if (!wrongValue) {
    throw new Error(`Could not find removable value for ${demoCase.id}`);
  }
  return {
    row: wrongValue.r,
    column: wrongValue.c,
    value: wrongValue.value.toString(),
  };
};

const wrongValueDemoCases = [
  {
    cardTestId: "WrongValueDirectConflict",
    difficulty: "wrong-value-direct-conflict",
    demoCase: getWrongValueDemoCase("direct-row-conflict"),
  },
  {
    cardTestId: "WrongValueNoDirectConflict",
    difficulty: "wrong-value-no-direct-conflict",
    demoCase: getWrongValueDemoCase("no-direct-conflict"),
  },
].map((demoCase) => ({
  ...demoCase,
  wrongCell: getWrongCell(demoCase.demoCase),
  firstStage: getStageText(demoCase.demoCase, 0),
  secondStage: getStageText(demoCase.demoCase, 1),
}));

test.describe("wrong value demo hints", () => {
  for (const demoCase of wrongValueDemoCases) {
    test(`displays the ${demoCase.difficulty} hint all the way through`, async ({
      play,
    }) => {
      await play.getByTestId(demoCase.cardTestId).click();

      const sudokuBoard = new SudokuBoardComponent(play);
      await sudokuBoard.sudokuBoardIsRendered();
      await expect(
        play.getByText(`Difficulty: ${demoCase.difficulty}`),
      ).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellHasValue(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
        demoCase.wrongCell.value,
      );

      await sudokuBoard.hint.click();
      await sudokuBoard.sudokuBoardContainsText("Wrong Value");
      await sudokuBoard.sudokuBoardContainsText(demoCase.firstStage);

      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.sudokuBoardContainsText(demoCase.secondStage);
      await sudokuBoard.cellIsEmpty(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
      );

      await sudokuBoard.hintFinish.click();
      await expect(sudokuBoard.hint).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellIsEmpty(
        demoCase.wrongCell.row,
        demoCase.wrongCell.column,
      );
    });
  }
});
