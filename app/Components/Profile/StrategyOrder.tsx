import React from "react";
import { View, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { sudokuStrategy, sudokuStrategyArray } from "sudokuru";
import { formatOneLessonName } from "../../Functions/learnedLessons";
import { PreferencesContext } from "../../Contexts/PreferencesContext";

const StrategyOrder = () => {
  const { updateStrategyHintOrder, strategyHintOrderSetting } =
    React.useContext(PreferencesContext);

  const [selectedElement, setSelectedElement] = React.useState(-1);

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
    order: number,
    selected: boolean,
    bullet = "•"
  ) => {
    let borderColor = "grey";
    if (selected) {
      borderColor = "#D9A05B";
    }

    const updateSelectedElement = (order: number) => {
      if (selected) {
        return -1;
      } else {
        return order;
      }
    };

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingLeft: 20,
          marginBottom: 5,
          borderRadius: 10,
          borderWidth: 3,
          borderColor: borderColor,
        }}
        key={key}
        onPress={() => setSelectedElement(updateSelectedElement(order))}
      >
        <Text style={{ fontSize: 14, color: "#025E73", minWidth: 20 }}>
          {bullet}
        </Text>
        <Text style={{ fontSize: 14, paddingLeft: 5, color: "#025E73" }}>
          {point}
        </Text>
      </TouchableOpacity>
    );
  };

  const strategyView = (
    strategy: sudokuStrategy,
    order: number,
    selected: boolean
  ) => {
    return BulletComponent(
      formatOneLessonName(strategy),
      strategy,
      order,
      selected,
      `${order}.`
    );
  };

  const strategyViews = (strategies: sudokuStrategyArray, selected: number) => {
    const component: React.JSX.Element[] = [];

    for (const strategy of strategies) {
      const index = strategies.indexOf(strategy) + 1;
      component.push(strategyView(strategy, index, selected === index));
    }
    return component;
  };

  const incrementStrategyOrder = (index: number, increment: -1 | 1) => {
    index = index - 1;

    let incrementString: "up" | "down";
    if (increment) {
      incrementString = "down";
    } else {
      incrementString = "up";
    }
    if (isIncrementButtonDisabled(index, incrementString)) {
      return;
    }

    [
      strategyHintOrderSetting[index],
      strategyHintOrderSetting[index + increment],
    ] = [
      strategyHintOrderSetting[index + increment],
      strategyHintOrderSetting[index],
    ];
    updateStrategyHintOrder(strategyHintOrderSetting);
    setSelectedElement(index + 1 + increment);
  };

  const buttonOutlineColor = (index: number, button: "up" | "down") => {
    const disabled = isIncrementButtonDisabled(index, button);
    if (disabled) {
      return "grey";
    } else {
      return "#025E73";
    }
  };

  const isIncrementButtonDisabled = (index: number, button: "up" | "down") => {
    if (
      index === -1 ||
      (button === "up" && index === 1) ||
      (button === "down" && index === strategyHintOrderSetting.length)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Text style={{ color: "#025E73", fontSize: 25, alignSelf: "center" }}>
        Strategy Hint Order
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <IconButton
          icon="menu-up"
          testID={"ViewStatisticsPageButton"}
          size={20}
          style={{
            borderWidth: 2,
            borderColor: buttonOutlineColor(selectedElement, "up"),
          }}
          disabled={isIncrementButtonDisabled(selectedElement, "up")}
          onPress={() => incrementStrategyOrder(selectedElement, -1)}
        />
        <IconButton
          icon="menu-down"
          testID={"ViewStatisticsPageButton"}
          size={20}
          style={{
            borderWidth: 2,
            borderColor: buttonOutlineColor(selectedElement, "down"),
          }}
          disabled={isIncrementButtonDisabled(selectedElement, "down")}
          onPress={() => incrementStrategyOrder(selectedElement, 1)}
        />
      </View>
      {strategyViews(strategyHintOrderSetting, selectedElement)}
    </>
  );
};

export default StrategyOrder;
