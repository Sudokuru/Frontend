import React from "react";
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from "react-native";

// Scroll a ScrollView when a dragged pointer approaches either viewport edge.
// The drag's onScroll callback keeps its position in sync as the content moves.
export const useDragAutoScroll = (
  viewportHeight: number,
  {
    onDragEnd,
    onDragCancel,
  }: { onDragEnd: () => void; onDragCancel: () => void },
) => {
  const [isTouchHeld, setIsTouchHeld] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollViewInstance>(null);
  const scrollOffset = React.useRef(0);
  const activeDragScroll = React.useRef<((offset: number) => void) | null>(
    null,
  );
  const contentHeight = React.useRef(0);
  const viewport = React.useRef({ top: 0, height: viewportHeight });
  const pointerY = React.useRef<number | null>(null);
  const frame = React.useRef<number | null>(null);

  const stopAutoScroll = React.useCallback(() => {
    pointerY.current = null;
    activeDragScroll.current = null;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const reset = React.useCallback(() => {
    stopAutoScroll();
    scrollOffset.current = 0;
    contentHeight.current = 0;
    setIsTouchHeld(false);
  }, [stopAutoScroll]);

  const autoScroll = React.useCallback(function step() {
    const y = pointerY.current;
    if (y === null) {
      frame.current = null;
      return;
    }
    const { top, height } = viewport.current;
    const edge = Math.min(80, height / 4);
    const distanceFromTop = y - top;
    const distanceFromBottom = top + height - y;
    let direction = 0;
    if (distanceFromTop < edge) {
      direction = -Math.min(1, (edge - distanceFromTop) / edge);
    } else if (distanceFromBottom < edge) {
      direction = Math.min(1, (edge - distanceFromBottom) / edge);
    }
    const maxOffset = Math.max(0, contentHeight.current - height);
    const nextOffset = Math.max(
      0,
      Math.min(maxOffset, scrollOffset.current + direction * 14),
    );
    if (nextOffset !== scrollOffset.current) {
      scrollViewRef.current?.scrollTo({ y: nextOffset, animated: false });
    }
    frame.current = direction === 0 ? null : requestAnimationFrame(step);
  }, []);

  React.useEffect(() => stopAutoScroll, [stopAutoScroll]);

  const onDragStart = (onScroll: (offset: number) => void) => {
    stopAutoScroll();
    activeDragScroll.current = onScroll;
    scrollViewRef.current?.measureInWindow((_, top, __, height) => {
      viewport.current = { top, height };
    });
  };

  const onDragPosition = (y: number) => {
    pointerY.current = y;
    if (frame.current === null) {
      frame.current = requestAnimationFrame(autoScroll);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    if (offset === scrollOffset.current) return;
    scrollOffset.current = offset;
    activeDragScroll.current?.(offset);
  };

  return {
    stopAutoScroll,
    scrollViewProps: {
      ref: scrollViewRef,
      scrollEnabled: !isTouchHeld,
      scrollEventThrottle: 16,
      onScroll,
      onContentSizeChange: (_: number, height: number) => {
        contentHeight.current = height;
      },
    },
    dragProps: {
      getScrollOffset: () => scrollOffset.current,
      onDragStart,
      onDragPosition,
      onDragEnd: () => {
        stopAutoScroll();
        onDragEnd();
      },
      onDragCancel: () => {
        stopAutoScroll();
        setIsTouchHeld(false);
        onDragCancel();
      },
      onCardTouchStart: () => setIsTouchHeld(true),
      onCardTouchEnd: () => setIsTouchHeld(false),
    },
    reset,
  };
};
