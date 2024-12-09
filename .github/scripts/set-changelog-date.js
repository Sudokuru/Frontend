import { $ } from "bun";
import { replaceTokens } from '@qetza/replacetokens';
import changelog from "../../sudokuru/Changelog.json";

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const utcDate = new Date().toLocaleString("en-US", { timeZone: 'America/New_York' });
const date = new Date(utcDate);
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = date.getDate();
console.log(utcDate);
const suffix = getDaySuffix(day);
const formattedDate = `${monthNames[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
console.log(formattedDate);

const firstDate = changelog[0].date;
const isFirstDateReplaced = firstDate === "#{date}#";

const vars = { DATE: formattedDate };

const result = await replaceTokens(
  ['**/Changelog.json'],
  (name) => vars[name],
);

if(result.replaced > 1) {
  const errorMessage = "Changelog.json file has multiple dates replaced!";
  await $`echo "::error file=sudokuru/changelog.json,title=INVALID-CHANGELOG::${errorMessage}"`;
  throw new Error(errorMessage);
}

if(!isFirstDateReplaced && result.replaced >= 1) {
  const errorMessage = "Changelog.json file has incorrect #{date}# configuration!";
  await $`echo "::error file=sudokuru/changelog.json,title=INVALID-CHANGELOG::${errorMessage}"`;
  throw new Error(errorMessage);
}