import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
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
  contentLength: number,
): InformationArea | undefined => {
  let best: InformationArea | undefined;
  let bestDistance = Infinity;
  let bestScore = 0;
  const inset = Math.max(4, size * 0.12);
  const padding = Math.max(10, size * 0.2);
  const titleFontSize = Math.max(14, size * 0.43);
  const bodyFontSize = Math.max(12, size * 0.31);
  const buttonSize = Math.max(32, Math.min(44, size * 0.82));
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
        const titleLines =
          Math.ceil(
            titleLength /
              Math.max(1, Math.floor(contentWidth / (titleFontSize * 0.6))),
          ) + 1;
        const bodyLines =
          Math.ceil(
            contentLength /
              Math.max(1, Math.floor(contentWidth / (bodyFontSize * 0.6))),
          ) + 1;
        // Reserve the larger explanation/action and all hint controls up front.
        // Prefer a full-width card below the board over clipped or scrolling text.
        const requiredHeight =
          2 * (inset + padding + 1) +
          titleLines * titleFontSize * 1.3 +
          8 +
          bodyLines * Math.max(17, size * 0.44) +
          buttonSize +
          20;
        if (
          contentWidth < buttonSize * 3 + 24 ||
          height * size < requiredHeight
        )
          continue;
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

/** Static guidance on a clean card within the inactive fogged grid. */
const FocusGuidance = ({
  sudokuBoard,
  methods,
  children,
}: {
  sudokuBoard: BoardObjectProps;
  methods: SudokuVariantMethods;
  children?: React.ReactNode;
}) => {
  const { theme } = useTheme();
  const size = useCellSize();
  const hint = methods.getGuidance(sudokuBoard);
  const displayHint = methods.getDisplayHint(sudokuBoard);
  if (!hint || !displayHint) return null;

  const unused = sudokuBoard.puzzleState.map((row, r) =>
    row.map((_, c) => !methods.isCellExposed(sudokuBoard, r, c)),
  );
  const title = formatOneLessonName(hint.strategy);
  const area = findInformationArea(
    unused,
    size,
    title.length,
    Math.max(hint.info.length, hint.action.length),
  );
  const appearance = getFocusAppearance(theme);
  const inset = Math.max(4, size * 0.12);

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
              justifyContent: "center",
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
        <Text
          style={{
            textAlign: "center",
            color: theme.useDarkTheme
              ? theme.colors.primary
              : theme.semantic.text.tertiary,
            fontSize: Math.max(14, size * 0.43),
            lineHeight: Math.max(14, size * 0.43) * 1.3,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {title}
        </Text>
        {sudokuBoard.activeHint ? (
          children
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: theme.useDarkTheme
                ? theme.semantic.text.inverse
                : theme.semantic.text.info,
              fontSize: Math.max(12, size * 0.31),
              lineHeight: Math.max(17, size * 0.44),
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
