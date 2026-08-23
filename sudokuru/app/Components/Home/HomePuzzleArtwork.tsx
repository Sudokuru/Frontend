import React from "react";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

const PUZZLE = [
  8,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  3,
  6,
  null,
  null,
  null,
  null,
  null,
  null,
  7,
  null,
  null,
  9,
  null,
  2,
  null,
  null,
  null,
  5,
  null,
  null,
  null,
  7,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  4,
  5,
  7,
  null,
  null,
  null,
  null,
  null,
  1,
  null,
  null,
  null,
  3,
  null,
  null,
  null,
  1,
  null,
  null,
  null,
  null,
  6,
  8,
  null,
  null,
  8,
  5,
  null,
  null,
  null,
  1,
  null,
  9,
  null,
  null,
  null,
  null,
  null,
  4,
  null,
  null,
];

interface HomePuzzleArtworkProps {
  size: number;
}

const HomePuzzleArtwork = ({ size }: HomePuzzleArtworkProps) => {
  const { theme } = useTheme();
  const cellSize = size / 9;

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size + 28,
        height: size + 42,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: size,
          height: size,
          borderRadius: 16,
          backgroundColor: theme.colors.primary,
          transform: [{ rotate: "4deg" }],
        }}
      />
      <Surface
        elevation={5}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          flexDirection: "row",
          flexWrap: "wrap",
          overflow: "hidden",
          borderRadius: 12,
          borderWidth: 4,
          borderColor: theme.colors.surfaceAlt,
          backgroundColor: theme.semantic.text.inverse,
          transform: [{ rotate: "-1.5deg" }],
        }}
      >
        {PUZZLE.map((value, index) => {
          const row = Math.floor(index / 9);
          const column = index % 9;
          const isFocusedRegion =
            row >= 3 && row <= 5 && column >= 3 && column <= 5;
          return (
            <View
              key={index}
              style={{
                width: cellSize,
                height: cellSize,
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: column === 8 ? 0 : column % 3 === 2 ? 2 : 0.5,
                borderBottomWidth: row === 8 ? 0 : row % 3 === 2 ? 2 : 0.5,
                borderColor: theme.colors.surfaceAlt,
                backgroundColor: isFocusedRegion
                  ? theme.colors.primary
                  : theme.semantic.text.inverse,
              }}
            >
              {value ? (
                <Text
                  style={{
                    color: theme.semantic.text.info,
                    fontSize: cellSize * 0.48,
                    lineHeight: cellSize * 0.58,
                    fontWeight: "700",
                  }}
                >
                  {value}
                </Text>
              ) : null}
            </View>
          );
        })}
      </Surface>
      <View
        style={{
          position: "absolute",
          right: 0,
          top: size * 0.16,
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 7,
          backgroundColor: theme.colors.surfaceAlt,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        }}
      >
        <Text
          variant="labelSmall"
          style={{
            color: theme.colors.primary,
            fontWeight: "800",
            letterSpacing: 1,
          }}
        >
          FIND THE PATTERN
        </Text>
      </View>
    </View>
  );
};

export default HomePuzzleArtwork;
