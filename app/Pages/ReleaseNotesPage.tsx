import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import Markdown from "react-native-markdown-display";
import { useTheme } from "react-native-paper";

import json from "../../Changelog.json";

const ReleaseNotesPage = () => {
  console.log(json);

  const copy = `- Render this 
     - render that
     - render hat

     **bold**

     - banana

     **bold** tow haha
    `;
  const MarkdownWrapper: React.FC<any> = ({ children }) => {
    const { colors } = useTheme();
    return (
      <Markdown style={{ text: { color: colors.onBackground } }}>
        {children}
      </Markdown>
    );
  };

  return (
    <ScrollView>
      <MarkdownWrapper>{copy}</MarkdownWrapper>
    </ScrollView>
  );
};

export default ReleaseNotesPage;
