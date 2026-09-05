import {
  BoardObjectProps,
  CellProps,
} from "../../../../Functions/LocalDatabase";

export const cloneCell = (cell: CellProps): CellProps =>
  cell.type === "note" ? { type: "note", entry: [...cell.entry] } : { ...cell };

export const clonePuzzleState = (puzzleState: CellProps[][]): CellProps[][] =>
  puzzleState.map((row) => row.map(cloneCell));

export const cloneBoard = <T extends BoardObjectProps>(board: T): T => ({
  ...board,
  puzzleState: clonePuzzleState(board.puzzleState),
  actionHistory: board.actionHistory.map((action) =>
    action.map((move) => ({ ...move, cell: cloneCell(move.cell) })),
  ),
  statistics: { ...board.statistics },
});
