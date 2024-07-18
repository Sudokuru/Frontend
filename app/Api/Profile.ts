import { profile } from "./Puzzle.Types";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";

export const returnDefaultPreviewMode = () => {
  if (process.env.EXPO_PUBLIC_ENVIRONMENT === "dev") {
    return true;
  } else {
    return false;
  }
};

type profileValue =
  | "theme"
  | "highlightBox"
  | "highlightColumn"
  | "highlightIdenticalValues"
  | "highlightRow"
  | "previewMode";
export class Profile {
  public static async getProfile(): Promise<profile> {
    let value = await getKeyJSON("profile");
    if (value == null) {
      let profile: profile = {
        theme: true,
        highlightBox: true,
        highlightColumn: true,
        highlightIdenticalValues: true,
        highlightRow: true,
        previewMode: returnDefaultPreviewMode(),
      };
      await this.setProfile(profile);
      return profile;
    }
    return value;
  }

  public static async setProfile(profile: profile) {
    storeData("profile", JSON.stringify(profile));
  }

  public static async setProfileValue(profileValue: profileValue) {
    let value: profile = await this.getProfile();
    if (profileValue === "theme") {
      value.theme = !value.theme;
    } else if (profileValue === "highlightBox") {
      value.highlightBox = !value.highlightBox;
    } else if (profileValue === "highlightColumn") {
      value.highlightColumn = !value.highlightColumn;
    } else if (profileValue === "highlightIdenticalValues") {
      value.highlightIdenticalValues = !value.highlightIdenticalValues;
    } else if (profileValue === "highlightRow") {
      value.highlightRow = !value.highlightRow;
    } else if (profileValue === "previewMode") {
      value.previewMode = !value.previewMode;
    }
    this.setProfile(value);
  }
}
