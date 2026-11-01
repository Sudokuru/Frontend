import React from "react";
import {
  ActivityIndicator,
  Button,
  Checkbox,
  Dialog,
  Portal,
  Text,
} from "react-native-paper";
import { getKeyJSON, storeData } from "../../Functions/AsyncStorage";
import { useNewWindowDimensions } from "../../Functions/WindowDimensions";

const DrillTutorialGate = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = React.useState<"loading" | "tutorial" | "ready">(
    "loading",
  );
  const [checked, setChecked] = React.useState(false);
  const { width } = useNewWindowDimensions();

  React.useEffect(() => {
    let active = true;
    void getKeyJSON("dismissDrillTutorial").then((dismissed) => {
      if (active) setStatus(dismissed === true ? "ready" : "tutorial");
    });
    return () => {
      active = false;
    };
  }, []);

  const startDrill = async () => {
    if (checked) await storeData("dismissDrillTutorial", "true");
    setStatus("ready");
  };

  if (status === "ready") return <>{children}</>;
  if (status === "loading") return <ActivityIndicator />;

  return (
    <Portal>
      <Dialog
        testID="DrillTutorialDialog"
        visible
        onDismiss={() => void startDrill()}
        style={{ alignSelf: "center", width: Math.min(600, width - 32) }}
      >
        <Dialog.Title>How Drills Work</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyLarge">
            Drills are like do it yourself hints. Just alter the board to match
            what you think would happen if you applied the hint for the given
            strategy and then click submit to check your work. Can&apos;t figure
            it out? No worries, just click the hint ? button to get the
            solution.
          </Text>
          <Checkbox.Item
            label="Don't show this again"
            status={checked ? "checked" : "unchecked"}
            mode="android"
            testID="dismissDrillTutorial"
            onPress={() => setChecked((current) => !current)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            testID="hideDrillTutorialButton"
            onPress={() => void startDrill()}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DrillTutorialGate;
