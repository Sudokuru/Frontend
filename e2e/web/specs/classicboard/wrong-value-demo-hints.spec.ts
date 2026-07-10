import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  wrongValueDemoCases as wrongValueDemoHintCases,
  WrongValueDemoCase,
  CellLocation,
} from "../../../../sudokuru/app/Data/hints/demo_wrong_value_hints";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

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

const sameCell = (first: CellLocation, second: CellLocation) =>
  first.r === second.r && first.c === second.c;

const getStageHighlights = (
  demoCase: WrongValueDemoCase,
  stageIndex: number,
) => {
  const stage = demoCase.hint.stages[stageIndex];
  const stageHighlights = [
    ...(stage.highlightCells ?? []),
    ...(stage.highlightValues ?? []),
    ...(stage.highlightNotes ?? []),
  ];
  const removalCells = stageHighlights
    .filter((highlight) => highlight.highlightType === "removal")
    .map((highlight) => highlight.location);
  const selectedCells = stageHighlights
    .filter(
      (highlight) =>
        highlight.highlightType === "basis" ||
        highlight.highlightType === "placement",
    )
    .map((highlight) => highlight.location);
  const focusCells = stageHighlights
    .filter(
      (highlight) =>
        highlight.highlightType === "focus" &&
        !removalCells.some((cell) => sameCell(cell, highlight.location)) &&
        !selectedCells.some((cell) => sameCell(cell, highlight.location)),
    )
    .map((highlight) => highlight.location);

  return { removalCells, selectedCells, focusCells };
};

const getOutsideHighlightCell = (
  removalCells: CellLocation[],
  selectedCells: CellLocation[],
  focusCells: CellLocation[],
): CellLocation => {
  const highlightedCells = [...removalCells, ...selectedCells, ...focusCells];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const candidate = { r, c };
      if (!highlightedCells.some((cell) => sameCell(cell, candidate))) {
        return candidate;
      }
    }
  }

  throw new Error("Could not find a cell outside the highlighted region");
};

const verifyWrongValueStageHighlights = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: WrongValueDemoCase,
  stageIndex: number,
) => {
  const { removalCells, selectedCells, focusCells } = getStageHighlights(
    demoCase,
    stageIndex,
  );

  for (const cell of removalCells) {
    await sudokuBoard.cellHasColor(
      cell.r,
      cell.c,
      NOT_SELECTED_CONFLICT_COLOR_RGB,
    );
  }

  for (const cell of selectedCells) {
    await sudokuBoard.cellHasColor(cell.r, cell.c, HINT_SELECTED_COLOR_RGB);
  }

  for (const cell of focusCells) {
    await sudokuBoard.cellHasColor(cell.r, cell.c, NOT_HIGHLIGHTED_COLOR_RGB);
  }

  const outsideHighlightCell = getOutsideHighlightCell(
    removalCells,
    selectedCells,
    focusCells,
  );
  await sudokuBoard.cellHasColor(
    outsideHighlightCell.r,
    outsideHighlightCell.c,
    HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  );
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
      await verifyWrongValueStageHighlights(sudokuBoard, demoCase.demoCase, 0);

      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.sudokuBoardContainsText(demoCase.secondStage);
      await verifyWrongValueStageHighlights(sudokuBoard, demoCase.demoCase, 1);
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
