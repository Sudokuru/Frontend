import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { sudokuStrategy, sudokuStrategyArray } from "sudokuru";
import { formatOneLessonName } from "../../Functions/learnedLessons";

const StrategyOrder = () => {
  const strategies: sudokuStrategyArray = [
    "AMEND_NOTES",
    "SIMPLIFY_NOTES",
    "NAKED_SINGLE",
    "HIDDEN_SINGLE",
    "NAKED_PAIR",
    "HIDDEN_PAIR",
    "POINTING_PAIR",
    "NAKED_TRIPLET",
    "HIDDEN_TRIPLET",
    "POINTING_TRIPLET",
    "NAKED_QUADRUPLET",
    "HIDDEN_QUADRUPLET",
  ];

  // https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
  // https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
  /**
   * Takes in a string and creates a bullet component
   * @param point a string for the bullet component
   * @param key a key for the view element
   * @returns A JSX element of a bullet
   */
  const BulletComponent = (
    point: string,
    key: number | string,
    bullet = "•"
  ) => {
    return (
      <View
        style={{ flexDirection: "row", paddingLeft: 20, maxWidth: 800 }}
        key={key}
      >
        <Text style={{ fontSize: 14, color: "#025E73", minWidth: 20 }}>
          {bullet}
        </Text>
        <Text style={{ fontSize: 14, paddingLeft: 5, color: "#025E73" }}>
          {point}
        </Text>
      </View>
    );
  };

  const strategyView = (strategy: sudokuStrategy, order: number) => {
    return BulletComponent(
      formatOneLessonName(strategy),
      strategy,
      `${order}.`
    );
  };

  const strategyViews = (strategies: sudokuStrategyArray) => {
    const component: React.JSX.Element[] = [];
    for (const strategy of strategies) {
      component.push(strategyView(strategy, strategies.indexOf(strategy)));
    }
    return component;
  };

  return (
    <>
      <Text style={{ color: "#025E73" }}>Strategy Hint Order</Text>
      {strategyViews(strategies)}
    </>
  );
};

export default StrategyOrder;
