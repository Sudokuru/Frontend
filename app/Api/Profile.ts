import { profile } from "./Puzzle.Types";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { SUDOKU_STRATEGY_ARRAY } from "sudokuru";

type profileValue =
  | "theme"
  | "highlightBox"
  | "highlightColumn"
  | "highlightIdenticalValues"
  | "highlightRow"
  | "previewMode"
  | "strategyHintOrder";
export class Profile {
  public static async getProfile(): Promise<profile> {
    const value = await getKeyJSON("profile");
    if (value == null) {
      const profile: profile = {
        theme: true,
        highlightBox: true,
        highlightColumn: true,
        highlightIdenticalValues: true,
        highlightRow: true,
        previewMode: false,
        strategyHintOrder: SUDOKU_STRATEGY_ARRAY,
      };
      await this.setProfile(profile);
      return profile;
    }
    // handle initialization if some data is present but not other data
    if (!value.theme) {
      value.theme = true;
    }
    if (!value.highlightBox) {
      value.highlightBox = true;
    }
    if (!value.highlightColumn) {
      value.highlightColumn = true;
    }
    if (!value.highlightRow) {
      value.highlightRow = true;
    }
    if (!value.highlightIdenticalValues) {
      value.highlightIdenticalValues = true;
    }
    if (!value.previewMode) {
      value.previewMode = false;
    }
    if (!value.strategyHintOrder) {
      value.strategyHintOrder = SUDOKU_STRATEGY_ARRAY;
    }
    return value;
  }

  public static async setProfile(profile: profile) {
    storeData("profile", JSON.stringify(profile));
  }

  public static async setProfileValue(
    profileValue: profileValue,
    newValue?: any
  ) {
    let value: profile = await this.getProfile();
    switch (profileValue) {
      case "theme":
        value.theme = !value.theme;
        break;
      case "highlightBox":
        value.highlightBox = !value.highlightBox;
        break;
      case "highlightColumn":
        value.highlightColumn = !value.highlightColumn;
        break;
      case "highlightIdenticalValues":
        value.highlightIdenticalValues = !value.highlightIdenticalValues;
        break;
      case "highlightRow":
        value.highlightRow = !value.highlightRow;
        break;
      case "previewMode":
        value.previewMode = !value.previewMode;
        break;
      case "strategyHintOrder":
        value.strategyHintOrder = newValue;
        break;
    }
    this.setProfile(value);
  }
}
