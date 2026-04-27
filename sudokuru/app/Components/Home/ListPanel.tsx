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
  const titleColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

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
    <View>
      <Text
        variant="headlineMedium"
        testID={titleTestID}
        style={{
          alignSelf: "center",
          color: titleColor,
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
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.bg;

  const listButtonArray: { rowKey: string; elements: React.ReactNode[] }[] = [];
  let subArray: React.ReactNode[] = [];
  let subArrayKey = "";

  const cardHeight = (CARD_WIDTH * 3) / 5;
  const columnCount = Math.max(
    1,
    calculateCardsPerRow(width, height, items.length),
  );
  const rowCount = getRowCount(items.length, columnCount);
  const unshrunkHeight =
    rowCount * cardHeight + (rowCount > 0 ? (rowCount - 1) * CARD_PADDING : 0);
  const maxAllowedHeight = height * 0.7;
  const rawShrinkage =
    unshrunkHeight > 0 ? 1 - maxAllowedHeight / unshrunkHeight : 0;
  const shrinkage = Math.min(
    0.99,
    Math.max(0, Math.ceil(rawShrinkage * 100) / 100),
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
          margin: 5,
        }}
      >
        <TouchableOpacity onPress={() => onPress(item, i)}>
          <Card
            mode="outlined"
            theme={{
              colors: {
                surface: cardSurfaceColor,
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
