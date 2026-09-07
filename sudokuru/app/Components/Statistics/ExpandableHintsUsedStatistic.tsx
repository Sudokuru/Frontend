import React from "react";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { SudokuStrategy } from "sudokuru";
import { useTheme } from "../../Contexts/ThemeContext";
import { NumHintsUsedPerStrategy } from "../NumHintsUsedPerStrategy";
import Statistic from "./Statistic";

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
  const [isHintsBreakdownExpanded, setHintsBreakdownExpanded] =
    React.useState(false);

  return (
    <>
      <Statistic
        statisticName="Total Hints Used: "
        statisticValue={numHintsUsed}
        testID={testID}
        rowTestID="expandableNumHintsUsed"
        onPress={() => setHintsBreakdownExpanded((previous) => !previous)}
        disabled={numHintsUsed === 0}
        accessory={
          numHintsUsed > 0 ? (
            <MaterialCommunityIcons
              testID="expandableNumHintsChevron"
              name={isHintsBreakdownExpanded ? "chevron-up" : "chevron-down"}
              color={theme.semantic.text.primary}
              size={24}
            />
          ) : null
        }
      />
      {isHintsBreakdownExpanded ? (
        <NumHintsUsedPerStrategy
          numHintsUsedPerStrategy={numHintsUsedPerStrategy}
        />
      ) : null}
    </>
  );
};

export default ExpandableHintsUsedStatistic;
