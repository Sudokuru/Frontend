import { test } from "../fixture";
import { HeaderComponent } from "../components/header.component";
import { StatisticsPage } from "../page/statistics.page";
import { STATISTICS_WITH_HINTS } from "../data";

test.describe("statistics page hints breakdown", () => {
  test.describe("with hints used", () => {
    test.use({ statisticsStorage: STATISTICS_WITH_HINTS });

    test("Hints breakdown is collapsed by default and can be expanded and collapsed", async ({
      page,
    }) => {
      const header = new HeaderComponent(page);
      await header.statistics.click();
      const statistics = new StatisticsPage(page);
      await statistics.statisticsPageIsRendered();

      await statistics.totalHintsUsedIsFullyVisible("5");
      await statistics.expandableHintsChevronIsVisible();
      await statistics.hintsBreakdownIsCollapsed();

      await statistics.expandHintsBreakdown();
      await statistics.statisticIsFullyVisible(
        "hintsUsedSIMPLIFY_NOTES",
        "Simplify Notes: ",
        "3",
      );
      await statistics.statisticIsFullyVisible(
        "hintsUsedOBVIOUS_SINGLE",
        "Obvious Single: ",
        "2",
      );

      await statistics.expandHintsBreakdown();
      await statistics.hintsBreakdownIsCollapsed();
    });
  });

  test.describe("without hints used", () => {
    test("Hints breakdown is not expandable when no hints have been used", async ({
      page,
    }) => {
      const header = new HeaderComponent(page);
      await header.statistics.click();
      const statistics = new StatisticsPage(page);
      await statistics.statisticsPageIsRendered();

      await statistics.totalHintsUsedIsFullyVisible("0");
      await statistics.expandableHintsChevronIsHidden();
      await statistics.expandableHintsRowIsDisabled();

      await statistics.expandableHintsRow.click({ force: true });
      await statistics.hintsBreakdownIsCollapsed();
    });
  });
});
