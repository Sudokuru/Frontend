import { test } from "../fixture";
import { AboutUsPage } from "../page/aboutus.page";
import { contributors, teamMembers } from "../../../sudokuru/app/Data/members";

test.describe("about us page", () => {
  test("team member cards have text and buttons work", async ({ aboutUs }) => {
    const aboutUsPage = new AboutUsPage(aboutUs);
    let memberGroups = [teamMembers, contributors];
    for (const memberGroup of memberGroups) {
      for (const member of memberGroup) {
        await aboutUsPage.teamMemberCardIsVisible(member.name);
        if (member.activeSince) {
          await aboutUsPage.teamMemberCardHasText(
            member.name,
            member.activeSince,
          );
        }
        if (member.specialty) {
          await aboutUsPage.teamMemberCardHasText(
            member.name,
            member.specialty,
          );
        }
        await aboutUsPage.linkButtonWorks(member.name, member.github);
      }
    }
  });

  test("media buttons work", async ({ aboutUs }) => {
    const aboutUsPage = new AboutUsPage(aboutUs);
    await aboutUsPage.mediaButtonsWork();
  });
});
