export const NOT_SELECTED_CONFLICT_COLOR = "#FFC3BF";
export const SELECTED_CONFLICT_COLOR = "#FF7C75";
export const PEER_SELECTED_COLOR = "#C5DDF4";
export const IDENTICAL_VALUE_COLOR = "#C8DCC4";
export const SELECTED_COLOR = "#9CC4EC";
export const HINT_SELECTED_COLOR = "#F2CA7E";
export const REMOVE_NOTE_TEXT_COLOR = "#FF0000";
export const PLACE_NOTE_TEXT_COLOR = "#F2CA7E";
export const NOTE_TEXT_COLOR = "#000000";
export const NOT_HIGHLIGHTED_COLOR = "#FFFFFF";
export const HINT_NOT_HIGHILGHTED_COLOR = "#808080";

export const VERY_EASY_COLOR = "#4CBB17";
export const EASY_COLOR = "#7CFC00";
export const INTERMEDIATE_COLOR = "#FFFF00";
export const HARD_COLOR = "#FFA500";
export const VERY_HARD_COLOR = "#FF0000";

export const DARK_BACKGROUND_COLOR = "#025E73";
export const LIGHT_BACKGROUND_COLOR = "#F2F2F2";
export const GOLD_COLOR = "#D9A05B";
export const PURPLE_COLOR = "#025E73";

// from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
export const HINT_SELECTED_COLOR_RGB = RGB(HINT_SELECTED_COLOR);
export const REMOVE_NOTE_TEXT_COLOR_RGB = RGB(REMOVE_NOTE_TEXT_COLOR);
export const PLACE_NOTE_TEXT_COLOR_RGB = RGB(PLACE_NOTE_TEXT_COLOR);
export const NOTE_TEXT_COLOR_RGB = RGB(NOTE_TEXT_COLOR);
export const NOT_HIGHLIGHTED_COLOR_RGB = RGB(NOT_HIGHLIGHTED_COLOR);
export const HINT_NOT_HIGHLIGHTED_COLOR_RGB = RGB(HINT_NOT_HIGHILGHTED_COLOR);

export const VERY_EASY_COLOR_RGB = RGB(VERY_EASY_COLOR);
export const EASY_COLOR_RGB = RGB(EASY_COLOR);
export const INTERMEDIATE_COLOR_RGB = RGB(INTERMEDIATE_COLOR);
export const HARD_COLOR_RGB = RGB(HARD_COLOR);
export const VERY_HARD_COLOR_RGB = RGB(VERY_HARD_COLOR);

export const DARK_BACKGROUND_COLOR_RGB = RGB(DARK_BACKGROUND_COLOR);
export const LIGHT_BACKGROUND_COLOR_RGB = RGB(LIGHT_BACKGROUND_COLOR);
export const GOLD_COLOR_RGB = RGB(GOLD_COLOR);
export const PURPLE_COLOR_RGB = RGB(PURPLE_COLOR);
