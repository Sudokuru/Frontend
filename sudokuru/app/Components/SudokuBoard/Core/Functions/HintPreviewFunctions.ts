import {
  CellProps,
  PersistedHintPayload,
  ActiveHintState,
} from "../../../../Functions/LocalDatabase";
import { clonePuzzleState } from "./CloneFunctions";
import {
  areCellsInSameBox,
  areCellsInSameColumn,
  areCellsInSameRow,
} from "./CellFunctions";

/** Builds a hint preview without changing its source board. */
export const buildHintPuzzleState = (
  base: CellProps[][],
  hint: PersistedHintPayload,
  stage: ActiveHintState["stage"],
): CellProps[][] => {
  const puzzle = clonePuzzleState(base);
  if (hint.strategy === "AMEND_NOTES" && stage >= 4) {
    const [r, c, ...removals] = hint.removals[0];
    const cell = puzzle[r][c];
    const notes = cell.type === "note" ? cell.entry : [];
    const valid = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => !removals.includes(n),
    );
    const preview = [...new Set([...notes, ...valid])].sort((a, b) => a - b);
    puzzle[r][c] = {
      type: "note",
      entry:
        stage === 4 ? preview : preview.filter((n) => !removals.includes(n)),
    };
    return puzzle;
  }
  if (stage !== 5) return puzzle;
  for (const [r, c, value] of hint.placements) {
    puzzle[r][c] = { type: "value", entry: value };
    if (hint.simplifyNotesAfterPlacement) {
      for (const [row, cells] of puzzle.entries()) {
        for (const [column, cell] of cells.entries()) {
          if (
            cell.type === "note" &&
            (areCellsInSameRow({ r: row, c: column }, { r, c }) ||
              areCellsInSameColumn({ r: row, c: column }, { r, c }) ||
              areCellsInSameBox({ r: row, c: column }, { r, c }))
          ) {
            puzzle[row][column] = {
              type: "note",
              entry: cell.entry.filter((n) => n !== value),
            };
          }
        }
      }
    }
  }
  for (const [r, c, ...removals] of hint.removals) {
    const cell = puzzle[r][c];
    if (cell.type === "note")
      puzzle[r][c] = {
        type: "note",
        entry: cell.entry.filter((n) => !removals.includes(n)),
      };
  }
  return puzzle;
};
