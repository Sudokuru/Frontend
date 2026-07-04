import { expect } from "@playwright/test";
import { SudokuBoardComponent } from "../../components/sudoku-board.component";
import { test } from "../../fixture";
import {
  amendNotesDemoCases as amendNotesDemoHintCases,
  AmendNotesDemoCase,
  CellLocation,
  NoteCellWithLocation,
} from "../../../../sudokuru/app/Data/hints/demo_amend_notes_hints";
import {
  HINT_NOT_HIGHLIGHTED_COLOR_RGB,
  HINT_SELECTED_COLOR_RGB,
  NOT_HIGHLIGHTED_COLOR_RGB,
  NOT_SELECTED_CONFLICT_COLOR_RGB,
  PLACE_NOTE_TEXT_COLOR_RGB,
  REMOVE_NOTE_TEXT_COLOR_RGB,
} from "../../../../sudokuru/app/Styling/HighlightColors";

const getAmendNotesDemoCase = (
  id: AmendNotesDemoCase["id"],
): AmendNotesDemoCase => {
  const demoCase = amendNotesDemoHintCases.find(
    (candidate) => candidate.id === id,
  );
  if (!demoCase) {
    throw new Error(`Could not find amend notes demo case ${id}`);
  }
  return demoCase;
};

const getStageText = (demoCase: AmendNotesDemoCase, stageIndex: number) => {
  const text = demoCase.hint.stages[stageIndex]?.text;
  if (!text) {
    throw new Error(
      `Could not find stage ${stageIndex + 1} text for ${demoCase.id}`,
    );
  }
  return text;
};

const getTargetCell = (demoCase: AmendNotesDemoCase): NoteCellWithLocation => {
  const targetCell = demoCase.hint.stages.flatMap(
    (stage) => stage.placeNotes ?? stage.removeNotes ?? [],
  )[0];
  if (!targetCell) {
    throw new Error(`Could not find target cell for ${demoCase.id}`);
  }
  return targetCell;
};

const getInitialTargetNotesText = (
  demoCase: AmendNotesDemoCase,
  targetCell: CellLocation,
) => {
  const initialCell = demoCase.puzzle[targetCell.r][targetCell.c];
  if (initialCell.type !== "note") {
    throw new Error(`Target cell for ${demoCase.id} is not a note cell`);
  }
  return initialCell.notes.join("");
};

const getCellNotesText = (cell: NoteCellWithLocation) => cell.notes.join("");

const getStageTargetNotesText = (
  demoCase: AmendNotesDemoCase,
  stageIndex: number,
) => {
  const targetCell = getTargetCell(demoCase);
  const notesToPlace = demoCase.hint.stages[stageIndex]?.placeNotes?.find(
    (cell) => cell.r === targetCell.r && cell.c === targetCell.c,
  );
  if (notesToPlace) {
    return getCellNotesText(notesToPlace);
  }

  const notesRemovedThroughStage = demoCase.hint.stages
    .slice(0, stageIndex + 1)
    .flatMap((stage) => stage.removeNotes ?? [])
    .filter((cell) => cell.r === targetCell.r && cell.c === targetCell.c)
    .flatMap((cell) => cell.notes);

  const firstPlacement = demoCase.hint.stages
    .flatMap((stage) => stage.placeNotes ?? [])
    .find((cell) => cell.r === targetCell.r && cell.c === targetCell.c);

  if (!firstPlacement) {
    throw new Error(`Could not find placed notes for ${demoCase.id}`);
  }

  return firstPlacement.notes
    .filter((note) => !notesRemovedThroughStage.includes(note))
    .join("");
};

const sameCell = (first: CellLocation, second: CellLocation) =>
  first.r === second.r && first.c === second.c;

const getStageHighlights = (
  demoCase: AmendNotesDemoCase,
  stageIndex: number,
) => {
  const stage = demoCase.hint.stages[stageIndex];
  const stageHighlights = [
    ...(stage.highlightCells ?? []),
    ...(stage.highlightValues ?? []),
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

const verifyAmendNotesStageHighlights = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: AmendNotesDemoCase,
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

const verifyHighlightedNoteColors = async (
  sudokuBoard: SudokuBoardComponent,
  demoCase: AmendNotesDemoCase,
  stageIndex: number,
  visibleNotes: string,
) => {
  for (const note of demoCase.hint.stages[stageIndex]?.highlightNotes ?? []) {
    if (!visibleNotes.includes(note.value.toString())) {
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

const amendNotesDemoCases = [
  {
    label: "Amend Notes Basic",
    cardTestId: "AmendNotesBasic",
    difficulty: "amend-notes-basic",
    demoCase: getAmendNotesDemoCase("basic-amend-notes"),
  },
  {
    label: "Amend Notes Corrective",
    cardTestId: "AmendNotesCorrective",
    difficulty: "amend-notes-corrective",
    demoCase: getAmendNotesDemoCase("corrective-amend-notes"),
  },
].map((demoCase) => ({
  ...demoCase,
  targetCell: getTargetCell(demoCase.demoCase),
  stageTexts: demoCase.demoCase.hint.stages.map((_, index) =>
    getStageText(demoCase.demoCase, index),
  ),
}));

test.describe("amend notes demo hints", () => {
  for (const demoCase of amendNotesDemoCases) {
    test(`displays the ${demoCase.difficulty} hint all the way through`, async ({
      play,
    }) => {
      await play.getByTestId(demoCase.cardTestId).scrollIntoViewIfNeeded();
      await play.getByText(demoCase.label, { exact: true }).click();

      const sudokuBoard = new SudokuBoardComponent(play);
      await sudokuBoard.sudokuBoardIsRendered();
      await expect(
        play.getByText(`Difficulty: ${demoCase.difficulty}`),
      ).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellHasContent(
        demoCase.targetCell.r,
        demoCase.targetCell.c,
        getInitialTargetNotesText(demoCase.demoCase, demoCase.targetCell),
        "notes",
      );

      await sudokuBoard.hint.click();
      await sudokuBoard.sudokuBoardContainsText("Amend Notes");
      await sudokuBoard.sudokuBoardContainsText(demoCase.stageTexts[0]);

      for (
        let stageIndex = 1;
        stageIndex < demoCase.stageTexts.length;
        stageIndex++
      ) {
        await sudokuBoard.hintArrowRight.click();
        await sudokuBoard.sudokuBoardContainsText(
          demoCase.stageTexts[stageIndex],
        );
        await verifyAmendNotesStageHighlights(
          sudokuBoard,
          demoCase.demoCase,
          stageIndex,
        );
        await sudokuBoard.cellHasContent(
          demoCase.targetCell.r,
          demoCase.targetCell.c,
          getStageTargetNotesText(demoCase.demoCase, stageIndex),
          "notes",
        );
        await verifyHighlightedNoteColors(
          sudokuBoard,
          demoCase.demoCase,
          stageIndex,
          getStageTargetNotesText(demoCase.demoCase, stageIndex),
        );
      }

      await sudokuBoard.hintArrowLeft.click();
      await sudokuBoard.cellHasContent(
        demoCase.targetCell.r,
        demoCase.targetCell.c,
        getStageTargetNotesText(demoCase.demoCase, 2),
        "notes",
      );

      await sudokuBoard.hintArrowLeft.click();
      await sudokuBoard.cellHasContent(
        demoCase.targetCell.r,
        demoCase.targetCell.c,
        getStageTargetNotesText(demoCase.demoCase, 1),
        "notes",
      );

      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.hintArrowRight.click();
      await sudokuBoard.hintFinish.click();
      await expect(sudokuBoard.hint).toBeInViewport({ ratio: 1 });
      await sudokuBoard.cellHasContent(
        demoCase.targetCell.r,
        demoCase.targetCell.c,
        getStageTargetNotesText(demoCase.demoCase, 3),
        "notes",
      );
    });
  }
});
