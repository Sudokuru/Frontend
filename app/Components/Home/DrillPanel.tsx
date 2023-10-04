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

  // dynamically render in lesson buttons based on criteria
  let drillButtonArray = [];
  let NUM_LESSONS_PER_ROW = 2;

  let subArray = [];
  let widthLeft = props.width;
  for (let i = 0; i < drillStrategies.length; i++) {
    subArray.push(
      <View style={{ width: 200 }}>
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

    // push sub-array to main array after too little width left
    if (widthLeft < 600) {
      drillButtonArray.push(subArray);
      subArray = [];
      widthLeft = props.width;
    } else {
      widthLeft -= 200;
    }
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
