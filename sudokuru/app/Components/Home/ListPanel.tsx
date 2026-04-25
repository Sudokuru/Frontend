import React from "react";
import { Image, ImageURISource, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  CARD_PADDING,
  CARD_WIDTH,
  calculateCardsPerRow,
} from "./Cards";
import { useTheme } from "../../Contexts/ThemeContext";

interface ListPanelProps<T> {
  width: number;
  height: number;
  items: T[];
  getKey: (item: T, index: number) => string;
  getTestID?: (item: T, index: number) => string;
  getTitle: (item: T, index: number) => string;
  getTitleTestID?: (item: T, index: number) => string;
  getSubtitle?: (item: T, index: number) => string | undefined;
  getSubtitleTestID?: (item: T, index: number) => string | undefined;
  getSubtitleColor?: (item: T, index: number) => string;
  getCardImage?: (item: T, index: number) => ImageURISource | undefined;
  getImageAccessibilityLabel?: (item: T, index: number) => string | undefined;
  onPress: (item: T, index: number) => void;
  renderCompactContent?: (
    item: T,
    index: number,
    shrinkage: number,
  ) => React.ReactNode;
}

function getRowCount(cardCount: number, columnCount: number): number {
  return Math.ceil(cardCount / columnCount);
}

function getTotalCardsHeight(
  rowCount: number,
  cardHeight: number,
  shrinkage: number,
): number {
  const fromCards: number = rowCount * cardHeight;
  const fromPadding: number = (rowCount - 1) * CARD_PADDING;
  return (fromCards + fromPadding) * (1 - shrinkage);
}

const ListPanel = <T,>({
  width,
  height,
  items,
  getKey,
  getTestID,
  getTitle,
  getTitleTestID,
  getSubtitle,
  getSubtitleTestID,
  getSubtitleColor,
  getCardImage,
  getImageAccessibilityLabel,
  onPress,
  renderCompactContent,
}: ListPanelProps<T>) => {
  const { theme } = useTheme();

  const listButtonArray = [];
  let subArray = [];

  const cardLength = (CARD_WIDTH * 3) / 5;
  let shrinkage: number = -0.01;
  let columnCount: number = 1;
  let rowCount: number = 1;
  do {
    shrinkage += 0.01;
    columnCount = calculateCardsPerRow(width, height, items.length);
    rowCount = getRowCount(items.length, columnCount);
  } while (getTotalCardsHeight(rowCount, cardLength, shrinkage) > height * 0.7);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const key = getKey(item, i);
    const title = getTitle(item, i);
    const titleTestID = getTitleTestID?.(item, i);
    const subtitle = getSubtitle?.(item, i);
    const subtitleTestID = getSubtitleTestID?.(item, i);
    const subtitleColor = getSubtitleColor?.(item, i);
    const img = getCardImage?.(item, i);
    const imageAccessibilityLabel = getImageAccessibilityLabel?.(item, i);

    subArray.push(
      <View
        key={key}
        testID={getTestID?.(item, i)}
        style={{
          width: CARD_WIDTH,
          padding: CARD_PADDING * (1 - shrinkage),
          margin: 5,
        }}
      >
        <TouchableOpacity onPress={() => onPress(item, i)}>
          <Card
            mode="outlined"
            theme={{
              colors: {
                surface: theme.colors.surfaceAlt,
              },
            }}
          >
            {renderCompactContent != null && shrinkage >= 0.6 ? (
              renderCompactContent(item, i, shrinkage)
            ) : (
              <>
                <Text
                  variant="headlineMedium"
                  testID={titleTestID}
                  style={{
                    alignSelf: "center",
                    color: theme.semantic.text.inverse,
                  }}
                >
                  {title}
                </Text>
                {shrinkage < 0.6 && subtitle != null ? (
                  <Text
                    testID={subtitleTestID}
                    variant="headlineSmall"
                    style={{ alignSelf: "center" }}
                    theme={{ colors: { onSurface: subtitleColor } }}
                  >
                    {subtitle}
                  </Text>
                ) : null}
                {shrinkage < 0.3 && img != null ? (
                  <Image
                    source={img}
                    defaultSource={img}
                    style={{
                      width: (CARD_IMAGE_WIDTH / 3) * (1 - shrinkage),
                      height: (CARD_IMAGE_HEIGHT / 3) * (1 - shrinkage),
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                    accessibilityLabel={imageAccessibilityLabel}
                  />
                ) : null}
              </>
            )}
          </Card>
        </TouchableOpacity>
      </View>,
    );

    if ((i + 1) % columnCount === 0) {
      listButtonArray.push(subArray);
      subArray = [];
    }
  }

  if (subArray.length > 0) {
    listButtonArray.push(subArray);
  }

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {listButtonArray.map((row, index) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={index}
        >
          {row}
        </View>
      ))}
    </View>
  );
};

export default ListPanel;
