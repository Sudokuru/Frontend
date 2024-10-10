import { expect } from "@playwright/test";
import { test } from "../fixture";
import { AboutUsPage } from "../page/aboutus.page";

test.describe("about us page", () => {
  test("team member text are in cards", async ({ aboutUs }) => {
    const aboutUsPage = new AboutUsPage(aboutUs);
    for (const teamMember of aboutUsPage.teamMembers) {
      await expect(teamMember.getByText("Active")).toBeInViewport({ ratio: 1 });
    }
  });
});
