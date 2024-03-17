/**
 * This function receives a lesson array and returns the formatted lessons seperated by newlines
 */
export const formatLessonNameArray = (learnedLessons: string[]) => {
  if (!learnedLessons) return "Loading...";
  const formattedLessonArray = [];
  for (let i = 0; i < learnedLessons.length; i++) {
    formattedLessonArray.push(formatOneLessonName(learnedLessons[i]));
  }
  return formattedLessonArray.join("\r\n");
};

/**
 * This function formats and returns a lesson name
 */
export const formatOneLessonName = (lessonName: string) => {
  const words = lessonName.toLowerCase().replaceAll("_", " ").split(" ");
  for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  return words.join(" ");
};

/**
 * This function formats a lesson name and returns the word of the provided index
 */
export const getOneLessonPartialName = (
  lessonName: string,
  wordIndex: number,
) => {
  const words = lessonName.toLowerCase().replaceAll("_", " ").split(" ");
  words[wordIndex] =
    words[wordIndex][0].toUpperCase() + words[wordIndex].substr(1);
  return words[wordIndex];
};

/**
 * This function returns an array of all locked lessons for the user
 */
export const getLockedLessons = (
  learnedLessons: string[],
  avaliableLessons: string[],
): string[] => {
  const unLearnedLessons = arrayDifference(learnedLessons, avaliableLessons);

  // There are no locked lessons if unLearnedLessons has 1 or 0 elements
  if (unLearnedLessons.length <= 1) {
    return [];
  } else {
    unLearnedLessons.shift();
    return unLearnedLessons;
  }
};

/**
 * Returns all elements from avaliableLessons that are not in learnedLessons
 */
// https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
export const arrayDifference = (
  learnedLessons: string[],
  avaliableLessons: string[],
) => {
  return avaliableLessons.filter((x) => !learnedLessons.includes(x));
};

export const convertLessonsToStrategies = (learnedLessons: string[]) => {
  if (learnedLessons.includes("NAKED_SET")) {
    const index = learnedLessons.indexOf("NAKED_SET");
    learnedLessons.splice(index, 1);
    learnedLessons.push("NAKED_PAIR", "NAKED_TRIPLET", "NAKED_QUADRUPLET");
  }

  if (learnedLessons.includes("HIDDEN_SET")) {
    const index = learnedLessons.indexOf("HIDDEN_SET");
    learnedLessons.splice(index, 1);
    learnedLessons.push("HIDDEN_PAIR", "HIDDEN_TRIPLET", "HIDDEN_QUADRUPLET");
  }
  if (learnedLessons.includes("POINTING_SET")) {
    const index = learnedLessons.indexOf("POINTING_SET");
    learnedLessons.splice(index, 1);
    learnedLessons.push("POINTING_PAIR", "POINTING_TRIPLET");
  }
  if (learnedLessons.includes("SUDOKU_101")) {
    const index = learnedLessons.indexOf("SUDOKU_101");
    learnedLessons.splice(index, 1);
  }
  if (learnedLessons.includes("AMEND_NOTES")) {
    const index = learnedLessons.indexOf("AMEND_NOTES");
    learnedLessons.splice(index, 1);
  }
  if (learnedLessons.includes("SIMPLIFY_NOTES")) {
    const index = learnedLessons.indexOf("SIMPLIFY_NOTES");
    learnedLessons.splice(index, 1);
  }
  return learnedLessons;
};
