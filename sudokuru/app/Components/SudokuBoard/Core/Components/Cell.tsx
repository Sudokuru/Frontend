import { useCellSize } from "../Functions/BoardFunctions";
import React from "react";
import { Pressable, StyleProp, Text, TextStyle, View } from "react-native";
import { CellType } from "../../../../Functions/LocalDatabase";

let fallbackHeight = 30;

interface RenderCellProps {
  disable: boolean;
  entry: any; // todo find some way to derive this from type instad of duplicate
  type: CellType;
  onClick: (r: number, c: number, event: any) => void;
  backgroundColor: string;
  noteColor: string[];
  backgroundNoteColor: string[];
  c: number;
  r: number;
}

const Cell = (props: RenderCellProps) => {
  const {
    disable,
    entry,
    type,
    onClick,
    backgroundColor,
    c,
    r,
    noteColor,
    backgroundNoteColor,
  } = props;
  const cellSize = useCellSize();

  /**
   * Generates a styled text component for a note index within a cell.
   *
   * @param noteIndex - The index of the note to be rendered.
   * @param noteColor - An array of colors corresponding to each note index.
   * @returns A Text component with the specified style if the note index is present in the entry.
   */
  const getNoteContents = (noteIndex: number, noteColor: string[]) => {
    if (entry.includes(noteIndex)) {
      const styleVal: StyleProp<TextStyle> = {
        fontSize: cellSize ? cellSize / 4.5 : fallbackHeight / 4,
        fontFamily: "Inter_200ExtraLight",
        color: noteColor[noteIndex - 1],
      };
      return (
        <Text style={styleVal} selectable={false}>
          {noteIndex}
        </Text>
      );
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

  const NoteGrid = () => {
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((noteIndex) => (
              <View
                key={noteIndex}
                style={{
                  width: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
                  height: cellSize ? cellSize / 4 + 1 : fallbackHeight / 4 + 1,
                  paddingLeft: cellSize ? cellSize / 20 : fallbackHeight / 20,
                  backgroundColor: backgroundNoteColor[noteIndex - 1],
                }}
                testID={`note${noteIndex}`}
              >
                {getNoteContents(noteIndex, noteColor)}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Pressable
      onPress={(event: any) => {
        onClick(r, c, event);
      }}
      style={[
        {
          height: cellSize ? cellSize : fallbackHeight,
          width: cellSize ? cellSize : fallbackHeight,
          display: "flex",
          justifyContent: "center",
          borderWidth: cellSize ? cellSize / 40 : fallbackHeight / 40,
          backgroundColor: backgroundColor,
          outline: "none",
        },
        c % 3 === 0 ? { borderLeftWidth: getOutsideBorderWidth() } : null,
        r % 3 === 0 ? { borderTopWidth: getOutsideBorderWidth() } : null,
        c === 8 ? { borderRightWidth: getOutsideBorderWidth() } : null,
        r === 8 ? { borderBottomWidth: getOutsideBorderWidth() } : null,
      ]}
      testID={"cellr" + r + "c" + c + getCellContents()}
      disabled={disable}
    >
      {type === "note" ? (
        <NoteGrid />
      ) : entry !== 0 ? (
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: cellSize
              ? cellSize * (3 / 4) + 1
              : fallbackHeight * (3 / 4) + 1,
            textAlign: "center",
            lineHeight: cellSize ? cellSize : fallbackHeight,
          }}
          selectable={false}
        >
          {entry}
        </Text>
      ) : (
        <></>
      )}
    </Pressable>
  );
};

export default Cell;
