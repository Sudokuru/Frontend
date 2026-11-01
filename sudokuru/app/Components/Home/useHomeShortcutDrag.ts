import React from "react";
import {
  AccessibilityInfo,
  Animated,
  PanResponder,
  Platform,
} from "react-native";
import type { HomeShortcutId } from "../../Api/HomeShortcuts";

export interface HomeShortcutDragOptions {
  shortcutId: HomeShortcutId;
  width: number;
  height: number;
  index: number;
  columns: number;
  total: number;
  gap: number;
  getScrollOffset: () => number;
  editing: boolean;
  onDragStart: (onScroll: (offset: number) => void) => void;
  onDragPosition: (pointerY: number) => void;
  onDragPreview: (shortcutId: HomeShortcutId, toIndex: number) => void;
  onDragEnd: () => void;
  onDragCancel: () => void;
  onCardTouchStart: () => void;
  onCardTouchEnd: () => void;
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

export const useHomeShortcutDrag = (options: HomeShortcutDragOptions) => {
  const { index, columns, width, height, gap, editing } = options;
  const [dragging, setDragging] = React.useState(false);
  const [holding, setHolding] = React.useState(false);
  const [pan] = React.useState(() => new Animated.ValueXY());
  const [wiggle] = React.useState(() => new Animated.Value(0));
  const [position] = React.useState(
    () =>
      new Animated.ValueXY(getGridPosition(index, columns, width, height, gap)),
  );
  const dragStartIndex = React.useRef(index);
  const lastPreviewIndex = React.useRef(index);
  const dragStarted = React.useRef(false);
  const dragOrigin = React.useRef(
    getGridPosition(index, columns, width, height, gap),
  );
  const dragStartScrollOffset = React.useRef(options.getScrollOffset());
  const lastGesture = React.useRef<{ dx: number; dy: number } | null>(null);
  const latestOptions = React.useRef(options);
  const holdTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchArmed = React.useRef(false);
  const touchGesture = React.useRef(false);

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    if (touchArmed.current) latestOptions.current.onCardTouchEnd();
    touchArmed.current = false;
    touchGesture.current = false;
    setHolding(false);
  };

  React.useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  React.useEffect(() => {
    if (!holding) {
      wiggle.stopAnimation();
      wiggle.setValue(0);
      return;
    }
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reducedMotion) => {
      if (!active || reducedMotion) return;
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(wiggle, {
            toValue: -1,
            duration: 95,
            useNativeDriver: false,
          }),
          Animated.timing(wiggle, {
            toValue: 1,
            duration: 190,
            useNativeDriver: false,
          }),
          Animated.timing(wiggle, {
            toValue: 0,
            duration: 95,
            useNativeDriver: false,
          }),
        ]),
      );
      animation.start();
    });
    return () => {
      active = false;
      animation?.stop();
      wiggle.setValue(0);
    };
  }, [holding, wiggle]);

  React.useEffect(() => {
    latestOptions.current = options;
  });

  const updateDrag = React.useCallback(
    (dx: number, dy: number, currentScrollOffset: number) => {
      const {
        shortcutId,
        columns: columnCount,
        total: itemCount,
        gap: cardGap,
        width: cardWidth,
        height: cardHeight,
        onDragPreview: handleDragPreview,
      } = latestOptions.current;
      const scrollDelta = currentScrollOffset - dragStartScrollOffset.current;
      const startIndex = dragStartIndex.current;
      const startRow = Math.floor(startIndex / columnCount);
      const startColumn = startIndex % columnCount;
      const rawColumn =
        (startColumn * (cardWidth + cardGap) + dx) / (cardWidth + cardGap);
      const rawRow =
        (startRow * (cardHeight + cardGap) + dy + scrollDelta) /
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
      // Scrolling moves the grid under the finger, so compensate the card's
      // position even while the finger is stationary at the viewport edge.
      pan.setValue({ x: dx, y: dy + scrollDelta });

      if (targetIndex !== lastPreviewIndex.current) {
        lastPreviewIndex.current = targetIndex;
        handleDragPreview(shortcutId, targetIndex);
      }
    },
    [pan],
  );

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
      // Mouse drags begin immediately. Touches leave scrolling available until
      // a stationary long press arms the card; movement before then cancels it.
      onStartShouldSetPanResponder: (event) => {
        if (!latestOptions.current.editing) return false;
        const isTouch =
          Platform.OS !== "web" ||
          ("type" in event.nativeEvent &&
            event.nativeEvent.type === "touchstart");
        if (!isTouch) return true;
        touchGesture.current = true;
        holdTimer.current = setTimeout(() => {
          holdTimer.current = null;
          touchArmed.current = true;
          latestOptions.current.onCardTouchStart();
          setHolding(true);
        }, 400);
        return false;
      },
      onMoveShouldSetPanResponder: (_, gesture) => {
        const { editing: canDrag } = latestOptions.current;
        if (!canDrag) return false;
        if (touchGesture.current && !touchArmed.current) {
          if (Math.abs(gesture.dx) + Math.abs(gesture.dy) > 8) clearHold();
          return false;
        }
        return (
          touchArmed.current && Math.abs(gesture.dx) + Math.abs(gesture.dy) > 6
        );
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: () => {
        const {
          index: currentIndex,
          columns: columnCount,
          width: cardWidth,
          height: cardHeight,
          gap: cardGap,
          getScrollOffset,
          onDragStart: handleDragStart,
          onCardTouchStart: handleCardTouchStart,
        } = latestOptions.current;
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
        dragStartScrollOffset.current = getScrollOffset();
        lastGesture.current = null;
        pan.setValue({ x: 0, y: 0 });
        dragStarted.current = false;
        if (!touchArmed.current) handleCardTouchStart();
        handleDragStart((offset) => {
          if (dragStarted.current && lastGesture.current) {
            updateDrag(lastGesture.current.dx, lastGesture.current.dy, offset);
          }
        });
      },
      onPanResponderMove: (_, gesture) => {
        // Keep the drag visuals and preview behind the same move threshold
        // that used to gate the responder claim.
        if (!dragStarted.current) {
          if (Math.abs(gesture.dx) + Math.abs(gesture.dy) <= 6) return;
          dragStarted.current = true;
          setDragging(true);
        }
        lastGesture.current = { dx: gesture.dx, dy: gesture.dy };
        updateDrag(
          gesture.dx,
          gesture.dy,
          latestOptions.current.getScrollOffset(),
        );
        latestOptions.current.onDragPosition(gesture.moveY);
      },
      onPanResponderRelease: () => {
        const {
          columns: columnCount,
          width: cardWidth,
          height: cardHeight,
          gap: cardGap,
          onDragEnd: handleDragEnd,
          onCardTouchEnd: handleCardTouchEnd,
        } = latestOptions.current;
        if (touchArmed.current) clearHold();
        else handleCardTouchEnd();
        lastGesture.current = null;
        // Touches that never crossed the move threshold were taps, not
        // drags: there is nothing to settle or persist.
        if (!dragStarted.current) return;
        dragStarted.current = false;
        lastGesture.current = null;
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
        const {
          onDragCancel: handleDragCancel,
          onCardTouchEnd: handleCardTouchEnd,
        } = latestOptions.current;
        dragStarted.current = false;
        handleDragCancel();
        if (touchArmed.current) clearHold();
        else handleCardTouchEnd();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start(() => setDragging(false));
      },
    }),
  );

  return {
    dragging,
    holding,
    wiggle,
    pan,
    position,
    panHandlers: {
      ...panResponder.panHandlers,
      onTouchEnd: () => {
        if (touchGesture.current) clearHold();
      },
      onTouchCancel: () => {
        if (touchGesture.current) clearHold();
      },
    },
  };
};
