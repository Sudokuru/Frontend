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

const IMAGE_HIDE_SHRINKAGE_THRESHOLD = 0.3;
const COMPACT_CONTENT_SHRINKAGE_THRESHOLD = 0.6;
const CARD_HEIGHT_ASPECT_RATIO = 3 / 5;
const MAX_HEIGHT_RATIO = 0.7;
const MAX_SHRINKAGE = 0.99;
const SHRINKAGE_ROUNDING_FACTOR = 100;
const CARD_MARGIN = 5;

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
  if (shrinkage < IMAGE_HIDE_SHRINKAGE_THRESHOLD) {
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
    <View>
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
      {shrinkage < COMPACT_CONTENT_SHRINKAGE_THRESHOLD && subtitle != null ? (
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
    </View>
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

  const cardHeight = CARD_WIDTH * CARD_HEIGHT_ASPECT_RATIO;
  const columnCount = Math.max(
    1,
    calculateCardsPerRow(width, height, items.length),
  );
  const rowCount = getRowCount(items.length, columnCount);
  const unshrunkHeight =
    rowCount * cardHeight + (rowCount > 0 ? (rowCount - 1) * CARD_PADDING : 0);
  const maxAllowedHeight = height * MAX_HEIGHT_RATIO;
  const rawShrinkage =
    unshrunkHeight > 0 ? 1 - maxAllowedHeight / unshrunkHeight : 0;
  const shrinkage = Math.min(
    MAX_SHRINKAGE,
    Math.max(
      0,
      Math.ceil(rawShrinkage * SHRINKAGE_ROUNDING_FACTOR) /
        SHRINKAGE_ROUNDING_FACTOR,
    ),
  );

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
          margin: CARD_MARGIN,
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
            {renderCompactContent != null &&
            shrinkage >= COMPACT_CONTENT_SHRINKAGE_THRESHOLD
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
