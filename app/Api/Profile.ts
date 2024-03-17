import { profile } from "./Puzzle.Types";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";

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
      };
      await this.setProfile(profile);
      return profile;
    }
    return value;
  }

  public static async setProfile(profile: profile) {
    storeData("profile", JSON.stringify(profile));
  }

  public static async setProfileValue(profileValue: string) {
    const value: profile = await this.getProfile();
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
    }
    this.setProfile(value);
  }
}
