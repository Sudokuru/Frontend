import { getCellSize } from "../Functions/BoardFunctions";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import React from "react";

const HintSection = (props: any) => {
  const {
    hintStratName,
    hintInfo,
    hintAction,
    currentStep,
    rightArrowClicked,
    leftArrowClicked,
    checkMarkClicked,
    onFirstStep,
    onFinalStep,
  } = props;
  const cellSize = getCellSize();
  const sizeConst = Platform.OS == "web" ? 1.5 : 1;
  const theme = useTheme();

  const isRightArrowRendered = (onFinalStep: any) => {
    return !onFinalStep;
  };

  const isLeftArrowRendered = (onFirstStep: any) => {
    return !onFirstStep;
  };

  const isCheckMarkRendered = (onFinalStep: any) => {
    return onFinalStep;
  };

  return (
    <View style={styles(cellSize).hintSectionContainer}>
      {isLeftArrowRendered(onFirstStep) ? (
        // checkcircleo
        <Pressable testID={"hintLeftArrow"} onPress={leftArrowClicked}>
          <AntDesign
            color={theme.colors.onBackground}
            name="leftcircleo"
            size={cellSize / sizeConst}
          />
        </Pressable>
      ) : (
        <View
          style={styles(cellSize, null, sizeConst).hintArrowPlaceholderView}
        ></View>
      )}
      <View style={styles(cellSize).hintTextContainer}>
        <View>
          <Text style={styles(cellSize).hintStratNameText}>
            {hintStratName}
          </Text>
        </View>
        <View>
          <Text
            style={
              styles(cellSize, theme.colors.onBackground).hintActionInfoText
            }
          >
            {currentStep == 0 ? hintInfo : hintAction}
          </Text>
        </View>
      </View>
      {isRightArrowRendered(onFinalStep) ? (
        <Pressable testID={"hintRightArrow"} onPress={rightArrowClicked}>
          <AntDesign
            color={theme.colors.onBackground}
            name="rightcircleo"
            size={cellSize / sizeConst}
          />
        </Pressable>
      ) : isCheckMarkRendered(onFinalStep) ? (
        <Pressable testID={"hintCheckMark"} onPress={checkMarkClicked}>
          <AntDesign
            color={theme.colors.onBackground}
            name="checkcircle"
            size={cellSize / sizeConst}
          />
        </Pressable>
      ) : (
        <View
          style={styles(cellSize, null, sizeConst).hintArrowPlaceholderView}
        ></View>
      )}
    </View>
  );
};

let fallbackHeight = 30;

const styles = (cellSize?: number, themeColor?: any, sizeConst?: number) =>
  StyleSheet.create({
    hintArrowPlaceholderView: {
      width: cellSize && sizeConst ? cellSize / sizeConst : fallbackHeight,
      height: cellSize && sizeConst ? cellSize / sizeConst : fallbackHeight,
    },
    hintSectionContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: cellSize ? cellSize * 9 : fallbackHeight * 9,
    },
    hintTextContainer: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: cellSize ? cellSize * 5 : fallbackHeight * 5,
    },
    hintStratNameText: {
      fontFamily: "Inter_700Bold",
      fontSize: cellSize ? cellSize * (1 / 2) : fallbackHeight * (1 / 2),
      color: "#F2CA7E",
    },
    hintActionInfoText: {
      fontSize: cellSize ? cellSize * (1 / 4) : fallbackHeight * (1 / 4),
      color: themeColor,
      textAlign: "center",
    },
  });

export default HintSection;
