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

    const defaultProfileValues: profile = {
      theme: true,
      highlightBox: true,
      highlightColumn: true,
      highlightRow: true,
      highlightIdenticalValues: true,
      previewMode: false,
      strategyHintOrder: SUDOKU_STRATEGY_ARRAY, // Assuming you've implemented the previous suggestion
    };

    if (value == null) {
      await this.setProfile(defaultProfileValues);
      return defaultProfileValues;
    }

    // handle initialization if some data is present but not other data
    // Not having this code caused a crash on mobile (web was ok for some reason)
    // when a user had some but not all profile settings defined in their app storage
    // TODO we will want to conver this scenario with end to end tests in the future
    Object.entries(defaultProfileValues).forEach(([key, defaultValue]) => {
      if (value[key] === undefined) {
        value[key] = defaultValue;
      }
    });
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
