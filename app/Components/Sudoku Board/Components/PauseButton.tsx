import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Platform } from "react-native";
import { useTheme } from "react-native-paper";

import { useCellSize } from "../Functions/BoardFunctions";

interface PauseButtonProps {
  handlePause: () => void;
  isPaused: boolean;
}

const PauseButton = (props: PauseButtonProps) => {
  const { handlePause, isPaused } = props;
  const cellSize = useCellSize();
  const sizeConst = Platform.OS === "web" ? 1.5 : 1;
  const theme = useTheme();

  return (
    <Pressable testID="PauseButton" onPress={handlePause}>
      {isPaused ? (
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="play"
          size={cellSize / sizeConst}
        />
      ) : (
        <MaterialCommunityIcons
          color={theme.colors.onBackground}
          name="pause"
          size={cellSize / sizeConst}
        />
      )}
    </Pressable>
  );
};

export default PauseButton;
