import { sudokuStrategy } from "sudokuru";

import { puzzle } from "../Api/Puzzle.Types";

/**
 * This function returns a normal Sudoku Game.
 * Temporarily only returning Naked Single Drill games as a POC
 * TODO Return Puzzles based on user difficulty and learned puzzles
 * @returns A puzzle object for the user to play a normal Sudoku Game
 */
export function returnLocalGame(): SudokuObjectProps {
  const game =
    NAKED_SINGLE_DRILL_GAMES[
      Math.floor(Math.random() * NAKED_SINGLE_DRILL_GAMES.length)
    ];
  // Return a clone here so that this is a clone.
  return JSON.parse(JSON.stringify(game));
}

export function returnLocalDrillGame(strategy: sudokuStrategy): puzzle {
  // if (strategy === "NAKED_SINGLE") {
  //   return NAKED_SINGLE_DRILL_GAMES[
  //     Math.floor(Math.random() * NAKED_SINGLE_DRILL_GAMES.length)
  //   ];
  // }
  if (strategy === "NAKED_PAIR") {
    return NAKED_PAIR_DRILL_GAMES[
      Math.floor(Math.random() * NAKED_PAIR_DRILL_GAMES.length)
    ];
  } else if (strategy === "NAKED_TRIPLET") {
    return NAKED_TRIPLET_DRILL_GAMES[
      Math.floor(Math.random() * NAKED_TRIPLET_DRILL_GAMES.length)
    ];
  } else if (strategy === "NAKED_QUADRUPLET") {
    return NAKED_QUADRUPLET_DRILL_GAMES[
      Math.floor(Math.random() * NAKED_QUADRUPLET_DRILL_GAMES.length)
    ];
  } else if (strategy === "HIDDEN_SINGLE") {
    return HIDDEN_SINGLE_DRILL_GAMES[
      Math.floor(Math.random() * HIDDEN_SINGLE_DRILL_GAMES.length)
    ];
  } else if (strategy === "HIDDEN_PAIR") {
    return HIDDEN_PAIR_DRILL_GAMES[
      Math.floor(Math.random() * HIDDEN_PAIR_DRILL_GAMES.length)
    ];
  } else if (strategy === "HIDDEN_TRIPLET") {
    return HIDDEN_TRIPLET_DRILL_GAMES[
      Math.floor(Math.random() * HIDDEN_TRIPLET_DRILL_GAMES.length)
    ];
  } else if (strategy === "HIDDEN_QUADRUPLET") {
    return HIDDEN_QUADRUPLET_DRILL_GAMES[
      Math.floor(Math.random() * HIDDEN_QUADRUPLET_DRILL_GAMES.length)
    ];
  } else if (strategy === "POINTING_PAIR") {
    return POINTING_PAIR_DRILL_GAMES[
      Math.floor(Math.random() * POINTING_PAIR_DRILL_GAMES.length)
    ];
  } else if (strategy === "POINTING_TRIPLET") {
    return POINTING_TRIPLET_DRILL_GAMES[
      Math.floor(Math.random() * POINTING_TRIPLET_DRILL_GAMES.length)
    ];
  }
  return JSON.parse("{}");
}

export interface SudokuObjectProps {
  variant: GameVariant;
  version: string;
  selectedCell: CellLocation | null;
  statistics: GameStatistics;
  puzzle: CellProps[][];
  puzzleSolution: number[][];
  actionHistory: GameAction[];
  inNoteMode: boolean;
}

export interface GameAction {
  cellLocation: CellLocation;
  cell: CellProps;
}

// todo remove erase, and just use 0 value to signify erase
// then can remove ActionType as a type needed
// type ActionType = "note" | "value";

export interface CellLocation {
  r: number;
  c: number;
}

export interface GameStatistics {
  difficulty: GameDifficulty;
  internalDifficulty: number;
  time: number;
  score: number;
  numWrongCellsPlayed: number;
  numHintsUsed: number;
}

export type GameVariant = "demo" | "drill" | "classic";
export type GameDifficulty = "easy" | "medium" | "hard";
export type GameDifficultyScore = 10 | 20 | 30;

export type CellProps = CellWithValue | CellWithNotes;

export interface CellWithValue {
  type: "value" | "given";
  entry: number;
}

export interface CellWithNotes {
  type: "note";
  entry: number[];
}

export type CellType = "note" | "value" | "given";

// This will be exported from Sudokuru package
// interface Hint {
//   hint: {
//     strategy: any;
//     cause: any;
//     groups: any;
//     placements: any;
//     removals: any;
//     info: string;
//     action: string;
//   };
// }

const NAKED_SINGLE_DRILL_GAMES: SudokuObjectProps[] = [
  {
    variant: "classic",
    version: "1.0.0",
    selectedCell: null,
    puzzle: [
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 3,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 4,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 6,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 2,
        },
        {
          type: "given",
          entry: 3,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 1,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 8,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 8,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "given",
          entry: 5,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 6,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 4,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "given",
          entry: 2,
        },
        {
          type: "given",
          entry: 7,
        },
        {
          type: "given",
          entry: 1,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 5,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 9,
        },
        {
          type: "given",
          entry: 5,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
      [
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "given",
          entry: 2,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
        {
          type: "value",
          entry: 0,
        },
      ],
    ],
    puzzleSolution: [
      [1, 2, 3, 6, 7, 5, 9, 4, 8],
      [4, 5, 6, 9, 8, 2, 3, 7, 1],
      [7, 8, 9, 3, 1, 4, 5, 6, 2],
      [9, 6, 4, 1, 5, 7, 2, 8, 3],
      [5, 1, 7, 2, 3, 8, 4, 9, 6],
      [8, 3, 2, 4, 9, 6, 1, 5, 7],
      [2, 7, 1, 8, 4, 9, 6, 3, 5],
      [3, 9, 5, 7, 6, 1, 8, 2, 4],
      [6, 4, 8, 5, 2, 3, 7, 1, 9],
    ],
    statistics: {
      difficulty: "easy",
      internalDifficulty: 0,
      numHintsUsed: 0,
      numWrongCellsPlayed: 0,
      score: 0,
      time: 0,
    },
    inNoteMode: false,
    actionHistory: [],
  },
  // {
  //   puzzle:
  //     "003070040006002301089000000000107080517000006000400000271009005095000000000020000",
  //   puzzleSolution:
  //     "123675948456982371789314562964157283517238496832496157271849635395761824648523719",
  //   moves: [
  //     {
  //       puzzleCurrentState: "",
  //       puzzleCurrentNotesState: "",
  //     },
  //   ],
  //   strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
  //   difficulty: 348,
  //   drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "POINTING_TRIPLET"],
  // },
  // {
  //   puzzle:
  //     "103000900006000001009300024000006040060007813817005002090000430000009080000020000",
  //   puzzleSolution:
  //     "123574968456982371789361524932816745564297813817435692291658437375149286648723159",
  //   moves: [
  //     {
  //       puzzleCurrentState: "",
  //       puzzleCurrentNotesState: "",
  //     },
  //   ],
  //   strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
  //   difficulty: 64,
  //   drillStrategies: ["NAKED_SINGLE", "POINTING_TRIPLET", "HIDDEN_QUADRUPLET"],
  // },
  // {
  //   puzzle:
  //     "020700080050091007709304000000500098004010000290000040008060300000180004900000070",
  //   puzzleSolution:
  //     "123756489456891237789324561317542698864913725295678143578469312632187954941235876",
  //   moves: [
  //     {
  //       puzzleCurrentState: "",
  //       puzzleCurrentNotesState: "",
  //     },
  //   ],
  //   strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
  //   difficulty: 835,
  //   drillStrategies: ["NAKED_SINGLE", "NAKED_QUADRUPLET"],
  // },
  // {
  //   puzzle:
  //     "003000050450000007000100402910600700060042000000000080000010609001800005070009001",
  //   puzzleSolution:
  //     "123476958456928317789135462915683724867542193234791586548217639391864275672359841",
  //   moves: [
  //     {
  //       puzzleCurrentState: "",
  //       puzzleCurrentNotesState: "",
  //     },
  //   ],
  //   strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
  //   difficulty: 112,
  //   drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "POINTING_TRIPLET"],
  // },
  // {
  //   puzzle:
  //     "000560070000000080780000300000470053002000000040600209004800000038005700610090000",
  //   puzzleSolution:
  //     "123568974456739182789214365891472653362951847547683219974826531238145796615397428",
  //   moves: [
  //     {
  //       puzzleCurrentState: "",
  //       puzzleCurrentNotesState: "",
  //     },
  //   ],
  //   strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
  //   difficulty: 802,
  //   drillStrategies: ["NAKED_SINGLE"],
  // }
];

const NAKED_PAIR_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "120000000400009017780500034060000003000065000800070002000000400500900001300080050",
    puzzleSolution:
      "123647895456839217789512634261498573937265148845371962618753429574926381392184756",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 96,
    drillStrategies: [
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "000000800450000001009000004030080900800370000000526040000400070608002010007000506",
    puzzleSolution:
      "123647895456893721789215634532184967864379152971526348315468279698752413247931586",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 622,
    drillStrategies: ["NAKED_PAIR"],
  },
  {
    puzzle:
      "020000008000700900000000010007009100000008056240006000005302000890004030300800560",
    puzzleSolution:
      "123945678456781923789623415567239184931478256248156397675312849892564731314897562",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 291,
    drillStrategies: [
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "023000090000007820009032001530008070800000200600470180005000000318000000000560000",
    puzzleSolution:
      "123845697456197823789632451534218976871956234692473185965381742318724569247569318",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 42,
    drillStrategies: ["NAKED_PAIR"],
  },
  {
    puzzle:
      "100004760400009081000100020097000000500070006032010000000000000000200407371800000",
    puzzleSolution:
      "123584769456729381789163524697352148514978236832416975245697813968231457371845692",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 453,
    drillStrategies: ["NAKED_PAIR"],
  },
];

const NAKED_TRIPLET_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "020400000006009130000015200000080000300000500800064700014702805000001090000000000",
    puzzleSolution:
      "123476958456829137789315246247583619361297584895164723914732865578641392632958471",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 2,
    drillStrategies: ["POINTING_PAIR", "NAKED_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "100060500006780300709020406200040005090000021000007030002000800640070000900400000",
    puzzleSolution:
      "123964578456781392789523416237149685594836721861257934312695847648372159975418263",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "POINTING_PAIR",
    ],
    difficulty: 24,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "120040905056900000000000030000001040000000106008000020042070000000002060305094082",
    puzzleSolution:
      "123648975456937218789215634637521849294783156518469327842376591971852463365194782",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
    ],
    difficulty: 1000,
    drillStrategies: ["POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "100000000050090003089250100060008901800000000000900064600019405010500000200300000",
    puzzleSolution:
      "123864597456197283789253146562438971894671352371925864638719425917542638245386719",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 323,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "120400000000000300080100060000001090560802430900000000007600080600018900000750100",
    puzzleSolution:
      "123486759456927318789135264274361895561892437938574621317649582645218973892753146",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
      "HIDDEN_TRIPLET",
    ],
    difficulty: 507,
    drillStrategies: ["NAKED_SINGLE", "NAKED_TRIPLET"],
  },
];

const NAKED_QUADRUPLET_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "020700080050091007709304000000500098004010000290000040008060300000180004900000070",
    puzzleSolution:
      "123756489456891237789324561317542698864913725295678143578469312632187954941235876",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 835,
    drillStrategies: ["NAKED_SINGLE", "NAKED_QUADRUPLET"],
  },
  {
    puzzle:
      "120000000400009017780500034060000003000065000800070002000000400500900001300080050",
    puzzleSolution:
      "123647895456839217789512634261498573937265148845371962618753429574926381392184756",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 96,
    drillStrategies: [
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "020000008000700900000000010007009100000008056240006000005302000890004030300800560",
    puzzleSolution:
      "123945678456781923789623415567239184931478256248156397675312849892564731314897562",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 291,
    drillStrategies: [
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "120000050406000371080000000690100087000000006000709000801007009060000000300914000",
    puzzleSolution:
      "123476958456298371789531642694123587237845196518769423841657239965382714372914865",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 297,
    drillStrategies: ["NAKED_SINGLE", "POINTING_TRIPLET", "NAKED_QUADRUPLET"],
  },
  {
    puzzle:
      "000050700400008020000001400005070600804000030210560000000200006308000090000080050",
    puzzleSolution:
      "123456789456798123789321465935874612864912537217563948541239876378645291692187354",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 475,
    drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "NAKED_QUADRUPLET"],
  },
];

const HIDDEN_SINGLE_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "020000008000700900000000010007009100000008056240006000005302000890004030300800560",
    puzzleSolution:
      "123945678456781923789623415567239184931478256248156397675312849892564731314897562",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 291,
    drillStrategies: [
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "023000600050010703009000000005004008000007240040960000900006050570008000000000407",
    puzzleSolution:
      "123745689456819723789623514265134978391587246847962135914376852572498361638251497",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 422,
    drillStrategies: ["HIDDEN_SINGLE"],
  },
  {
    puzzle:
      "100570000000200300080006004010000000005040020090000030031008706640907800008060000",
    puzzleSolution:
      "123574968456289371789136254317692485865743129294815637531428796642957813978361542",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
    ],
    difficulty: 262,
    drillStrategies: ["HIDDEN_SINGLE", "HIDDEN_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "100045000000080239000000000000000080930400001005076000002010004070300002000004096",
    puzzleSolution:
      "123945678456781239789632145261593487937428561845176923692817354574369812318254796",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR", "HIDDEN_PAIR"],
    difficulty: 562,
    drillStrategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "NAKED_TRIPLET",
    ],
  },
  {
    puzzle:
      "000045000050809032000300000390000068007090000000600090802006100005000004900030050",
    puzzleSolution:
      "123745689456819732789362541394571268267498315518623497842956173635187924971234856",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 441,
    drillStrategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
    ],
  },
];

const HIDDEN_PAIR_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "020609780050000090709050340071008000004000000060020000030001000900007020000000160",
    puzzleSolution:
      "123649785456873291789152346271938654594716832368524917632481579915367428847295163",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 654,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_TRIPLET"],
  },
  {
    puzzle:
      "120000000400009017780500034060000003000065000800070002000000400500900001300080050",
    puzzleSolution:
      "123647895456839217789512634261498573937265148845371962618753429574926381392184756",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 96,
    drillStrategies: [
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "100060500006780300709020406200040005090000021000007030002000800640070000900400000",
    puzzleSolution:
      "123964578456781392789523416237149685594836721861257934312695847648372159975418263",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "POINTING_PAIR",
    ],
    difficulty: 24,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "100000000050090003089250100060008901800000000000900064600019405010500000200300000",
    puzzleSolution:
      "123864597456197283789253146562438971894671352371925864638719425917542638245386719",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 323,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "100007800000300720780000030090070560060005000040830009970023000000000006000180000",
    puzzleSolution:
      "123567894456398721789241635891472563362915487547836219974623158218759346635184972",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
    ],
    difficulty: 939,
    drillStrategies: [
      "NAKED_SINGLE",
      "HIDDEN_PAIR",
      "POINTING_TRIPLET",
      "HIDDEN_QUADRUPLET",
    ],
  },
];

const HIDDEN_TRIPLET_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "120000000400009017780500034060000003000065000800070002000000400500900001300080050",
    puzzleSolution:
      "123647895456839217789512634261498573937265148845371962618753429574926381392184756",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 96,
    drillStrategies: [
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "000068070000930002000000006000109040930004807040000600002000090004306005300001400",
    puzzleSolution:
      "123568974456937182789412536567189243931624857248753619672845391814396725395271468",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 17,
    drillStrategies: ["POINTING_PAIR", "HIDDEN_TRIPLET"],
  },
  {
    puzzle:
      "000047890400300210700500060204036000060000000300900100035000000000008600002000400",
    puzzleSolution:
      "123647895456389217789512364294136578561874923378925146635491782947258631812763459",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 601,
    drillStrategies: ["HIDDEN_TRIPLET", "NAKED_QUADRUPLET"],
  },
  {
    puzzle:
      "120080000050000000080100204001409000030000070900010800000090008000751000500300097",
    puzzleSolution:
      "123584769456927183789136254861479325234865971975213846347692518698751432512348697",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR", "HIDDEN_PAIR"],
    difficulty: 1000,
    drillStrategies: [
      "POINTING_PAIR",
      "NAKED_TRIPLET",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
    ],
  },
  {
    puzzle:
      "020500060450708000000016200500000000001000004090107000900200003800060010035000008",
    puzzleSolution:
      "123594867456728931789316245547639182361852794298147356914285673872463519635971428",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 410,
    drillStrategies: ["POINTING_PAIR", "HIDDEN_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
];

const HIDDEN_QUADRUPLET_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "020400000006009130000015200000080000300000500800064700014702805000001090000000000",
    puzzleSolution:
      "123476958456829137789315246247583619361297584895164723914732865578641392632958471",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 2,
    drillStrategies: ["POINTING_PAIR", "NAKED_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "103000900006000001009300024000006040060007813817005002090000430000009080000020000",
    puzzleSolution:
      "123574968456982371789361524932816745564297813817435692291658437375149286648723159",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 64,
    drillStrategies: ["NAKED_SINGLE", "POINTING_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "023600040006000801700001000200000000530000608090500000000340075010200004000019060",
    puzzleSolution:
      "123685749456972831789431256271864593534197628698523417962348175317256984845719362",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 302,
    drillStrategies: ["HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "000094800400207000080100000800000026000001009500009030030000752010000600000052090",
    puzzleSolution:
      "123594867456287913789136245897345126342861579561729438934618752215973684678452391",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 368,
    drillStrategies: ["HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "000000009406000000780500260018090073000007090500000600002030500000000080060800912",
    puzzleSolution:
      "123486759456729138789513264618295473234167895597348621872931546941652387365874912",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 448,
    drillStrategies: ["HIDDEN_QUADRUPLET"],
  },
];

const POINTING_PAIR_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "003070040006002301089000000000107080517000006000400000271009005095000000000020000",
    puzzleSolution:
      "123675948456982371789314562964157283517238496832496157271849635395761824648523719",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 348,
    drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "POINTING_TRIPLET"],
  },
  {
    puzzle:
      "020400000006009130000015200000080000300000500800064700014702805000001090000000000",
    puzzleSolution:
      "123476958456829137789315246247583619361297584895164723914732865578641392632958471",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 2,
    drillStrategies: ["POINTING_PAIR", "NAKED_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "100060500006780300709020406200040005090000021000007030002000800640070000900400000",
    puzzleSolution:
      "123964578456781392789523416237149685594836721861257934312695847648372159975418263",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "POINTING_PAIR",
    ],
    difficulty: 24,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "120040905056900000000000030000001040000000106008000020042070000000002060305094082",
    puzzleSolution:
      "123648975456937218789215634637521849294783156518469327842376591971852463365194782",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: [
      "NAKED_SINGLE",
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_PAIR",
      "NAKED_TRIPLET",
    ],
    difficulty: 1000,
    drillStrategies: ["POINTING_PAIR", "NAKED_TRIPLET"],
  },
  {
    puzzle:
      "003000050450000007000100402910600700060042000000000080000010609001800005070009001",
    puzzleSolution:
      "123476958456928317789135462915683724867542193234791586548217639391864275672359841",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 112,
    drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "POINTING_TRIPLET"],
  },
];

const POINTING_TRIPLET_DRILL_GAMES: puzzle[] = [
  {
    puzzle:
      "003070040006002301089000000000107080517000006000400000271009005095000000000020000",
    puzzleSolution:
      "123675948456982371789314562964157283517238496832496157271849635395761824648523719",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 348,
    drillStrategies: ["NAKED_SINGLE", "POINTING_PAIR", "POINTING_TRIPLET"],
  },
  {
    puzzle:
      "103000900006000001009300024000006040060007813817005002090000430000009080000020000",
    puzzleSolution:
      "123574968456982371789361524932816745564297813817435692291658437375149286648723159",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 64,
    drillStrategies: ["NAKED_SINGLE", "POINTING_TRIPLET", "HIDDEN_QUADRUPLET"],
  },
  {
    puzzle:
      "020609780050000090709050340071008000004000000060020000030001000900007020000000160",
    puzzleSolution:
      "123649785456873291789152346271938654594716832368524917632481579915367428847295163",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 654,
    drillStrategies: ["HIDDEN_PAIR", "POINTING_TRIPLET"],
  },
  {
    puzzle:
      "120000000400009017780500034060000003000065000800070002000000400500900001300080050",
    puzzleSolution:
      "123647895456839217789512634261498573937265148845371962618753429574926381392184756",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE"],
    difficulty: 96,
    drillStrategies: [
      "NAKED_PAIR",
      "HIDDEN_PAIR",
      "HIDDEN_TRIPLET",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
  {
    puzzle:
      "020000008000700900000000010007009100000008056240006000005302000890004030300800560",
    puzzleSolution:
      "123945678456781923789623415567239184931478256248156397675312849892564731314897562",
    moves: [
      {
        puzzleCurrentState: "",
        puzzleCurrentNotesState: "",
      },
    ],
    strategies: ["NAKED_SINGLE", "HIDDEN_SINGLE", "NAKED_PAIR"],
    difficulty: 291,
    drillStrategies: [
      "HIDDEN_SINGLE",
      "NAKED_PAIR",
      "POINTING_TRIPLET",
      "NAKED_QUADRUPLET",
    ],
  },
];
