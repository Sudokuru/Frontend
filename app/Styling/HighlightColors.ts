export const NOT_SELECTED_CONFLICT_COLOR = "#FFC3BF";
export const SELECTED_CONFLICT_COLOR = "#FF7C75";
export const PEER_SELECTED_COLOR = "#C5DDF4";
export const IDENTICAL_VALUE_COLOR = "#C8DCC4";
export const SELECTED_COLOR = "#9CC4EC";
export const REMOVE_NOTE_TEXT_COLOR = "#FF0000";
export const PLACE_NOTE_TEXT_COLOR = "#F2CA7E";
export const NOTE_TEXT_COLOR = "#000000";
export const NOT_HIGHLIGHTED_COLOR = "#FFFFFF";

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
function RGB(hex: string): string {
  const rgb = hexToRGB(hex);
  if (rgb === null) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export const NOT_SELECTED_CONFLICT_COLOR_RGB = RGB(NOT_SELECTED_CONFLICT_COLOR);
export const SELECTED_CONFLICT_COLOR_RGB = RGB(SELECTED_CONFLICT_COLOR);
export const PEER_SELECTED_COLOR_RGB = RGB(PEER_SELECTED_COLOR);
export const IDENTICAL_VALUE_COLOR_RGB = RGB(IDENTICAL_VALUE_COLOR);
export const SELECTED_COLOR_RGB = RGB(SELECTED_COLOR);
export const REMOVE_NOTE_TEXT_COLOR_RGB = RGB(REMOVE_NOTE_TEXT_COLOR);
export const PLACE_NOTE_TEXT_COLOR_RGB = RGB(PLACE_NOTE_TEXT_COLOR);
export const NOTE_TEXT_COLOR_RGB = RGB(NOTE_TEXT_COLOR);
export const NOT_HIGHLIGHTED_COLOR_RGB = RGB(NOT_HIGHLIGHTED_COLOR);
