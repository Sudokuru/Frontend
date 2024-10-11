interface TeamMember {
  name: string;
  github: string;
  active: string;
  specialty?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Greg",
    github: "https://github.com/Gregory711",
    active: "Founding (Fall 2022) - Present",
    specialty: "Sudoku Solving Algorithms",
  },
  {
    name: "Thomas",
    github: "https://github.com/Thomas-Gallant",
    active: "Founding (Fall 2022) - Present",
    specialty: "Continuous Integration & Deployment",
  },
  {
    name: "Daniel",
    github: "https://github.com/danielcosentino",
    active: "Founding (Fall 2022) - End of Spring 2023",
  },
  {
    name: "Arthur",
    github: "https://github.com/salmoncore",
    active: "Founding (Fall 2022) - End of Spring 2023",
  },
  {
    name: "Dahlia",
    github: "https://github.com/DahliaL",
    active: "Founding (Fall 2022) - End of Spring 2023",
  },
  {
    name: "Min",
    github: "https://github.com/Mink234",
    active: "Founding (Fall 2022) - End of Spring 2023",
  },
];
