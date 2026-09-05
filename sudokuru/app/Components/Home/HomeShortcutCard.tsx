import React from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { IconButton, Surface, Text } from "react-native-paper";
import type { HomeDashboardCardDescriptor } from "./HomeDashboard";
import { useTheme } from "../../Contexts/ThemeContext";

interface HomeShortcutCardProps {
  shortcut: HomeDashboardCardDescriptor;
  width: number;
  height: number;
  index: number;
  columns: number;
  total: number;
  gap: number;
  editing: boolean;
  onPress: () => void;
  onRemove: () => void;
  onDragPreview: (shortcutId: string, toIndex: number) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
}

const getGridPosition = (
  index: number,
  columns: number,
  width: number,
  height: number,
  gap: number,
) => ({
  x: (index % columns) * (width + gap),
  y: Math.floor(index / columns) * (height + gap),
});

const HomeShortcutCard = ({
  shortcut,
  width,
  height,
  index,
  columns,
  total,
  gap,
  editing,
  onPress,
  onRemove,
  onDragPreview,
  onDragEnd,
  onDragCancel,
}: HomeShortcutCardProps) => {
  const { theme } = useTheme();
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;
  const primaryButtonTextColor = theme.useDarkTheme
    ? theme.semantic.text.info
    : theme.semantic.text.inverse;
  const [focused, setFocused] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [pan] = React.useState(() => new Animated.ValueXY());
  const [position] = React.useState(
    () =>
      new Animated.ValueXY(getGridPosition(index, columns, width, height, gap)),
  );
  const dragStartIndex = React.useRef(index);
  const lastPreviewIndex = React.useRef(index);
  const dragOrigin = React.useRef(
    getGridPosition(index, columns, width, height, gap),
  );
  const latestProps = React.useRef({
    index,
    columns,
    total,
    gap,
    width,
    height,
    editing,
    onDragPreview,
    onDragEnd,
    onDragCancel,
  });

  React.useEffect(() => {
    latestProps.current = {
      index,
      columns,
      total,
      gap,
      width,
      height,
      editing,
      onDragPreview,
      onDragEnd,
      onDragCancel,
    };
  });

  React.useEffect(() => {
    const targetPosition = getGridPosition(index, columns, width, height, gap);
    if (!editing) {
      position.setValue(targetPosition);
      return;
    }
    if (dragging) return;

    Animated.timing(position, {
      toValue: targetPosition,
      duration: 110,
      useNativeDriver: false,
    }).start();
  }, [columns, dragging, editing, gap, height, index, position, width]);

  // PanResponder stores these callbacks and does not invoke them during render.
  // eslint-disable-next-line react-hooks/refs
  const [panResponder] = React.useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        const { editing: canDrag } = latestProps.current;
        return canDrag && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 6;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        const {
          index: currentIndex,
          columns: columnCount,
          width: cardWidth,
          height: cardHeight,
          gap: cardGap,
        } = latestProps.current;
        const origin = getGridPosition(
          currentIndex,
          columnCount,
          cardWidth,
          cardHeight,
          cardGap,
        );
        position.stopAnimation();
        position.setValue(origin);
        dragOrigin.current = origin;
        dragStartIndex.current = currentIndex;
        lastPreviewIndex.current = currentIndex;
        pan.setValue({ x: 0, y: 0 });
        setDragging(true);
      },
      onPanResponderMove: (_, gesture) => {
        const {
          columns: columnCount,
          total: itemCount,
          gap: cardGap,
          width: cardWidth,
          height: cardHeight,
          onDragPreview: handleDragPreview,
        } = latestProps.current;
        const startIndex = dragStartIndex.current;
        const startRow = Math.floor(startIndex / columnCount);
        const startColumn = startIndex % columnCount;
        const rawColumn =
          (startColumn * (cardWidth + cardGap) + gesture.dx) /
          (cardWidth + cardGap);
        const rawRow =
          (startRow * (cardHeight + cardGap) + gesture.dy) /
          (cardHeight + cardGap);
        const lastRow = Math.floor(lastPreviewIndex.current / columnCount);
        const lastColumn = lastPreviewIndex.current % columnCount;
        let targetColumn = lastColumn;
        let targetRow = lastRow;

        while (rawColumn > targetColumn + 0.6) targetColumn += 1;
        while (rawColumn < targetColumn - 0.6) targetColumn -= 1;
        while (rawRow > targetRow + 0.6) targetRow += 1;
        while (rawRow < targetRow - 0.6) targetRow -= 1;

        targetColumn = Math.max(0, Math.min(columnCount - 1, targetColumn));
        targetRow = Math.max(0, targetRow);
        const targetIndex = Math.min(
          itemCount - 1,
          targetRow * columnCount + targetColumn,
        );
        pan.setValue({ x: gesture.dx, y: gesture.dy });

        if (targetIndex !== lastPreviewIndex.current) {
          lastPreviewIndex.current = targetIndex;
          handleDragPreview(shortcut.id, targetIndex);
        }
      },
      onPanResponderRelease: () => {
        const {
          columns: columnCount,
          width: cardWidth,
          height: cardHeight,
          gap: cardGap,
          onDragEnd: handleDragEnd,
        } = latestProps.current;
        handleDragEnd();
        const targetPosition = getGridPosition(
          lastPreviewIndex.current,
          columnCount,
          cardWidth,
          cardHeight,
          cardGap,
        );

        Animated.spring(pan, {
          toValue: {
            x: targetPosition.x - dragOrigin.current.x,
            y: targetPosition.y - dragOrigin.current.y,
          },
          useNativeDriver: false,
          speed: 24,
          bounciness: 4,
        }).start(() => {
          position.setValue(targetPosition);
          pan.setValue({ x: 0, y: 0 });
          setDragging(false);
        });
      },
      onPanResponderTerminate: () => {
        latestProps.current.onDragCancel();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start(() => setDragging(false));
      },
    }),
  );

  const compact = height < 104;
  const cardContent = (
    <>
      <View
        style={{
          width: compact ? 36 : 44,
          height: compact ? 36 : 44,
          flexShrink: 0,
          borderRadius: 11,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.bg,
        }}
      >
        <MaterialCommunityIcons
          name={shortcut.icon}
          size={compact ? 22 : 27}
          color={theme.colors.primary}
        />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        {shortcut.badge ? (
          <Text
            selectable={false}
            numberOfLines={1}
            variant="labelSmall"
            style={{
              marginBottom: 1,
              color: theme.colors.primary,
              fontWeight: "800",
            }}
          >
            {shortcut.badge.toUpperCase()}
          </Text>
        ) : null}
        <Text
          selectable={false}
          numberOfLines={1}
          variant={compact ? "titleSmall" : "titleMedium"}
          style={{
            color: cardTextColor,
            fontWeight: "800",
          }}
        >
          {shortcut.title}
        </Text>
        {!compact ? (
          <Text
            selectable={false}
            numberOfLines={2}
            variant="bodySmall"
            style={{
              marginTop: 3,
              color: cardTextColor,
              opacity: 0.68,
            }}
          >
            {shortcut.description}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (!editing) {
    return (
      <Pressable
        testID={shortcut.testID}
        accessibilityRole="button"
        accessibilityLabel={shortcut.title}
        accessibilityHint={shortcut.description}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPress={onPress}
        style={{ width, height }}
      >
        {({ hovered, pressed }: any) => (
          <Surface
            testID={`${shortcut.testID}Surface`}
            elevation={pressed ? 1 : 3}
            style={{
              width: "100%",
              height: "100%",
              padding: compact ? 12 : 16,
              flexDirection: "row",
              alignItems: "center",
              gap: compact ? 10 : 14,
              borderRadius: 14,
              borderWidth: hovered || focused ? 2 : 1,
              borderColor:
                hovered || focused ? theme.colors.primary : theme.colors.border,
              backgroundColor: cardSurfaceColor,
              opacity: pressed ? 0.8 : 1,
            }}
          >
            {cardContent}
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={theme.colors.primary}
            />
          </Surface>
        )}
      </Pressable>
    );
  }

  return (
    <Animated.View
      testID={`Editing${shortcut.testID}`}
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width,
        height,
        zIndex: dragging ? 10 : 1,
        userSelect: "none",
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { scale: dragging ? 1.04 : 1 },
        ],
      }}
    >
      <Surface
        elevation={dragging ? 5 : 3}
        style={{
          width: "100%",
          height: "100%",
          userSelect: "none",
          padding: compact ? 12 : 16,
          paddingRight: compact ? 30 : 36,
          flexDirection: "row",
          alignItems: "center",
          gap: compact ? 10 : 14,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: theme.colors.primary,
          backgroundColor: cardSurfaceColor,
        }}
      >
        {cardContent}
        <MaterialCommunityIcons
          name="drag"
          size={20}
          color={theme.colors.primary}
          style={{ position: "absolute", right: 9 }}
        />
      </Surface>
      <IconButton
        testID={`Remove${shortcut.testID}`}
        accessibilityLabel={`Remove ${shortcut.title}`}
        icon="minus"
        size={17}
        iconColor={primaryButtonTextColor}
        containerColor={theme.colors.primary}
        style={{
          position: "absolute",
          top: -11,
          right: -11,
          width: 28,
          height: 28,
          margin: 0,
        }}
        onPress={onRemove}
      />
    </Animated.View>
  );
};

export default HomeShortcutCard;
