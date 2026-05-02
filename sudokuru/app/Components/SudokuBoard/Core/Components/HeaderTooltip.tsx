import React, { useRef, useState } from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import { Portal, Text } from "react-native-paper";
import { useTheme } from "../../../../Contexts/ThemeContext";

interface HeaderTooltipProps {
  title: string;
  children: React.ReactElement;
}

const TOOLTIP_HEIGHT = 32;
const FADE_DURATION = 300;
const AUTO_HIDE_DELAY = 1500;

const HeaderTooltip = ({ title, children }: HeaderTooltipProps) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, height: 0 });
  const ref = useRef<View>(null);
  const isWeb = Platform.OS === "web";
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const fadeOut = () => {
    clearHideTimer();
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const fadeIn = (autoHide: boolean) => {
    clearHideTimer();
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (autoHide) {
        hideTimer.current = setTimeout(fadeOut, AUTO_HIDE_DELAY);
      }
    });
  };

  const show = (autoHide = false) => {
    ref.current?.measure((_fx, _fy, _width, height, px, py) => {
      setPos({ x: px, y: py, height });
      fadeIn(autoHide);
    });
  };

  const toggle = () => {
    if (visible) {
      fadeOut();
    } else {
      show(true);
    }
  };

  const hide = () => fadeOut();

  const webProps = isWeb
    ? { onHoverIn: () => show(false), onHoverOut: hide }
    : {};

  const tooltipTop =
    pos.y - TOOLTIP_HEIGHT - 4 >= 0
      ? pos.y - TOOLTIP_HEIGHT - 4
      : pos.y + pos.height + 4;

  return (
    <>
      {visible && (
        <Portal>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: tooltipTop,
              left: pos.x,
              backgroundColor: theme.colors.surfaceAlt,
              paddingHorizontal: 12,
              height: TOOLTIP_HEIGHT,
              justifyContent: "center",
              borderRadius: 4,
              opacity,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: theme.semantic.text.inverse,
                fontSize: 12,
              }}
            >
              {title}
            </Text>
          </Animated.View>
        </Portal>
      )}
      <Pressable
        ref={ref}
        onPress={toggle}
        onLongPress={isWeb ? undefined : () => show(true)}
        android_disableSound
        style={isWeb ? ({ cursor: "default" } as object) : undefined}
        {...webProps}
      >
        {children}
      </Pressable>
    </>
  );
};

export default HeaderTooltip;
