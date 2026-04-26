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
  renderImageContent?: (
    item: T,
    index: number,
    shrinkage: number,
  ) => React.ReactNode;
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

interface CardBodyContent {
  title: string;
  titleTestID?: string;
  subtitle?: string;
  subtitleTestID?: string;
  subtitleColor?: string;
  renderImageContent?: (shrinkage: number) => React.ReactNode;
  img?: ImageURISource;
  imageAccessibilityLabel?: string;
}

interface RenderCardBodyArgs {
  shrinkage: number;
  content: CardBodyContent;
  theme: ReturnType<typeof useTheme>["theme"];
}

function renderCardBody(args: RenderCardBodyArgs): React.ReactNode {
  const { shrinkage, content, theme } = args;
  const {
    title,
    titleTestID,
    subtitle,
    subtitleTestID,
    subtitleColor,
    renderImageContent,
    img,
    imageAccessibilityLabel,
  } = content;

  let imageContent: React.ReactNode = null;
  if (shrinkage < 0.3) {
    if (renderImageContent != null) {
      imageContent = renderImageContent(shrinkage);
    } else if (img != null) {
      imageContent = (
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
      );
    }
  }

  return (
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
      {imageContent}
    </>
  );
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
  renderImageContent,
  onPress,
  renderCompactContent,
}: ListPanelProps<T>) => {
  const { theme } = useTheme();

  const listButtonArray: { rowKey: string; elements: React.ReactNode[] }[] = [];
  let subArray: React.ReactNode[] = [];
  let subArrayKey = "";

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
    if (subArray.length === 0) {
      subArrayKey = key;
    }
    const title = getTitle(item, i);
    const titleTestID = getTitleTestID?.(item, i);
    const subtitle = getSubtitle?.(item, i);
    const subtitleTestID = getSubtitleTestID?.(item, i);
    const subtitleColor = getSubtitleColor?.(item, i);
    const img = getCardImage?.(item, i);
    const imageAccessibilityLabel = getImageAccessibilityLabel?.(item, i);
    let cardRenderImageContent:
      | ((shrinkage: number) => React.ReactNode)
      | undefined;
    if (renderImageContent != null) {
      cardRenderImageContent = (s) => renderImageContent(item, i, s);
    }

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
            {renderCompactContent != null && shrinkage >= 0.6
              ? renderCompactContent(item, i, shrinkage)
              : renderCardBody({
                  shrinkage,
                  content: {
                    title,
                    titleTestID,
                    subtitle,
                    subtitleTestID,
                    subtitleColor,
                    renderImageContent: cardRenderImageContent,
                    img,
                    imageAccessibilityLabel,
                  },
                  theme,
                })}
          </Card>
        </TouchableOpacity>
      </View>,
    );

    if ((i + 1) % columnCount === 0) {
      listButtonArray.push({ rowKey: subArrayKey, elements: subArray });
      subArray = [];
      subArrayKey = "";
    }
  }

  if (subArray.length > 0) {
    listButtonArray.push({ rowKey: subArrayKey, elements: subArray });
  }

  return (
    <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
      {listButtonArray.map((row) => (
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
          }}
          key={row.rowKey}
        >
          {row.elements}
        </View>
      ))}
    </View>
  );
};

export default ListPanel;
