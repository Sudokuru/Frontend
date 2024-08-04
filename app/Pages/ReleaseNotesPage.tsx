import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import json from "../../Changelog.json";
import {
  ReleaseNoteInterface,
  ReleaseNote,
} from "../Components/ReleaseNotes/ReleaseNote";

const ReleaseNotesPage = () => {
  const releaseNotes: ReleaseNoteInterface[] = json;
  console.log(releaseNotes);

  const content = [];
  for (const releaseNote of releaseNotes) {
    content.push(ReleaseNote(releaseNote, releaseNotes.indexOf(releaseNote)));
  }

  return <ScrollView>{content}</ScrollView>;
};

export default ReleaseNotesPage;
