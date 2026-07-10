import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  CellLocation,
  getObviousSingleDemoCase,
  ObviousSingleDemoCase,
} from "../../../../sudokuru/app/Data/hints/demo_obvious_single_hints";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

const demoCase: ObviousSingleDemoCase = getObviousSingleDemoCase(
  "single-obvious-single",
);

const getTargetCell = (demoCase: ObviousSingleDemoCase) => {
  const targetCell = demoCase.hint.stages.flatMap(
    (stage) => stage.placeValues ?? [],
  )[0];
  if (!targetCell) {
    throw new Error(`Could not find target cell for ${demoCase.id}`);
  }
  return targetCell;
};

const targetCell = getTargetCell(demoCase);
const initialTargetCell = demoCase.puzzle[targetCell.r][targetCell.c];

if (initialTargetCell.type !== "note") {
  throw new Error(`Target cell for ${demoCase.id} is not a note cell`);
}

const sameCell = (first: CellLocation, second: CellLocation) =>
  first.r === second.r && first.c === second.c;

const getStageHighlights = (
  demoCase: ObviousSingleDemoCase,
  stageIndex: number,
) => {
  const stage = demoCase.hint.stages[stageIndex];
  const stageHighlights = [
    ...(stage.highlightCells ?? []),
    ...(stage.highlightValues ?? []),
    ...(stage.highlightNotes ?? []),
  ];

  return {
    removalCells: stageHighlights
      .filter((highlight) => highlight.highlightType === "removal")
      .map((highlight) => highlight.location),
    selectedCells: stageHighlights
      .filter(
        (highlight) =>
          highlight.highlightType === "basis" ||
          highlight.highlightType === "placement",
      )
      .map((highlight) => highlight.location),
    focusCells: stageHighlights
      .filter((highlight) => highlight.highlightType === "focus")
      .map((highlight) => highlight.location),
  };
};

const getOutsideHighlightCell = (
  ...highlightGroups: CellLocation[][]
): CellLocation => {
  const highlightedCells = highlightGroups.flat();
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

const verifyStageHighlights = async (
  sudokuBoard: SudokuBoardComponent,
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

test.describe("obvious single demo hints", () => {
  test("displays and applies the obvious-single hint all the way through", async ({
    play,
  }) => {
    await play.getByTestId("ObviousSingle").scrollIntoViewIfNeeded();
    await play.getByText("Obvious Single", { exact: true }).click();

    const sudokuBoard = new SudokuBoardComponent(play);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(play.getByText("Difficulty: obvious-single")).toBeInViewport({
      ratio: 1,
    });
    await sudokuBoard.cellHasContent(
      targetCell.r,
      targetCell.c,
      initialTargetCell.notes.join(""),
      "notes",
    );

    await sudokuBoard.hint.click();
    await sudokuBoard.sudokuBoardContainsText("Obvious Single");
    await sudokuBoard.sudokuBoardContainsText(
      demoCase.hint.stages[0].text as string,
    );
    await verifyStageHighlights(sudokuBoard, 0);

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      demoCase.hint.stages[1].text as string,
    );
    await verifyStageHighlights(sudokuBoard, 1);
    await sudokuBoard.cellHasContent(
      targetCell.r,
      targetCell.c,
      initialTargetCell.notes.join(""),
      "notes",
    );

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      demoCase.hint.stages[2].text as string,
    );
    await verifyStageHighlights(sudokuBoard, 2);
    await sudokuBoard.cellHasValue(
      targetCell.r,
      targetCell.c,
      targetCell.value.toString(),
    );

    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasContent(
      targetCell.r,
      targetCell.c,
      initialTargetCell.notes.join(""),
      "notes",
    );

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.cellHasValue(
      targetCell.r,
      targetCell.c,
      targetCell.value.toString(),
    );

    await sudokuBoard.hintFinish.click();
    await expect(play.getByText("Game Results")).toBeInViewport({ ratio: 1 });
    await expect(play.getByText("Number of Hints Used: 1")).toBeInViewport({
      ratio: 1,
    });
    await expect(play.getByText("Obvious Single: 1")).toBeInViewport({
      ratio: 1,
    });
  });
});
