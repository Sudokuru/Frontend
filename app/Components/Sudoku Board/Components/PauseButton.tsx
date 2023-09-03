import { Pressable, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getCellSize } from "../Functions/BoardFunctions";
import { useTheme } from "react-native-paper";

const PauseButton = ({ handlePause, isPaused }) => {
  const cellSize = getCellSize();
  const sizeConst = Platform.OS == "web" ? 1.5 : 1;
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
