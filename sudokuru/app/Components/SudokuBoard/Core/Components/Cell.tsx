import { useCellSize } from "../Functions/BoardFunctions";
import React from "react";
import { Pressable, StyleProp, Text, TextStyle, View } from "react-native";
import { CellType } from "../../../../Functions/LocalDatabase";

let fallbackHeight = 30;

/**
 * Generates a styled text component for a note index within a cell.
 *
 * @param props.cellSize - The size of the cell.
 * @param props.entry - An array of numbers representing the notes in the cell.
 * @param props.backgroundNoteColor - An array of colors corresponding to each note index.
 * @param props.noteColor - An array of colors corresponding to each note index.
 * @returns A View component with a styled Text component for each note index.
 */
const NoteGrid = (props: {
  cellSize: number;
  entry: number[];
  backgroundNoteColor: string[];
  noteColor: string[];
}) => {
  const { cellSize, entry, noteColor, backgroundNoteColor } = props;

  /**
   * Generates a styled text component for a note index within a cell.
   *
   * @param noteIndex - The index of the note to be rendered.
   * @param noteColor - An array of colors corresponding to each note index.
   * @returns A Text component with the specified style if the note index is present in the entry.
   */
  const getNoteContents = (
    cellSize: number,
    entry: number[],
    noteIndex: number,
    noteColor: string[],
  ) => {
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
              {getNoteContents(cellSize, entry, noteIndex, noteColor)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

/**
 * Renders a Sudoku cell which can display either notes or a single value.
 *
 * This component utilizes a pressable area for interaction, allowing users
 * to click on cells to perform actions like selection. The cell can be
 * displayed in different styles based on its type (note or value), whether it
 * is disabled, and its position on the board.
 *
 * @param props - The properties for rendering the cell.
 * @param props.disable - Indicates if the cell is disabled from interaction.
 * @param props.entry - The content of the cell, either a value or list of notes.
 * @param props.type - The type of the cell, determining its display style.
 * @param props.onClick - Callback function to handle cell click events.
 * @param props.backgroundColor - The background color of the cell.
 * @param props.c - The column index of the cell.
 * @param props.r - The row index of the cell.
 * @param props.noteColor - Array of colors for the notes, if applicable.
 * @param props.backgroundNoteColor - Array of background colors for each note.
 * @returns A React component representing a single cell in the Sudoku board.
 */
const Cell = (props: {
  disable: boolean;
  entry: any;
  type: CellType;
  onClick: (r: number, c: number, event: any) => void;
  backgroundColor: string;
  c: number;
  r: number;
  noteColor: string[];
  backgroundNoteColor: string[];
}) => {
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
        <NoteGrid
          cellSize={cellSize}
          entry={entry}
          backgroundNoteColor={backgroundNoteColor}
          noteColor={noteColor}
        />
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
