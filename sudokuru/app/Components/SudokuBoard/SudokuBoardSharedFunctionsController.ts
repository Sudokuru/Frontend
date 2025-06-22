import { GameVariant, SudokuObjectProps } from "../../Functions/LocalDatabase";
import { doesCellHaveConflict as coreDoesCellHaveConflict } from "./Core/Functions/CellFunctions";
import { doesCellHaveConflict as drillDoesCellHaveConflict } from "./Drill/Functions/CellFunctions";
import { headerRowTitle as coreHeaderRowTitle } from "./Core/Functions/HeaderRowFunctions";
import { headerRowTitle as drillHeaderRowTitle } from "./Drill/Functions/HeaderRowFunctions";

export interface SudokuVariantMethods {
  doesCellHaveConflict(
    sudokuBoard: SudokuObjectProps,
    r: number,
    c: number,
  ): boolean;
  headerRowTitle(sudokuBoard: SudokuObjectProps): string;
}

// 3) Default methods for all variants
const defaultMethods: SudokuVariantMethods = {
  doesCellHaveConflict(sudokuBoard: SudokuObjectProps, r: number, c: number) {
    return coreDoesCellHaveConflict(sudokuBoard, r, c);
  },
  headerRowTitle(sudokuBoard: SudokuObjectProps) {
    return coreHeaderRowTitle(sudokuBoard);
  },
};

// 4) Any per‐variant overrides (only override what you really need)
const overrides: Partial<Record<GameVariant, Partial<SudokuVariantMethods>>> = {
  drill: {
    doesCellHaveConflict(sudokuBoard: SudokuObjectProps, r: number, c: number) {
      return drillDoesCellHaveConflict(sudokuBoard, r, c);
    },
    headerRowTitle(sudokuBoard: SudokuObjectProps) {
      return drillHeaderRowTitle(sudokuBoard);
    },
  },
  // classic has no overrides since classic is the default
  classic: {},
};

// 5) Build the final runtime lookup by merging defaults + overrides
export const boardMethods: { [V in GameVariant]: SudokuVariantMethods } =
  Object.fromEntries(
    (Object.keys(overrides) as GameVariant[]).map((v) => [
      v,
      { ...defaultMethods, ...overrides[v] },
    ]),
  ) as { [V in GameVariant]: SudokuVariantMethods };
