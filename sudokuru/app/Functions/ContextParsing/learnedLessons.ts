
export const formatLessonNameArray = (learnedLessons: any) => {
  if (!learnedLessons) return "Loading...";
  let formattedLessonArray = [];
  for (let i = 0; i < learnedLessons.length; i++)
  {
    formattedLessonArray.push(formatOneLessonName(learnedLessons[i]));
  }
  return formattedLessonArray.join('\r\n');
}

export const formatOneLessonName = (lessonName: string) => {
  const words = lessonName.toLowerCase().replaceAll('_', ' ').split(" ");
  for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  return words.join(" ");
}

export const getOneLessonPartialName = (lessonName: string, wordIndex: number) => {
  const words = lessonName.toLowerCase().replaceAll('_', ' ').split(" ");
  words[wordIndex] = words[wordIndex][0].toUpperCase() + words[wordIndex].substr(1);
  return words[wordIndex];
}