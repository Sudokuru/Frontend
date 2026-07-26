import React, { useCallback, useRef } from "react";
import {
  FlatList,
  FlatListProps,
  Platform,
  ScrollView,
  ScrollViewProps,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const ARROW_KEY_SCROLL_DISTANCE = 40;

type FocusableScrollContainer = {
  clientHeight?: number;
  focus?: () => void;
  getNativeScrollRef?: () => FocusableScrollContainer | null;
  scrollHeight?: number;
  scrollTop?: number;
};

const getNativeScrollContainer = (
  scrollContainer: FocusableScrollContainer | null,
) => {
  return scrollContainer?.getNativeScrollRef?.() ?? scrollContainer;
};

const useFocusScrollContainerOnWeb = (
  scrollContainerRef: React.RefObject<FocusableScrollContainer | null>,
) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "web") return;

      const nativeScrollContainer = getNativeScrollContainer(
        scrollContainerRef.current,
      );
      nativeScrollContainer?.focus?.();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        ) {
          return;
        }

        const eventTarget = event.target;
        if (
          eventTarget instanceof HTMLElement &&
          (eventTarget.isContentEditable ||
            ["INPUT", "SELECT", "TEXTAREA"].includes(eventTarget.tagName))
        ) {
          return;
        }

        const scrollDistance =
          event.key === "ArrowDown"
            ? ARROW_KEY_SCROLL_DISTANCE
            : event.key === "ArrowUp"
              ? -ARROW_KEY_SCROLL_DISTANCE
              : 0;
        const scrollContainer = getNativeScrollContainer(
          scrollContainerRef.current,
        );

        if (
          scrollDistance === 0 ||
          scrollContainer?.scrollTop === undefined ||
          scrollContainer.scrollHeight === undefined ||
          scrollContainer.clientHeight === undefined ||
          scrollContainer.scrollHeight <= scrollContainer.clientHeight
        ) {
          return;
        }

        event.preventDefault();
        scrollContainer.scrollTop += scrollDistance;
      };

      globalThis.addEventListener("keydown", handleKeyDown);
      return () => globalThis.removeEventListener("keydown", handleKeyDown);
    }, [scrollContainerRef]),
  );
};

export const PageScrollView = (props: ScrollViewProps) => {
  const scrollContainerRef = useRef<ScrollView>(null);
  useFocusScrollContainerOnWeb(
    scrollContainerRef as React.RefObject<FocusableScrollContainer | null>,
  );

  return (
    <ScrollView
      {...props}
      ref={scrollContainerRef}
      tabIndex={Platform.OS === "web" ? (props.tabIndex ?? 0) : props.tabIndex}
    />
  );
};

export const PageFlatList = <ItemT,>(props: FlatListProps<ItemT>) => {
  const scrollContainerRef = useRef<FlatList<ItemT>>(null);
  useFocusScrollContainerOnWeb(
    scrollContainerRef as React.RefObject<FocusableScrollContainer | null>,
  );

  return (
    <FlatList
      {...props}
      ref={scrollContainerRef}
      tabIndex={Platform.OS === "web" ? (props.tabIndex ?? 0) : props.tabIndex}
    />
  );
};
