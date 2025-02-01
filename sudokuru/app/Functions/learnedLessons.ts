/**
 * This function receives a lesson array and returns the formatted lessons seperated by newlines
 */
export const formatLessonNameArray = (learnedLessons: string[]) => {
  if (!learnedLessons) return "Loading...";
  let formattedLessonArray = [];
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
 * This function returns an array of all locked lessons for the user
 */
export const getLockedLessons = (
  learnedLessons: string[],
  avaliableLessons: string[]
): string[] => {
  let unLearnedLessons = arrayDifference(learnedLessons, avaliableLessons);

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
  avaliableLessons: string[]
) => {
  return avaliableLessons.filter((x) => !learnedLessons.includes(x));
};
