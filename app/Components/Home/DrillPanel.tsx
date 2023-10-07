import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { sudokuStrategyArray } from "sudokuru";

let drillStrategies: sudokuStrategyArray = [
  "NAKED_SINGLE",
  "NAKED_PAIR",
  "NAKED_TRIPLET",
  "NAKED_QUADRUPLET",
  "HIDDEN_SINGLE",
  "HIDDEN_PAIR",
  "HIDDEN_TRIPLET",
  "HIDDEN_QUADRUPLET",
  "POINTING_PAIR",
  "POINTING_TRIPLET",
];

const DrillPanel = (props: any) => {
  const navigation: any = useNavigation();

  let drillButtonArray = [];
  let subArray = [];
  const CARD_WIDTH: number = 200;
  let columnCount: number = Math.floor(props.width / (CARD_WIDTH + 100));
  // Decrease the number of columns to the smallest number that is greater than or equal to the number of rows
  while (
    columnCount - 1 >=
    Math.ceil(drillStrategies.length / (columnCount - 1))
  ) {
    columnCount--;
  }
  for (let i = 0; i < drillStrategies.length; i++) {
    subArray.push(
      <View style={{ width: CARD_WIDTH }}>
        <Card>
          <Card.Title
            title="Card Title"
            subtitle="Card Subtitle"
            left={(props) => drillStrategies[i]}
          />
          <Card.Content>
            <Text variant="titleLarge">Card title</Text>
            <Text variant="bodyMedium">Card content</Text>
          </Card.Content>
          <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
          <Card.Actions>
            <Button
              onPress={() => {
                navigation.navigate("DrillGame", {
                  params: drillStrategies[i],
                });
              }}
            >
              Play
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );

    // Add row
    if ((i + 1) % columnCount === 0) {
      drillButtonArray.push(subArray);
      subArray = [];
    }
  }
  // Add last row if not evenly divisible
  if (subArray.length > 0) {
    drillButtonArray.push(subArray);
  }

  // render each sub-array as a row
  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {drillButtonArray.map((subArray, index) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={index}
        >
          {subArray}
        </View>
      ))}
    </View>
  );
};

export default DrillPanel;
