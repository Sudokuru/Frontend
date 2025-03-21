import React from "react";
import { View, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SudokuStrategy } from "sudokuru";
import { formatOneLessonName } from "../../Functions/learnedLessons";
import {
  PreferencesContext,
  returnSudokuStrategyArray,
} from "../../Contexts/PreferencesContext";

/**
 * This is a component for the user to select what order hints for strategies should be given in
 */
const StrategyOrder = () => {
  const { updateStrategyHintOrder, strategyHintOrderSetting } =
    React.useContext(PreferencesContext);

  const [selectedElement, setSelectedElement] = React.useState(-1);

  // https://stackoverflow.com/questions/40441877/react-native-bulleted-lists-using-flex-wrap
  // https://stackoverflow.com/questions/39110460/react-native-unordered-style-list
  /**
   * A pressable list component that changes border highlight when selected
   * @param point The content of the element
   * @param key A key for the element
   * @param order Specifies which number element this is
   * @param selected Determines if this element is selected or not
   * @param bullet The prefix/bullet to use for the element
   * @returns A JSX element of a hint strategy
   */
  const StrategyHintComponent = (
    point: string,
    key: number | string,
    order: number,
    selected: boolean,
    bullet = "•",
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
          padding: 5,
          paddingLeft: 10,
          marginTop: 5,
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

  /**
   * A list of StrategyHintComponents which is generated by looping through all of the strategies
   * @param strategies An array of all sudoku strategies
   * @param selected The index of the selected strategy
   * @returns JSX StrategyHintComponent
   */
  const StrategyHintListComponent = (
    strategies: SudokuStrategy[],
    selected: number,
  ) => {
    const component: React.JSX.Element[] = [];

    for (const strategy of strategies) {
      const index = strategies.indexOf(strategy) + 1;
      component.push(
        StrategyHintComponent(
          formatOneLessonName(strategy),
          strategy,
          index,
          selected === index,
          `${index}.`,
        ),
      );
    }
    return component;
  };

  /**
   * Updates the selected element and strategy order when up or down arrow is pressed.
   * @param index The index of the currently selected element
   * @param increment Determines if the selected element should move up or down the list (-1 is up, 1 is down)
   */
  const incrementStrategyOrder = (index: number, increment: -1 | 1) => {
    let incrementString: "up" | "down";
    if (increment === 1) {
      incrementString = "down";
    } else {
      incrementString = "up";
    }
    // exit early to avoid array out-of-bounds errors
    if (isIncrementButtonDisabled(index, incrementString)) {
      return;
    }

    // converting back 0 based index instead of 1 based index
    index = index - 1;

    // using array destructuring syntax to swap values in strategy array
    // https://www.slingacademy.com/article/javascript-ways-to-swap-elements-in-an-array/
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

  /**
   * Determines the button color depending on if the button is disabled or not
   * @param index The current index of the element selected in Strategy Hint List
   * @param button The type of increment button
   * @returns String represeting the color of the button
   */
  const incrementButtonColor = (index: number, button: "up" | "down") => {
    const disabled = isIncrementButtonDisabled(index, button);
    if (disabled) {
      return "grey";
    } else {
      return "#025E73";
    }
  };

  /**
   * Determines if an increment (up or down) button should be disabled
   * @param index The current index of the element selected in Strategy Hint List
   * @param button The type of increment button
   * @returns Boolean to determine if the button is disabled or not
   */
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
          icon="arrow-up"
          iconColor={incrementButtonColor(selectedElement, "up")}
          theme={{ colors: { onSurfaceDisabled: "grey" } }}
          testID={"HintStrategyMenuUp"}
          size={20}
          style={{
            borderWidth: 2,
            borderColor: incrementButtonColor(selectedElement, "up"),
          }}
          disabled={isIncrementButtonDisabled(selectedElement, "up")}
          onPress={() => incrementStrategyOrder(selectedElement, -1)}
        />
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <IconButton
            icon="refresh"
            iconColor="#025E73"
            testID={"HintStrategyMenuReset"}
            size={20}
            style={{
              borderWidth: 2,
              borderColor: "#025E73",
            }}
            // need a deep copy of SUDOKU_STRATEGY_ARRAY otherwise it becomes mutated
            onPress={() => {
              updateStrategyHintOrder(returnSudokuStrategyArray());
            }}
          />
          <Text style={{ color: "#025E73" }}>RESET</Text>
        </View>
        <IconButton
          icon="arrow-down"
          iconColor={incrementButtonColor(selectedElement, "down")}
          theme={{ colors: { onSurfaceDisabled: "grey" } }}
          testID={"HintStrategyMenuDown"}
          size={20}
          style={{
            borderWidth: 2,
            borderColor: incrementButtonColor(selectedElement, "down"),
          }}
          disabled={isIncrementButtonDisabled(selectedElement, "down")}
          onPress={() => incrementStrategyOrder(selectedElement, 1)}
        />
      </View>
      {StrategyHintListComponent(strategyHintOrderSetting, selectedElement)}
    </>
  );
};

export default StrategyOrder;
