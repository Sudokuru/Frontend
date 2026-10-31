import React from "react";
import { Animated, PanResponder } from "react-native";
import type { HomeShortcutId } from "../../Api/HomeShortcuts";

export interface HomeShortcutDragOptions {
  shortcutId: HomeShortcutId;
  width: number;
  height: number;
  index: number;
  columns: number;
  total: number;
  gap: number;
  editing: boolean;
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
  const [pan] = React.useState(() => new Animated.ValueXY());
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
  const latestOptions = React.useRef(options);

  React.useEffect(() => {
    latestOptions.current = options;
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
      // Claim the touch as soon as it starts on an editing card so the drag
      // owns the gesture for its entire lifetime. Native scroll views claim
      // vertical pans before any move threshold is reached, so the parent
      // ScrollView is locked through the onCardTouchStart/onCardTouchEnd
      // callbacks below while a card is being touched. The Remove button is
      // not affected: it sits deeper in the tree and claims the responder
      // before these handlers are consulted.
      onStartShouldSetPanResponder: () => latestOptions.current.editing,
      onMoveShouldSetPanResponder: (_, gesture) => {
        const { editing: canDrag } = latestOptions.current;
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
        pan.setValue({ x: 0, y: 0 });
        dragStarted.current = false;
        handleCardTouchStart();
      },
      onPanResponderMove: (_, gesture) => {
        const {
          shortcutId,
          columns: columnCount,
          total: itemCount,
          gap: cardGap,
          width: cardWidth,
          height: cardHeight,
          onDragPreview: handleDragPreview,
        } = latestOptions.current;
        // Keep the drag visuals and preview behind the same move threshold
        // that used to gate the responder claim.
        if (!dragStarted.current) {
          if (Math.abs(gesture.dx) + Math.abs(gesture.dy) <= 6) return;
          dragStarted.current = true;
          setDragging(true);
        }
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
          handleDragPreview(shortcutId, targetIndex);
        }
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
        handleCardTouchEnd();
        // Touches that never crossed the move threshold were taps, not
        // drags: there is nothing to settle or persist.
        if (!dragStarted.current) return;
        dragStarted.current = false;
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
        handleCardTouchEnd();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start(() => setDragging(false));
      },
    }),
  );

  return { dragging, pan, position, panHandlers: panResponder.panHandlers };
};
