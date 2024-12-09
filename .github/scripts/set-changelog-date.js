import { $ } from "bun";
import { replaceTokens } from '@qetza/replacetokens';

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

if (process.env.CI) {
  await $`echo "DATE=${formattedDate}" >> $GITHUB_OUTPUT`;
}

console.log(formattedDate);

const vars = { DATE: formattedDate };

const result = await replaceTokens(
  ['**/Changelog.json'],
  (name) => vars[name],
);

if(result.replaced > 1) {
  throw new Error('Changelog.json file has multiple dates replaced!');
}

// todo add some code to verify that only the latest change can have #{date}# set and not any other changes, fail pipeline if that is the case