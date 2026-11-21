import { SudokuStrategy } from "sudokuru";
import {
  BoardObjectProps,
  ActiveHintState,
  ClassicObjectProps,
  CellProps,
  CellLocation,
  FocusStep,
  PersistedHintPayload,
} from "../../../Functions/LocalDatabase";
import {
  getSudokuHint,
  getApplicableSudokuHints,
} from "../Core/Functions/HintFunctions";
import { buildHintPuzzleState } from "../Core/Functions/HintPreviewFunctions";
import { cloneCell, clonePuzzleState } from "../Core/Functions/CloneFunctions";
import { isCellAHintFocus } from "../Core/Functions/RenderCellFunctions";

export const getFocusStep = (board: BoardObjectProps): FocusStep | undefined =>
  board.focus?.steps.at(-1);

export const cellsEqual = (a: CellProps, b: CellProps): boolean => {
  if (a.type !== b.type) return false;
  if (a.type === "note" && b.type === "note") {
    return (
      a.entry.length === b.entry.length &&
      a.entry.every((n) => b.entry.includes(n))
    );
  }
  return a.entry === b.entry;
};

export const puzzlesEqual = (a: CellProps[][], b: CellProps[][]): boolean =>
  a.every((row, r) => row.every((cell, c) => cellsEqual(cell, b[r][c])));

export const createFocusStep = (
  board: BoardObjectProps,
  hint: PersistedHintPayload,
  target?: CellProps[][],
): FocusStep => {
  const focusHint = { ...hint, simplifyNotesAfterPlacement: true };
  return {
    startActionIndex: board.actionHistory.length,
    hint: focusHint,
    puzzleStateBeforeStep: clonePuzzleState(board.puzzleState),
    targetPuzzleState: target
      ? clonePuzzleState(target)
      : buildHintPuzzleState(board.puzzleState, focusHint, 5),
  };
};

export const createClassicFocusStep = (
  board: ClassicObjectProps,
  strategies: SudokuStrategy[],
  previousStep?: FocusStep,
): FocusStep => {
  const strategyOrder: SudokuStrategy[] = [
    "AMEND_NOTES",
    "SIMPLIFY_NOTES",
    ...strategies,
  ];
  let hint: PersistedHintPayload | undefined;
  if (previousStep) {
    const previousPriority = strategyOrder.indexOf(previousStep.hint.strategy);
    // Preserve the region without overlooking earlier strategies, such as an
    // obvious single exposed by completing a hidden-single elimination.
    const regionStrategies = new Set([
      ...strategyOrder.slice(0, Math.max(0, previousPriority)),
      previousStep.hint.strategy,
    ]);
    for (const strategy of regionStrategies) {
      hint = getHintsInFocusRegion(
        board.puzzleState,
        { ...previousStep.hint, strategy },
        board.puzzleSolution,
      )[0];
      if (hint) break;
    }
  }
  if (!hint) {
    const nextHint = getSudokuHint(
      board.puzzleState,
      strategyOrder,
      board.puzzleSolution,
    );
    hint = previousStep
      ? (getClosestRegionHint(
          getApplicableSudokuHints(
            board.puzzleState,
            [nextHint.strategy],
            board.puzzleSolution,
          ),
          previousStep.hint,
        ) ?? nextHint)
      : nextHint;
  }
  const step = createFocusStep(board, hint);
  return addFocusApplications(step, board.puzzleSolution);
};

const getRegionCells = (hint: PersistedHintPayload): CellLocation[] => {
  const displayHint: Pick<ActiveHintState, "stage" | "hint"> = {
    stage: 3,
    hint,
  };
  const cells: CellLocation[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (isCellAHintFocus(displayHint, r, c)) cells.push({ r, c });
    }
  }
  return cells;
};

/** Overlap takes precedence; average nearest-cell distance breaks ties. */
const getClosestRegionHint = (
  hints: PersistedHintPayload[],
  previous: PersistedHintPayload,
): PersistedHintPayload | undefined => {
  const previousCells = getRegionCells(previous);
  if (previousCells.length === 0) return hints[0];
  const previousKeys = new Set(previousCells.map(({ r, c }) => r * 9 + c));
  const distanceToRegion = (cells: CellLocation[], region: CellLocation[]) =>
    cells.reduce(
      (sum, cell) =>
        sum +
        Math.min(
          ...region.map(
            (other) => Math.abs(cell.r - other.r) + Math.abs(cell.c - other.c),
          ),
        ),
      0,
    );
  let best: PersistedHintPayload | undefined;
  let bestOverlap = -1;
  let bestDistance = Infinity;
  for (const hint of hints) {
    const cells = getRegionCells(hint);
    if (cells.length === 0) continue;
    const overlap = cells.filter(({ r, c }) =>
      previousKeys.has(r * 9 + c),
    ).length;
    const distance =
      (distanceToRegion(cells, previousCells) +
        distanceToRegion(previousCells, cells)) /
      (cells.length + previousCells.length);
    if (
      overlap > bestOverlap ||
      (overlap === bestOverlap && distance < bestDistance)
    ) {
      best = hint;
      bestOverlap = overlap;
      bestDistance = distance;
    }
  }
  return best;
};

/** Find useful applications with all required evidence inside an existing region. */
const getHintsInFocusRegion = (
  puzzle: CellProps[][],
  regionHint: PersistedHintPayload,
  solution: number[][],
): PersistedHintPayload[] => {
  const displayHint: ActiveHintState = {
    stage: 3,
    maxStage: 5,
    hint: regionHint,
    puzzleStateBeforeHint: puzzle,
  };
  const visible = (r: number, c: number) => isCellAHintFocus(displayHint, r, c);
  const groupVisible = (group: number[]) => {
    const groupHint = {
      ...displayHint,
      hint: { ...regionHint, groups: [group] },
    };
    return puzzle.every((row, r) =>
      row.every((_, c) => !isCellAHintFocus(groupHint, r, c) || visible(r, c)),
    );
  };
  return getApplicableSudokuHints(puzzle, [regionHint.strategy], solution)
    .filter((hint) => {
      if (!hint.cause.every(([r, c]) => visible(r, c))) return false;
      // An obvious single needs only its own cell as evidence. Its injected
      // box is a presentation choice, not a prerequisite for the deduction.
      if (hint.strategy === "OBVIOUS_SINGLE") return true;
      const isPointing =
        hint.strategy === "POINTING_PAIR" ||
        hint.strategy === "POINTING_TRIPLET";
      return (
        hint.groups.length === 0 ||
        (isPointing
          ? hint.groups.every(groupVisible)
          : hint.groups.some(groupVisible))
      );
    })
    .map((hint) => ({
      ...hint,
      groups: regionHint.groups,
      placements: hint.placements.filter(([r, c]) => visible(r, c)),
      removals: hint.removals.filter(([r, c]) => visible(r, c)),
    }))
    .filter(
      (hint) =>
        (hint.placements.length > 0 || hint.removals.length > 0) &&
        !puzzlesEqual(puzzle, buildHintPuzzleState(puzzle, hint, 5)),
    );
};

/** Only accept deductions whose evidence is visible in the current focus region. */
const addFocusApplications = (
  step: FocusStep,
  solution: number[][],
): FocusStep => {
  if (step.applications) return step;
  const hints = getHintsInFocusRegion(
    step.puzzleStateBeforeStep,
    step.hint,
    solution,
  );
  // Preserve the original application as well, including on older saved games.
  const uniqueApplications = new Map<
    string,
    { hint: PersistedHintPayload; targetPuzzleState: CellProps[][] }
  >();
  for (const hint of [step.hint, ...hints]) {
    const targetPuzzleState = buildHintPuzzleState(
      step.puzzleStateBeforeStep,
      hint,
      5,
    );
    const key = JSON.stringify(targetPuzzleState);
    if (!uniqueApplications.has(key))
      uniqueApplications.set(key, { hint, targetPuzzleState });
  }
  const applications = [...uniqueApplications.values()];
  const target = clonePuzzleState(step.puzzleStateBeforeStep);
  for (const application of applications) {
    for (const [r, row] of application.targetPuzzleState.entries()) {
      for (const [c, cell] of row.entries()) {
        const before = step.puzzleStateBeforeStep[r][c];
        if (cellsEqual(before, cell)) continue;
        const merged = target[r][c];
        if (
          before.type === "note" &&
          cell.type === "note" &&
          merged.type === "note"
        ) {
          const removed = before.entry.filter((n) => !cell.entry.includes(n));
          const added = cell.entry.filter((n) => !before.entry.includes(n));
          target[r][c] = {
            type: "note",
            entry: [
              ...new Set([
                ...merged.entry.filter((n) => !removed.includes(n)),
                ...added,
              ]),
            ].sort((a, b) => a - b),
          };
        } else target[r][c] = cloneCell(cell);
      }
    }
  }
  return { ...step, applications, targetPuzzleState: target };
};

/** Additional valid eliminations from other applications need not be undone. */
const applicationComplete = (
  board: CellProps[][],
  before: CellProps[][],
  target: CellProps[][],
): boolean =>
  target.every((row, r) =>
    row.every((cell, c) => {
      const initial = before[r][c];
      if (cellsEqual(initial, cell)) return true;
      const current = board[r][c];
      if (
        initial.type === "note" &&
        cell.type === "note" &&
        current.type === "note"
      ) {
        return (
          initial.entry
            .filter((n) => !cell.entry.includes(n))
            .every((n) => !current.entry.includes(n)) &&
          cell.entry
            .filter((n) => !initial.entry.includes(n))
            .every((n) => current.entry.includes(n))
        );
      }
      return cellsEqual(current, cell);
    }),
  );

/** Prefer guidance for an application the player has already started. */
export const getFocusActionHint = (
  board: BoardObjectProps,
): PersistedHintPayload | undefined => {
  const step = getFocusStep(board);
  if (!step) return undefined;
  let best = step.hint;
  let bestProgress = 0;
  for (const application of step.applications ?? []) {
    let progress = 0;
    for (const [r, row] of application.targetPuzzleState.entries()) {
      for (const [c, target] of row.entries()) {
        const before = step.puzzleStateBeforeStep[r][c];
        if (
          !cellsEqual(before, target) &&
          !cellsEqual(before, board.puzzleState[r][c])
        )
          progress++;
      }
    }
    if (progress > bestProgress) {
      best = application.hint;
      bestProgress = progress;
    }
  }
  return best;
};

/** Accept any partial execution of this step, but no changes outside it. */
export const focusCellHasConflict = (
  board: BoardObjectProps,
  r: number,
  c: number,
): boolean => {
  const step = getFocusStep(board);
  if (!step) return false;
  const cell = board.puzzleState[r][c];
  const before = step.puzzleStateBeforeStep[r][c];
  const target = step.targetPuzzleState[r][c];
  if (cellsEqual(cell, before) || cellsEqual(cell, target)) return false;
  if (
    cell.type === "note" &&
    before.type === "note" &&
    target.type === "note"
  ) {
    return (
      cell.entry.some(
        (n) => !before.entry.includes(n) && !target.entry.includes(n),
      ) ||
      target.entry.some(
        (n) => before.entry.includes(n) && !cell.entry.includes(n),
      )
    );
  }
  return true;
};

/** Value placements need value mode; every other step edits notes. */
export const getStepNoteMode = (hint: PersistedHintPayload): boolean =>
  hint.placements.length === 0;

/** Apply the current step's note/value mode when a game starts or resumes. */
export const applyAutoNoteMode = (
  board: BoardObjectProps,
  autoModeSwitch: boolean,
): BoardObjectProps => {
  const step = getFocusStep(board);
  if (!autoModeSwitch || !step) return board;
  return { ...board, inNoteMode: getStepNoteMode(step.hint) };
};

export const updateClassicFocus = (
  board: ClassicObjectProps,
  strategies: SudokuStrategy[],
  autoModeSwitch = false,
): BoardObjectProps => {
  const previousHint = board.focus?.steps.at(-1)?.hint;
  const steps = (board.focus?.steps ?? []).map((step) =>
    addFocusApplications(step, board.puzzleSolution),
  );
  while (
    steps.length > 1 &&
    steps[steps.length - 1].startActionIndex > board.actionHistory.length
  )
    steps.pop();
  const step = steps.at(-1);
  if (!step) steps.push(createClassicFocusStep(board, strategies));
  else if (
    !board.puzzleState.some((row, r) =>
      row.some((_, c) =>
        focusCellHasConflict({ ...board, focus: { steps } }, r, c),
      ),
    ) &&
    (
      step.applications ?? [
        { hint: step.hint, targetPuzzleState: step.targetPuzzleState },
      ]
    ).some((application) =>
      applicationComplete(
        board.puzzleState,
        step.puzzleStateBeforeStep,
        application.targetPuzzleState,
      ),
    )
  ) {
    const solved = board.puzzleState.every((row, r) =>
      row.every(
        (cell, c) =>
          cell.type !== "note" && cell.entry === board.puzzleSolution[r][c],
      ),
    );
    if (!solved) steps.push(createClassicFocusStep(board, strategies, step));
  }
  // Switch the note/value mode only when the active step changes, so a
  // mid-step manual toggle survives until the next step begins.
  const activeStep = steps[steps.length - 1];
  if (autoModeSwitch && activeStep && previousHint !== activeStep.hint) {
    return {
      ...board,
      focus: { steps },
      inNoteMode: getStepNoteMode(activeStep.hint),
    };
  }
  return { ...board, focus: { steps } };
};
