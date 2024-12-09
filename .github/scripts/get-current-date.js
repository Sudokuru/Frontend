import { $ } from "bun";

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

const date = new Date(new Date().toLocaleString("en-US", { timeZone: 'America/New_York' }));
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = date.getDate();
console.log(date.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' }));
const suffix = getDaySuffix(day);
const formattedDate = `${monthNames[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
await $`echo "DATE=${formattedDate}" >> $GITHUB_OUTPUT`;
console.log(formattedDate);