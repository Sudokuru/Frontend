import { Profile } from "./Puzzle.Types";
import { getKeyJSON, storeData } from "../Functions/AsyncStorage";
import { returnSudokuStrategyArray } from "../Contexts/PreferencesContext";
import { ProfileSchema } from "../Functions/LocalDatabase";

type profileValue =
  | "highlightBox"
  | "highlightColumn"
  | "highlightIdenticalValues"
  | "highlightRow"
  | "progressIndicator"
  | "initializeNotes"
  | "simplifyNotes"
  | "previewMode"
  | "strategyHintOrder";

export const getProfile = async (): Promise<Profile> => {
  const value = await getKeyJSON("profile", ProfileSchema);

  // deep clone to avoid manipulation of const value.
  const sudokuStrategyArray = returnSudokuStrategyArray();

  const defaultProfileValues: Profile = {
    version: 1,
    highlightBox: true,
    highlightColumn: true,
    highlightRow: true,
    highlightIdenticalValues: true,
    progressIndicator: true,
    initializeNotes: true,
    simplifyNotes: true,
    previewMode: false,
    strategyHintOrder: sudokuStrategyArray,
  };

  if (value == null) {
    setProfile(defaultProfileValues);
    return defaultProfileValues;
  }

  // handle initialization if some data is present but not other data
  // Not having this code caused a crash on mobile (web was ok for some reason)
  // when a user had some but not all profile settings defined in their app storage
  // TODO we will want to convert this scenario with end to end tests in the future
  Object.entries(defaultProfileValues).forEach(([key, defaultValue]) => {
    if (value[key] === undefined) {
      value[key] = defaultValue;
    }
  });
  return value;
};

export const setProfile = (profile: Profile) => {
  storeData("profile", JSON.stringify(profile));
};

export const setProfileValue = async (
  profileValue: profileValue,
  newValue?: any,
) => {
  let value: Profile = await getProfile();
  switch (profileValue) {
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
    case "progressIndicator":
      value.progressIndicator = !value.progressIndicator;
      break;
    case "initializeNotes":
      value.initializeNotes = !value.initializeNotes;
      break;
    case "simplifyNotes":
      value.simplifyNotes = !value.simplifyNotes;
      break;
    case "previewMode":
      value.previewMode = !value.previewMode;
      break;
    case "strategyHintOrder":
      value.strategyHintOrder = newValue;
      break;
  }
  setProfile(value);
};
