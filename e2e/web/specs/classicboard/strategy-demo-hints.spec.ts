import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  DemoHintCell,
  DemoHintCellLocation,
  DemoHintStage,
  StrategyDemoCase,
  strategyDemoDefinitions,
} from "../../../../sudokuru/app/Data/hints/demo_strategy_hints";
import { toTitle } from "../../../../sudokuru/app/Functions/Utils";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  PLACEMENT_COLOR_RGB,
  PLACE_NOTE_TEXT_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

type ExpectedBoard = DemoHintCell[][];

const cloneBoard = (board: ExpectedBoard): ExpectedBoard =>
  board.map((row) =>
    row.map((cell) =>
      cell.type === "note"
        ? { type: "note", notes: [...cell.notes] }
        : { type: cell.type, value: cell.value },
    ),
  );

const setCell = (
  board: ExpectedBoard,
  location: DemoHintCellLocation,
  cell: DemoHintCell,
) => {
  board[location.r][location.c] =
    cell.type === "note"
      ? { type: "note", notes: [...cell.notes] }
      : { type: cell.type, value: cell.value };
};

const applyStageEntryActions = (board: ExpectedBoard, stage: DemoHintStage) => {
  for (const cell of stage.removeValues ?? []) {
    setCell(board, cell, { type: "value", value: 0 });
  }
  for (const cell of stage.placeValues ?? []) {
    setCell(board, cell, { type: cell.type, value: cell.value });
  }
  for (const cell of stage.placeNotes ?? []) {
    setCell(board, cell, { type: "note", notes: cell.notes });
  }
};

const applyStageExitActions = (board: ExpectedBoard, stage: DemoHintStage) => {
  for (const cell of stage.removeNotes ?? []) {
    const currentCell = board[cell.r][cell.c];
    const currentNotes = currentCell.type === "note" ? currentCell.notes : [];
    setCell(board, cell, {
      type: "note",
      notes: currentNotes.filter((note) => !cell.notes.includes(note)),
    });
  }
};

const stageHasEntryActions = (stage: DemoHintStage) =>
  Boolean(
    stage.removeValues?.length ||
      stage.placeValues?.length ||
      stage.placeNotes?.length,
  );

const stageHasExitActions = (stage: DemoHintStage) =>
  Boolean(stage.removeNotes?.length);

const getCellTestID = (cell: DemoHintCell, r: number, c: number): string => {
  if (cell.type === "note") {
    return `cellr${r}c${c}notes:${[...cell.notes]
      .sort((a, b) => a - b)
      .join("")}`;
  }
  return `cellr${r}c${c}value:${cell.value}`;
};

const verifyBoard = async (
  sudokuBoard: SudokuBoardComponent,
  expectedBoard: ExpectedBoard,
) => {
  const expectedTestIDs = expectedBoard
    .flatMap((row, r) => row.map((cell, c) => getCellTestID(cell, r, c)))
    .sort();
  const cellLocators = sudokuBoard.sudokuBoard.locator(
    '[data-testid^="cellr"]',
  );
  await expect(cellLocators).toHaveCount(81);
  const actualTestIDs = (
    await cellLocators.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-testid")),
    )
  )
    .filter((testID): testID is string => testID !== null)
    .sort();

  expect(actualTestIDs).toEqual(expectedTestIDs);
};

const sameCell = (first: DemoHintCellLocation, second: DemoHintCellLocation) =>
  first.r === second.r && first.c === second.c;

const getOutsideHighlightCell = (
  highlightedCells: DemoHintCellLocation[],
): DemoHintCellLocation => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!highlightedCells.some((cell) => sameCell(cell, { r, c }))) {
        return { r, c };
      }
    }
  }
  throw new Error("Could not find a cell outside the highlighted region");
};

const getCellHighlightColor = (
  stage: DemoHintStage,
  location: DemoHintCellLocation,
) => {
  const highlights = [
    ...(stage.highlightCells ?? []),
    ...(stage.highlightValues ?? []),
  ].filter((highlight) => sameCell(highlight.location, location));

  if (highlights.some((highlight) => highlight.highlightType === "removal")) {
    return NOT_SELECTED_CONFLICT_COLOR_RGB;
  }
  if (highlights.some((highlight) => highlight.highlightType === "placement")) {
    return PLACEMENT_COLOR_RGB;
  }
  if (highlights.some((highlight) => highlight.highlightType === "basis")) {
    return HINT_SELECTED_COLOR_RGB;
  }
  return NOT_HIGHLIGHTED_COLOR_RGB;
};

const verifyStageHighlights = async (
  sudokuBoard: SudokuBoardComponent,
  stage: DemoHintStage,
  expectedBoard: ExpectedBoard,
) => {
  const highlightedCells = [
    ...(stage.highlightCells ?? []),
    ...(stage.highlightValues ?? []),
  ]
    .map((highlight) => highlight.location)
    .filter(
      (location, index, locations) =>
        locations.findIndex((candidate) => sameCell(candidate, location)) ===
        index,
    );

  for (const cell of highlightedCells) {
    await sudokuBoard.cellHasColor(
      cell.r,
      cell.c,
      getCellHighlightColor(stage, cell),
    );
  }

  const outsideCell = getOutsideHighlightCell(highlightedCells);
  await sudokuBoard.cellHasColor(
    outsideCell.r,
    outsideCell.c,
    HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  );

  for (const note of stage.highlightNotes ?? []) {
    const cell = expectedBoard[note.location.r][note.location.c];
    if (cell.type !== "note" || !cell.notes.includes(note.value)) {
      continue;
    }
    await sudokuBoard.cellNoteHasColor(
      note.location.r,
      note.location.c,
      note.value,
      note.highlightType === "placement"
        ? PLACE_NOTE_TEXT_COLOR_RGB
        : REMOVE_NOTE_TEXT_COLOR_RGB,
    );
  }
};

const getStageText = (demoCase: StrategyDemoCase, stageIndex: number) => {
  const text = demoCase.hint.stages[stageIndex]?.text;
  if (!text) {
    throw new Error(
      `Could not find stage ${stageIndex + 1} text for ${demoCase.id}`,
    );
  }
  return text;
};

test.describe("strategy demo hints", () => {
  for (const definition of strategyDemoDefinitions) {
    test(`displays and applies the ${definition.difficulty} hint`, async ({
      play,
    }) => {
      const { demoCase } = definition;
      let expectedBoard = cloneBoard(demoCase.puzzle);

      await play.getByTestId(definition.testID).scrollIntoViewIfNeeded();
      await play.getByText(demoCase.label, { exact: true }).click();

      const sudokuBoard = new SudokuBoardComponent(play);
      await sudokuBoard.sudokuBoardIsRendered();
      await expect(
        play.getByText(`Difficulty: ${definition.difficulty}`),
      ).toBeInViewport({ ratio: 1 });
      await verifyBoard(sudokuBoard, expectedBoard);

      await sudokuBoard.hint.click();
      await sudokuBoard.sudokuBoardContainsText(
        toTitle(demoCase.hint.strategy),
      );
      await sudokuBoard.sudokuBoardContainsText(getStageText(demoCase, 0));
      await verifyStageHighlights(
        sudokuBoard,
        demoCase.hint.stages[0],
        expectedBoard,
      );

      for (
        let stageIndex = 1;
        stageIndex < demoCase.hint.stages.length;
        stageIndex++
      ) {
        const boardBeforeTransition = cloneBoard(expectedBoard);
        const boardAfterTransition = cloneBoard(expectedBoard);
        const previousStage = demoCase.hint.stages[stageIndex - 1];
        const currentStage = demoCase.hint.stages[stageIndex];
        applyStageExitActions(boardAfterTransition, previousStage);
        applyStageEntryActions(boardAfterTransition, currentStage);

        await sudokuBoard.hintArrowRight.click();
        expectedBoard = boardAfterTransition;
        await sudokuBoard.sudokuBoardContainsText(
          getStageText(demoCase, stageIndex),
        );
        await verifyStageHighlights(sudokuBoard, currentStage, expectedBoard);
        await verifyBoard(sudokuBoard, expectedBoard);

        if (
          stageHasExitActions(previousStage) ||
          stageHasEntryActions(currentStage)
        ) {
          await sudokuBoard.hintArrowLeft.click();
          await verifyBoard(sudokuBoard, boardBeforeTransition);

          await sudokuBoard.hintArrowRight.click();
          await verifyBoard(sudokuBoard, boardAfterTransition);
        }
      }

      const finalStage = demoCase.hint.stages[demoCase.hint.stages.length - 1];
      const finalBoard = cloneBoard(expectedBoard);
      applyStageExitActions(finalBoard, finalStage);

      await sudokuBoard.hintFinish.click();
      await expect(sudokuBoard.hint).toBeInViewport({ ratio: 1 });
      await verifyBoard(sudokuBoard, finalBoard);
    });
  }
});
