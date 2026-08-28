import { z } from "zod";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";

export const HOME_DIFFICULTIES = [
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

export type HomeDifficulty = (typeof HOME_DIFFICULTIES)[number];

export const HOME_DEFAULT_DIFFICULTY: HomeDifficulty = "novice";

const HomeDifficultySchema = z.enum(HOME_DIFFICULTIES);
const HOME_DIFFICULTY_KEY = "home_difficulty";

export const getHomeDifficulty = async (): Promise<HomeDifficulty> =>
  (await getKeyJSON(HOME_DIFFICULTY_KEY, HomeDifficultySchema)) ??
  HOME_DEFAULT_DIFFICULTY;

export const saveHomeDifficulty = async (difficulty: HomeDifficulty) => {
  await storeData(HOME_DIFFICULTY_KEY, JSON.stringify(difficulty));
};
