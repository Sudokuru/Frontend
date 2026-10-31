import { z } from "zod";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { GAME_DIFFICULTIES } from "../Functions/GameDifficulties";
import type { GameDifficulty } from "../Functions/GameDifficulties";

export const HOME_DEFAULT_DIFFICULTY: GameDifficulty = "novice";

const HomeDifficultySchema = z.enum(GAME_DIFFICULTIES);
const HOME_DIFFICULTY_KEY = "home_difficulty";

export const getHomeDifficulty = async (): Promise<GameDifficulty> =>
  (await getKeyJSON(HOME_DIFFICULTY_KEY, HomeDifficultySchema)) ??
  HOME_DEFAULT_DIFFICULTY;

export const saveHomeDifficulty = async (difficulty: GameDifficulty) => {
  await storeData(HOME_DIFFICULTY_KEY, JSON.stringify(difficulty));
};
