import { getCellSize } from "../Functions/BoardFunctions";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CellType } from "../../../Functions/LocalDatabase";

let fallbackHeight = 30;

interface RenderCellProps {
  entry: any; // todo find some way to derive this from type instad of duplicate
  type: CellType;
  onClick: (r: number, c: number, event: any) => void;
  backgroundColor: string;
  c: number;
  r: number;
}

const Cell = (props: RenderCellProps) => {
  const { entry, type, onClick, backgroundColor, c, r } = props;
  const cellSize = getCellSize();

  /**
   * Generates note text for each note if the note exists in the cell.
   * @param noteIndex The index of the note.
   * @returns void or a text component for the note index of a cell.
   */
  const getNoteContents = (noteIndex: number) => {
    if (entry.includes(noteIndex)) {
      const styleVal = {
        fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
        fontFamily: "Inter_200ExtraLight",
      };
      return <Text style={styleVal}>{noteIndex}</Text>;
    }
  };

  /**
   * This generates a string used for testid to determine the contents of a cell
   * @returns A string representing the contents of the cell
   */
  const getCellContents = () => {
    let contents = "";
    if (type === "note") {
      contents += "notes:";
      for (let i = 1; i <= 9; i++) {
        if (entry.includes(i)) {
          contents += i.toString();
        }
      }
    } else {
      contents += "value:";
      contents += entry.toString();
    }
    return contents;
  };

  const getOutsideBorderWidth = () => {
    return cellSize ? cellSize * (3 / 40) : 40;
  };

  return (
    <Pressable
      onPress={(event: any) => {
        onClick(r, c, event);
      }}
      // @ts-ignore
      style={{ outline: "none" }}
    >
      <View
        testID={"cellr" + r + "c" + c + getCellContents()}
        style={[
          {
            height: cellSize ? cellSize : fallbackHeight,
            width: cellSize ? cellSize : fallbackHeight,
            display: "flex",
            justifyContent: "center",
            borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
            backgroundColor: backgroundColor,
          },
          c % 3 === 0 ? { borderLeftWidth: getOutsideBorderWidth() } : null,
          r % 3 === 0 ? { borderTopWidth: getOutsideBorderWidth() } : null,
          c === 8 ? { borderRightWidth: getOutsideBorderWidth() } : null,
          r === 8 ? { borderBottomWidth: getOutsideBorderWidth() } : null,
        ]}
      >
        {type === "note" ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={styles(cellSize).noteViewElement} testID={"note1"}>
                {getNoteContents(1)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note2"}>
                {getNoteContents(2)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note3"}>
                {getNoteContents(3)}
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles(cellSize).noteViewElement} testID={"note4"}>
                {getNoteContents(4)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note5"}>
                {getNoteContents(5)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note6"}>
                {getNoteContents(6)}
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={styles(cellSize).noteViewElement} testID={"note7"}>
                {getNoteContents(7)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note8"}>
                {getNoteContents(8)}
              </View>
              <View style={styles(cellSize).noteViewElement} testID={"note9"}>
                {getNoteContents(9)}
              </View>
            </View>
          </View>
        ) : entry != 0 ? (
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: cellSize
                ? cellSize * (3 / 4) + 1
                : fallbackHeight * (3 / 4) + 1,
              textAlign: "center",
              lineHeight: cellSize ? cellSize : fallbackHeight,
            }}
          >
            {entry}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </Pressable>
  );
};

const styles = (cellSize?: number) =>
  StyleSheet.create({
    noteViewElement: {
      width: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
      height: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
      paddingLeft: cellSize ? cellSize / 20 : fallbackHeight / 20,
    },
  });

export default Cell;
