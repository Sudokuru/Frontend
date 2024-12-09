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

const firstDate = Object.keys(changelog)[0];
const isFirstDateReplaced = firstDate === "#{date}#";

const vars = { DATE: formattedDate };

const result = await replaceTokens(
  ['**/Changelog.json'],
  (name) => vars[name],
);

if(result.replaced > 1) {
  await $`echo "::error file=sudokuru/changelog.json,title=INVALID-CHANGELOG::Changelog.json file has multiple dates replaced!"`;
  throw new Error('Changelog.json file has multiple dates replaced!');
}

if(!isFirstDateReplaced && result.replaced >= 1) {
  await $`echo "::error file=sudokuru/changelog.json,title=INVALID-CHANGELOG::Changelog.json file has incorrect #{date}# configuration!"`;
  throw new Error('Changelog.json file has incorrect #{date}# configuration!');
}