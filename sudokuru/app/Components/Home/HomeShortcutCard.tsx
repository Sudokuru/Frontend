import React from "react";
import { Animated, Pressable, View } from "react-native";
import type { TextStyle, ViewStyle } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { IconButton, Surface, Text } from "react-native-paper";
import type { HomeDashboardCardDescriptor } from "./HomeDashboard";
import { useTheme } from "../../Contexts/ThemeContext";
import { useHomeShortcutDrag } from "./useHomeShortcutDrag";
import type { HomeShortcutDragOptions } from "./useHomeShortcutDrag";

// React Native Web also supports this text-style property on Views.
const nonSelectableStyle: ViewStyle & Pick<TextStyle, "userSelect"> = {
  userSelect: "none",
};

// Touches that start on an editing card must drive the drag instead of the
// browser's native page scrolling, which otherwise claims the gesture on
// touch devices and cancels the drag. This is the web equivalent of the
// native `onShouldBlockNativeResponder` callback below.
const draggableStyle: ViewStyle & Pick<TextStyle, "userSelect"> = {
  ...nonSelectableStyle,
  touchAction: "none",
};

interface HomeShortcutCardProps
  extends Omit<HomeShortcutDragOptions, "shortcutId"> {
  shortcut: HomeDashboardCardDescriptor;
  onPress: () => void;
  onRemove: () => void;
}

const HomeShortcutCardContent = ({
  shortcut,
  compact,
}: {
  shortcut: HomeDashboardCardDescriptor;
  compact: boolean;
}) => {
  const { theme } = useTheme();
  const textColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

  return (
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
          style={{ color: textColor, fontWeight: "800" }}
        >
          {shortcut.title}
        </Text>
        {!compact ? (
          <Text
            selectable={false}
            numberOfLines={2}
            variant="bodySmall"
            style={{ marginTop: 3, color: textColor, opacity: 0.68 }}
          >
            {shortcut.description}
          </Text>
        ) : null}
      </View>
    </>
  );
};

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
  onCardTouchStart,
  onCardTouchEnd,
}: HomeShortcutCardProps) => {
  const { theme } = useTheme();
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const primaryButtonTextColor = theme.useDarkTheme
    ? theme.semantic.text.info
    : theme.semantic.text.inverse;
  const [focused, setFocused] = React.useState(false);
  const { dragging, pan, position, panHandlers } = useHomeShortcutDrag({
    shortcutId: shortcut.id,
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
    onCardTouchStart,
    onCardTouchEnd,
  });

  const compact = height < 104;
  const cardContent = (
    <HomeShortcutCardContent shortcut={shortcut} compact={compact} />
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
        {({ hovered, pressed }) => (
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
      {...panHandlers}
      style={[
        draggableStyle,
        {
          position: "absolute",
          left: position.x,
          top: position.y,
          width,
          height,
          zIndex: dragging ? 10 : 1,
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: dragging ? 1.04 : 1 },
          ],
        },
      ]}
    >
      <Surface
        elevation={dragging ? 5 : 3}
        style={[
          nonSelectableStyle,
          {
            width: "100%",
            height: "100%",
            padding: compact ? 12 : 16,
            paddingRight: compact ? 30 : 36,
            flexDirection: "row",
            alignItems: "center",
            gap: compact ? 10 : 14,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            backgroundColor: cardSurfaceColor,
          },
        ]}
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
