import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { BoardObjectProps } from "../../../Functions/LocalDatabase";
import { formatOneLessonName } from "../../../Functions/learnedLessons";
import { useTheme } from "../../../Contexts/ThemeContext";
import { useCellSize } from "../Core/Functions/BoardFunctions";
import { SudokuVariantMethods } from "../SudokuBoardSharedFunctionsController";
import { getFocusAppearance } from "./FocusAppearance";

interface InformationArea {
  row: number;
  column: number;
  width: number;
  height: number;
}

/** Prefer broad, readable areas; centering only breaks otherwise equal choices. */
const findInformationArea = (
  unused: boolean[][],
  size: number,
  titleLength: number,
): InformationArea | undefined => {
  let best: InformationArea | undefined;
  let bestDistance = Infinity;
  let bestScore = 0;
  const inset = Math.max(4, size * 0.12);
  const padding = Math.max(10, size * 0.2);
  const titleFontSize = Math.max(14, size * 0.43);
  const expandIconSize = Math.max(18, Math.min(28, size * 0.4));
  for (let top = 0; top < 9; top++) {
    const availableColumns = Array<boolean>(9).fill(true);
    for (let bottom = top; bottom < 9; bottom++) {
      let start = 0;
      for (let column = 0; column < 9; column++) {
        availableColumns[column] =
          availableColumns[column] && unused[bottom][column];
        if (!availableColumns[column]) {
          start = column + 1;
          continue;
        }
        const width = column - start + 1;
        const height = bottom - top + 1;
        const contentWidth = width * size - 2 * (inset + padding + 1);
        // The collapsed card shows only the title beside the expand chevron.
        const titleWidth = contentWidth - expandIconSize - 8;
        const titleLines = Math.ceil(
          titleLength /
            Math.max(1, Math.floor(titleWidth / (titleFontSize * 0.55))),
        );
        const requiredHeight =
          2 * (inset + padding + 1) +
          Math.max(titleLines * titleFontSize * 1.3, expandIconSize) +
          4;
        if (height * size < requiredHeight) continue;
        const distance =
          (top + height / 2 - 4.5) ** 2 + (start + width / 2 - 4.5) ** 2;
        const score =
          width * height * Math.min(width / 6, 1) * Math.min(height / 3, 1);
        if (
          score > bestScore ||
          (score === bestScore &&
            (width > (best?.width ?? 0) ||
              (width === best?.width && distance < bestDistance)))
        ) {
          bestDistance = distance;
          bestScore = score;
          best = { row: top, column: start, width, height };
        }
      }
    }
  }
  return best;
};

/** Collapsed strategy card on the fogged area; the description expands inline. */
const FocusGuidance = ({
  sudokuBoard,
  methods,
}: {
  sudokuBoard: BoardObjectProps;
  methods: SudokuVariantMethods;
}) => {
  const { theme } = useTheme();
  const size = useCellSize();
  const [expanded, setExpanded] = React.useState(false);
  const hint = methods.getGuidance(sudokuBoard);
  const displayHint = methods.getDisplayHint(sudokuBoard);
  if (!hint || !displayHint) return null;

  const unused = sudokuBoard.puzzleState.map((row, r) =>
    row.map((_, c) => !methods.isCellExposed(sudokuBoard, r, c)),
  );
  const title = formatOneLessonName(hint.strategy);
  const area = findInformationArea(unused, size, title.length);
  const appearance = getFocusAppearance(theme);
  const inset = Math.max(4, size * 0.12);
  const expandIconSize = Math.max(18, Math.min(28, size * 0.4));
  const expandIconColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.info;

  return (
    <View
      pointerEvents="box-none"
      style={
        area
          ? {
              position: "absolute",
              top: area.row * size,
              left: area.column * size,
              width: area.width * size,
              height: area.height * size,
              padding: inset,
            }
          : { width: size * 9, padding: inset }
      }
    >
      <View
        key={`${hint.strategy}:${area?.row ?? "below"}:${area?.column ?? 0}`}
        testID="focusGuidance"
        style={{
          padding: Math.max(10, size * 0.2),
          borderRadius: Math.max(8, size * 0.2),
          backgroundColor: appearance.cardColor,
          borderColor: appearance.borderColor,
          borderWidth: 1,
        }}
      >
        <Pressable
          testID="focusGuidanceExpand"
          accessibilityRole="button"
          accessibilityLabel={
            expanded
              ? "Collapse strategy description"
              : "Expand strategy description"
          }
          accessibilityState={{ expanded }}
          onPress={() => setExpanded(!expanded)}
          hitSlop={12}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                textAlign: "center",
                color: theme.useDarkTheme
                  ? theme.colors.primary
                  : theme.semantic.text.tertiary,
                fontSize: Math.max(14, size * 0.43),
                lineHeight: Math.max(14, size * 0.43) * 1.3,
                fontWeight: "bold",
              }}
            >
              {title}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={expandIconSize}
            color={expandIconColor}
          />
        </Pressable>
        {expanded && (
          <Text
            style={{
              textAlign: "center",
              color: theme.useDarkTheme
                ? theme.semantic.text.inverse
                : theme.semantic.text.info,
              fontSize: Math.max(12, size * 0.31),
              lineHeight: Math.max(17, size * 0.44),
              marginTop: 8,
            }}
          >
            {hint.info}
          </Text>
        )}
      </View>
    </View>
  );
};

export default FocusGuidance;
