import { test, expect } from "../fixture";
import { themes } from "../../../sudokuru/app/Styling/theme";

const toRgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

test.describe("theme", () => {
  test("toggle cycles themes and persists", async ({ profile }) => {
    const toggle = profile.getByTestId("ThemeToggle");
    const getTheme = () =>
      profile.evaluate(() => document.documentElement.dataset.theme);

    await expect(await getTheme()).toBe("classic");
    await toggle.click();
    await expect(await getTheme()).toBe("light");
    await toggle.click();
    await expect(await getTheme()).toBe("dark");
    await toggle.click();
    await expect(await getTheme()).toBe("classic");
    await profile.reload();
    await expect(await getTheme()).toBe("classic");
  });

  test("applies token colors", async ({ profile }) => {
    const toggle = profile.getByTestId("ThemeToggle");
    await toggle.click(); // switch to light
    const root = profile.getByTestId("AppRoot");
    await expect(root).toHaveCSS(
      "background-color",
      toRgb(themes.light.colors.bg),
    );
    const title = profile.getByText("Profile");
    await expect(title).toHaveCSS("color", toRgb(themes.light.colors.accent));
  });

  test("focus is visible", async ({ profile }) => {
    const toggle = profile.getByTestId("ThemeToggle");
    await toggle.focus();
    await expect(toggle).toBeFocused();
    const outline = await profile.evaluate(() => {
      const el = document.querySelector(
        '[data-testid="ThemeToggle"]',
      ) as HTMLElement;
      const style = getComputedStyle(el);
      return style.outlineStyle || style.boxShadow;
    });
    expect(outline).not.toBe("none");
  });
});
