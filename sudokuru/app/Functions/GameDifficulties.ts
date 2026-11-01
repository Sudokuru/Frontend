export const GAME_DIFFICULTIES = [
  "novice",
  "amateur",
  "layman",
  "trainee",
  "protege",
  "professional",
  "pundit",
  "master",
  "grandmaster",
] as const;

export type GameDifficulty = (typeof GAME_DIFFICULTIES)[number];
