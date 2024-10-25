import { test } from "../fixture";
import { AboutUsPage } from "../page/aboutus.page";
import { teamMembers } from "../../../app/Data/members";

test.describe("about us page", () => {
  test("team member cards have text and buttons work", async ({ aboutUs }) => {
    const aboutUsPage = new AboutUsPage(aboutUs);
    for (const member of teamMembers) {
      await aboutUsPage.teamMemberCardIsVisible(member.name);
      await aboutUsPage.teamMemberCardHasText(member.name, member.active);
      if (member.specialty) {
        await aboutUsPage.teamMemberCardHasText(member.name, member.specialty);
      }
      await aboutUsPage.linkButtonWorks(member.name, member.github);
    }
  });

  test("media buttons work", async ({ aboutUs }) => {
    const aboutUsPage = new AboutUsPage(aboutUs);
    await aboutUsPage.mediaButtonsWork();
  });
});
