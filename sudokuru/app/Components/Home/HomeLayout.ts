const HOME_MAX_WIDTH = 1160;
const HOME_MOBILE_BREAKPOINT = 760;

export const getHomeLayout = (
  windowSize: { width: number; height: number },
  shortcutCount: number,
) => {
  const isMobile = windowSize.width < HOME_MOBILE_BREAKPOINT;
  const isShort = windowSize.height < 590;
  let outerPadding = isMobile ? 16 : 24;
  if (isShort) outerPadding = 10;
  const gap = isShort ? 8 : 12;
  const contentWidth = Math.min(
    HOME_MAX_WIDTH,
    Math.max(windowSize.width - outerPadding * 2, 0),
  );
  const columnCount = isMobile ? 1 : Math.min(4, Math.max(2, shortcutCount));
  const rowCount = Math.ceil(shortcutCount / columnCount);
  const cardHeight = isMobile ? 116 : 130;

  return {
    isMobile,
    isShort,
    outerPadding,
    gap,
    contentWidth,
    columnCount,
    cardHeight,
    cardWidth: (contentWidth - gap * (columnCount - 1)) / columnCount,
    gridHeight: rowCount > 0 ? cardHeight * rowCount + gap * (rowCount - 1) : 0,
    editingHeaderHeight: isShort ? 66 : 78,
  };
};
