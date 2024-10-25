export interface Member {
  name: string;
  github: string;
  activeSince?: string;
  specialty?: string;
}

export const teamMembers: Member[] = [
  {
    name: "Greg",
    github: "https://github.com/Gregory711",
    activeSince: "Founding (Fall 2022)",
    specialty: "Sudoku Solving Algorithms",
  },
  {
    name: "Thomas",
    github: "https://github.com/Thomas-Gallant",
    activeSince: "Founding (Fall 2022)",
    specialty: "Continuous Integration & Deployment",
  },
];

export const contributors: Member[] = [
  {
    name: "Daniel",
    github: "https://github.com/danielcosentino",
  },
  {
    name: "Arthur",
    github: "https://github.com/salmoncore",
  },
  {
    name: "Dahlia",
    github: "https://github.com/DahliaL",
  },
  {
    name: "Min",
    github: "https://github.com/Mink234",
  },
];
