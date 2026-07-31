import type { SudokuStrategy } from "sudokuru";
import { amendNotesPuzzleSolution } from "./demo_amend_notes_hints";
import { boxLineReductionDemoCase } from "./demo_box_line_reduction_hints";
import { hiddenSetDemoCases } from "./demo_hidden_set_hints";
import { obviousSetDemoCases } from "./demo_obvious_set_hints";
import { pointingSetDemoCases } from "./demo_pointing_set_hints";
import { simplifyNotesDemoCase } from "./demo_simplify_notes_hints";
import { swordfishDemoCase } from "./demo_swordfish_hints";
import { xWingDemoCase } from "./demo_x_wing_hints";

export type DemoHintCellLocation = {
  r: number;
  c: number;
};

export type DemoHintValueCell = DemoHintCellLocation & {
  type: "given" | "value";
  value: number;
};

export type DemoHintNoteCell = DemoHintCellLocation & {
  type: "note";
  notes: number[];
};

export type DemoHintCell =
  | Omit<DemoHintValueCell, keyof DemoHintCellLocation>
  | Omit<DemoHintNoteCell, keyof DemoHintCellLocation>;

export type DemoHintHighlightType = "removal" | "placement" | "focus" | "basis";

export const ADVANCED_DEMO_HINT_STRATEGIES = [
  "BOX_LINE_REDUCTION",
  "SWORDFISH",
  "X_WING",
] as const;

export type AdvancedDemoHintStrategy =
  (typeof ADVANCED_DEMO_HINT_STRATEGIES)[number];
export type StrategyDemoHintStrategy =
  | SudokuStrategy
  | AdvancedDemoHintStrategy;

export type DemoHintStage = {
  removeValues?: DemoHintValueCell[];
  removeNotes?: DemoHintNoteCell[];
  placeValues?: DemoHintValueCell[];
  placeNotes?: DemoHintNoteCell[];
  highlightCells?: Array<{
    location: DemoHintCellLocation;
    highlightType: DemoHintHighlightType;
  }>;
  highlightValues?: Array<{
    location: DemoHintCellLocation;
    highlightType: DemoHintHighlightType;
  }>;
  highlightNotes?: Array<{
    location: DemoHintCellLocation;
    value: number;
    highlightType: DemoHintHighlightType;
  }>;
  text?: string;
};

export type StrategyDemoCase = {
  id: string;
  label: string;
  puzzle: DemoHintCell[][];
  solution: number[][];
  hint: {
    strategy: StrategyDemoHintStrategy;
    stages: DemoHintStage[];
  };
};

export type StrategyDemoDefinition<TDifficulty extends string = string> = {
  difficulty: TDifficulty;
  testID: string;
  demoCase: StrategyDemoCase;
};

type FixtureDemoCase = Omit<StrategyDemoCase, "solution">;

const defineStrategyDemo = <TDifficulty extends string>(
  difficulty: TDifficulty,
  testID: string,
  demoCase: FixtureDemoCase,
): StrategyDemoDefinition<TDifficulty> => ({
  difficulty,
  testID,
  demoCase: {
    ...demoCase,
    solution: amendNotesPuzzleSolution,
  },
});

const getFixtureDemoCase = (
  demoCases: readonly FixtureDemoCase[],
  id: string,
): FixtureDemoCase => {
  const demoCase = demoCases.find((candidate) => candidate.id === id);
  if (!demoCase) {
    throw new Error(`Unknown strategy demo case: ${id}`);
  }
  return demoCase;
};

export const strategyDemoDefinitions = [
  defineStrategyDemo(
    "box-line-reduction",
    "BoxLineReduction",
    boxLineReductionDemoCase,
  ),
  defineStrategyDemo(
    "hidden-single",
    "HiddenSingle",
    getFixtureDemoCase(hiddenSetDemoCases, "hidden-single"),
  ),
  defineStrategyDemo(
    "hidden-pair",
    "HiddenPair",
    getFixtureDemoCase(hiddenSetDemoCases, "hidden-pair"),
  ),
  defineStrategyDemo(
    "hidden-triplet",
    "HiddenTriplet",
    getFixtureDemoCase(hiddenSetDemoCases, "hidden-triplet"),
  ),
  defineStrategyDemo(
    "hidden-quadruplet",
    "HiddenQuadruplet",
    getFixtureDemoCase(hiddenSetDemoCases, "hidden-quadruplet"),
  ),
  defineStrategyDemo(
    "obvious-pair",
    "ObviousPair",
    getFixtureDemoCase(obviousSetDemoCases, "obvious-pair"),
  ),
  defineStrategyDemo(
    "obvious-triplet",
    "ObviousTriplet",
    getFixtureDemoCase(obviousSetDemoCases, "obvious-triplet"),
  ),
  defineStrategyDemo(
    "obvious-quadruplet",
    "ObviousQuadruplet",
    getFixtureDemoCase(obviousSetDemoCases, "obvious-quadruplet"),
  ),
  defineStrategyDemo(
    "pointing-pair",
    "PointingPair",
    getFixtureDemoCase(pointingSetDemoCases, "pointing-pair"),
  ),
  defineStrategyDemo(
    "pointing-triplet",
    "PointingTriplet",
    getFixtureDemoCase(pointingSetDemoCases, "pointing-triplet"),
  ),
  defineStrategyDemo("simplify-notes", "SimplifyNotes", simplifyNotesDemoCase),
  defineStrategyDemo("swordfish", "Swordfish", swordfishDemoCase),
  defineStrategyDemo("x-wing", "XWing", xWingDemoCase),
] as const;

export type StrategyDemoDifficulty =
  (typeof strategyDemoDefinitions)[number]["difficulty"];

export const STRATEGY_DEMO_DIFFICULTIES: StrategyDemoDifficulty[] =
  strategyDemoDefinitions.map((definition) => definition.difficulty);

export function isStrategyDemoDifficulty(
  difficulty: string,
): difficulty is StrategyDemoDifficulty {
  return STRATEGY_DEMO_DIFFICULTIES.includes(
    difficulty as StrategyDemoDifficulty,
  );
}

export function getStrategyDemoDefinition(
  difficulty: StrategyDemoDifficulty,
): StrategyDemoDefinition<StrategyDemoDifficulty> {
  const definition = strategyDemoDefinitions.find(
    (candidate) => candidate.difficulty === difficulty,
  );

  if (!definition) {
    throw new Error(`Unknown strategy demo difficulty: ${difficulty}`);
  }

  return definition;
}
