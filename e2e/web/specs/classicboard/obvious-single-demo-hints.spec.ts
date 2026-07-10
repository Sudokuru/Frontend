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
  PLACEMENT_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

const placementOnlyCase = getObviousSingleDemoCase("single-obvious-single");
const simplifyingCase = getObviousSingleDemoCase(
  "obvious-single-with-note-simplification",
);

const getStageText = (demoCase: ObviousSingleDemoCase, stageIndex: number) => {
  const text = demoCase.hint.stages[stageIndex]?.text;
  if (!text) {
    throw new Error(
      `Could not find stage ${stageIndex + 1} text for ${demoCase.id}`,
    );
  }
  return text;
};

const getTargetCell = (demoCase: ObviousSingleDemoCase) => {
  const targetCell = demoCase.hint.stages.flatMap(
    (stage) => stage.placeValues ?? [],
  )[0];
  if (!targetCell) {
    throw new Error(`Could not find target cell for ${demoCase.id}`);
  }
  return targetCell;
};

const getInitialNotes = (
  demoCase: ObviousSingleDemoCase,
  location: CellLocation,
) => {
  const initialCell = demoCase.puzzle[location.r][location.c];
  if (initialCell.type !== "note") {
    throw new Error(
      `Cell r${location.r}c${location.c} for ${demoCase.id} is not a note cell`,
    );
  }
  return initialCell.notes;
};

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
  ];

  return {
    removalCells: stageHighlights
      .filter((highlight) => highlight.highlightType === "removal")
      .map((highlight) => highlight.location),
    basisCells: stageHighlights
      .filter((highlight) => highlight.highlightType === "basis")
      .map((highlight) => highlight.location),
    placementCells: stageHighlights
      .filter((highlight) => highlight.highlightType === "placement")
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
  demoCase: ObviousSingleDemoCase,
  stageIndex: number,
) => {
  const { removalCells, basisCells, placementCells, focusCells } =
    getStageHighlights(demoCase, stageIndex);

  for (const cell of removalCells) {
    await sudokuBoard.cellHasColor(
      cell.r,
      cell.c,
      NOT_SELECTED_CONFLICT_COLOR_RGB,
    );
  }

  for (const cell of basisCells) {
    await sudokuBoard.cellHasColor(cell.r, cell.c, HINT_SELECTED_COLOR_RGB);
  }

  for (const cell of placementCells) {
    await sudokuBoard.cellHasColor(cell.r, cell.c, PLACEMENT_COLOR_RGB);
  }

  for (const cell of focusCells) {
    await sudokuBoard.cellHasColor(cell.r, cell.c, NOT_HIGHLIGHTED_COLOR_RGB);
  }

  const outsideHighlightCell = getOutsideHighlightCell(
    removalCells,
    basisCells,
    placementCells,
    focusCells,
  );
  await sudokuBoard.cellHasColor(
    outsideHighlightCell.r,
    outsideHighlightCell.c,
    HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  );
};

const getRemovalCells = (demoCase: ObviousSingleDemoCase) => {
  const removalCells = demoCase.hint.stages.flatMap(
    (stage) => stage.removeNotes ?? [],
  );

  return removalCells.filter(
    (cell, index) =>
      removalCells.findIndex((candidate) => sameCell(candidate, cell)) ===
      index,
  );
};

const getVisibleNotes = (
  demoCase: ObviousSingleDemoCase,
  location: CellLocation,
  stageIndex: number,
) => {
  const removedNotes = demoCase.hint.stages
    .slice(0, stageIndex)
    .flatMap((stage) => stage.removeNotes ?? [])
    .filter((cell) => sameCell(cell, location))
    .flatMap((cell) => cell.notes);

  return getInitialNotes(demoCase, location)
    .filter((note) => !removedNotes.includes(note))
    .join("");
};

const verifyRemovalNotes = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: ObviousSingleDemoCase,
  stageIndex: number,
) => {
  for (const cell of getRemovalCells(demoCase)) {
    await sudokuBoard.cellHasContent(
      cell.r,
      cell.c,
      getVisibleNotes(demoCase, cell, stageIndex),
      "notes",
    );
  }
};

const verifyHighlightedNoteColors = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: ObviousSingleDemoCase,
  stageIndex: number,
) => {
  for (const note of demoCase.hint.stages[stageIndex].highlightNotes ?? []) {
    await sudokuBoard.cellNoteHasColor(
      note.location.r,
      note.location.c,
      note.value,
      REMOVE_NOTE_TEXT_COLOR_RGB,
    );
  }
};

const openDemo = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: ObviousSingleDemoCase,
) => {
  const targetCell = getTargetCell(demoCase);
  await sudokuBoard.cellHasContent(
    targetCell.r,
    targetCell.c,
    getInitialNotes(demoCase, targetCell).join(""),
    "notes",
  );

  await sudokuBoard.hint.click();
  await sudokuBoard.sudokuBoardContainsText("Obvious Single");
  await sudokuBoard.sudokuBoardContainsText(getStageText(demoCase, 0));
  await verifyStageHighlights(sudokuBoard, demoCase, 0);
};

test.describe("obvious single demo hints", () => {
  test("displays and applies the placement-only hint", async ({ play }) => {
    await play.getByTestId("ObviousSingle").scrollIntoViewIfNeeded();
    await play.getByText("Obvious Single", { exact: true }).click();

    const sudokuBoard = new SudokuBoardComponent(play);
    const targetCell = getTargetCell(placementOnlyCase);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(play.getByText("Difficulty: obvious-single")).toBeInViewport({
      ratio: 1,
    });
    await openDemo(sudokuBoard, placementOnlyCase);

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      getStageText(placementOnlyCase, 1),
    );
    await verifyStageHighlights(sudokuBoard, placementOnlyCase, 1);

    await sudokuBoard.hintArrowRight.click();
    await sudokuBoard.sudokuBoardContainsText(
      getStageText(placementOnlyCase, 2),
    );
    await verifyStageHighlights(sudokuBoard, placementOnlyCase, 2);
    await sudokuBoard.cellHasValue(
      targetCell.r,
      targetCell.c,
      targetCell.value.toString(),
    );

    await sudokuBoard.hintArrowLeft.click();
    await sudokuBoard.cellHasContent(
      targetCell.r,
      targetCell.c,
      getInitialNotes(placementOnlyCase, targetCell).join(""),
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

  test("places the value and simplifies its peer notes", async ({ play }) => {
    await play
      .getByTestId("ObviousSingleWithNoteSimplification")
      .scrollIntoViewIfNeeded();
    await play
      .getByText("Obvious Single With Note Simplification", { exact: true })
      .click();

    const sudokuBoard = new SudokuBoardComponent(play);
    const targetCell = getTargetCell(simplifyingCase);
    await sudokuBoard.sudokuBoardIsRendered();
    await expect(
      play.getByText("Difficulty: obvious-single-with-note-simplification"),
    ).toBeInViewport({ ratio: 1 });
    await openDemo(sudokuBoard, simplifyingCase);
    await verifyRemovalNotes(sudokuBoard, simplifyingCase, 0);

    for (
      let stageIndex = 1;
      stageIndex < simplifyingCase.hint.stages.length;
      stageIndex++
    ) {
      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.sudokuBoardContainsText(
        getStageText(simplifyingCase, stageIndex),
      );
      await verifyStageHighlights(sudokuBoard, simplifyingCase, stageIndex);
      await verifyRemovalNotes(sudokuBoard, simplifyingCase, stageIndex);
      await verifyHighlightedNoteColors(
        sudokuBoard,
        simplifyingCase,
        stageIndex,
      );

      if (stageIndex >= 2) {
        await sudokuBoard.cellHasValue(
          targetCell.r,
          targetCell.c,
          targetCell.value.toString(),
        );
      }
    }

    const previousStageIndex = simplifyingCase.hint.stages.length - 2;
    await sudokuBoard.hintArrowLeft.click();
    await verifyRemovalNotes(sudokuBoard, simplifyingCase, previousStageIndex);
    await verifyHighlightedNoteColors(
      sudokuBoard,
      simplifyingCase,
      previousStageIndex,
    );

    await sudokuBoard.hintArrowRight.click();
    await verifyRemovalNotes(
      sudokuBoard,
      simplifyingCase,
      simplifyingCase.hint.stages.length - 1,
    );

    await sudokuBoard.hintFinish.click();
    await expect(sudokuBoard.hint).toBeInViewport({ ratio: 1 });
    await sudokuBoard.cellHasValue(
      targetCell.r,
      targetCell.c,
      targetCell.value.toString(),
    );
    await verifyRemovalNotes(
      sudokuBoard,
      simplifyingCase,
      simplifyingCase.hint.stages.length,
    );
  });
});
