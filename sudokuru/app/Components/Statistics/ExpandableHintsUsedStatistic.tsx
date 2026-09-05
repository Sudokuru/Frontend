import React from "react";
import { View, useWindowDimensions } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { Text, TouchableRipple } from "react-native-paper";
import { SudokuStrategy } from "sudokuru";
import { useTheme } from "../../Contexts/ThemeContext";
import { NumHintsUsedPerStrategy } from "../NumHintsUsedPerStrategy";

interface ExpandableHintsUsedStatisticProps {
  numHintsUsed: number;
  numHintsUsedPerStrategy: {
    hintStrategy: SudokuStrategy;
    numHintsUsed: number;
  }[];
  testID?: string;
}

const ExpandableHintsUsedStatistic = ({
  numHintsUsed,
  numHintsUsedPerStrategy,
  testID = "numHintsUsed",
}: ExpandableHintsUsedStatisticProps) => {
  const { theme } = useTheme();
  const size = useWindowDimensions();
  const reSize = Math.min(size.width, size.height);
  const isLargeScreen = size.width >= 800;
  const statFontSize = Math.max(
    16,
    Math.min(reSize / (isLargeScreen ? 19 : 23), isLargeScreen ? 30 : 24),
  );
  const [isHintsBreakdownExpanded, setHintsBreakdownExpanded] =
    React.useState(false);

  return (
    <>
      <TouchableRipple
        onPress={() =>
          numHintsUsed > 0 &&
          setHintsBreakdownExpanded(!isHintsBreakdownExpanded)
        }
        disabled={numHintsUsed === 0}
        testID="expandableNumHintsUsed"
        style={{ marginBottom: 8 }}
        rippleColor={theme.colors.border}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "baseline",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              color: theme.semantic.text.quaternary,
              fontSize: statFontSize,
              lineHeight: statFontSize * 1.2,
              marginRight: 2,
            }}
          >
            {"Total Hints Used: "}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: theme.semantic.text.primary,
                fontSize: statFontSize,
                lineHeight: statFontSize * 1.2,
                fontWeight: "bold",
              }}
              testID={testID}
            >
              {numHintsUsed}
            </Text>
            {numHintsUsed > 0 ? (
              <MaterialCommunityIcons
                testID="expandableNumHintsChevron"
                name={isHintsBreakdownExpanded ? "chevron-up" : "chevron-down"}
                color={theme.semantic.text.primary}
                size={24}
              />
            ) : null}
          </View>
        </View>
      </TouchableRipple>
      {isHintsBreakdownExpanded ? (
        <NumHintsUsedPerStrategy
          numHintsUsedPerStrategy={numHintsUsedPerStrategy}
        />
      ) : null}
    </>
  );
};

export default ExpandableHintsUsedStatistic;
