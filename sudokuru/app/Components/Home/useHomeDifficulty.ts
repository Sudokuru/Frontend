import React from "react";
import {
  getHomeDifficulty,
  HOME_DEFAULT_DIFFICULTY,
  saveHomeDifficulty,
} from "../../Api/HomePreferences";
import type { HomeDifficulty } from "../../Api/HomePreferences";

export const useHomeDifficulty = () => {
  const [difficulty, setDifficulty] = React.useState<HomeDifficulty>(
    HOME_DEFAULT_DIFFICULTY,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let shouldUpdate = true;
    void getHomeDifficulty().then((storedDifficulty) => {
      if (shouldUpdate) {
        setDifficulty(storedDifficulty);
        setIsLoading(false);
      }
    });
    return () => {
      shouldUpdate = false;
    };
  }, []);

  const updateDifficulty = (nextDifficulty: HomeDifficulty) => {
    setDifficulty(nextDifficulty);
    void saveHomeDifficulty(nextDifficulty);
  };

  return { difficulty, isLoading, updateDifficulty };
};
