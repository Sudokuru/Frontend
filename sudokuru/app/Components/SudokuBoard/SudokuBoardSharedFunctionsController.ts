import { GameVariant, SudokuObjectProps } from "../../Functions/LocalDatabase";
import { doesCellHaveConflict as coreDoesCellHaveConflict } from "./Core/Functions/CellFunctions";
import { doesCellHaveConflict as drillDoesCellHaveConflict } from "./Drill/Functions/CellFunctions";

interface MethodSet {
  calculate(): number;
  doesCellHaveConflict(
    sudokuBoard: SudokuObjectProps,
    r: number,
    c: number,
  ): boolean;
}

// 3) Default methods for all variants
const defaultMethods: MethodSet = {
  calculate() {
    console.log(">>> default calculate");
    return 42;
  },
  doesCellHaveConflict(sudokuBoard: SudokuObjectProps, r: number, c: number) {
    return coreDoesCellHaveConflict(sudokuBoard, r, c);
  },
};

// 4) Any per‐variant overrides (only override what you really need)
const overrides: Partial<Record<GameVariant, Partial<MethodSet>>> = {
  drill: {
    // if you omit calculate here, `drill` will get the default
    calculate() {
      console.log(">>> drill calculate");
      return 0;
    },
    doesCellHaveConflict(sudokuBoard: SudokuObjectProps, r: number, c: number) {
      return drillDoesCellHaveConflict(sudokuBoard, r, c);
    },
  },
  // classic has no overrides since classic is the default
  classic: {},
};

// 5) Build the final runtime lookup by merging defaults + overrides
export const boardMethods: { [V in GameVariant]: MethodSet } =
  Object.fromEntries(
    (Object.keys(overrides) as GameVariant[]).map((v) => [
      v,
      { ...defaultMethods, ...overrides[v] },
    ]),
  ) as { [V in GameVariant]: MethodSet };
