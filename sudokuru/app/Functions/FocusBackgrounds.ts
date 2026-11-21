export type FocusBackgroundStyle = "plain" | "haze" | "clouds" | "dense";
export type FocusBackgroundColor = "light" | "classic" | "dark";

export interface FocusBackgroundOption {
  id: string;
  label: string;
  style: FocusBackgroundStyle;
  color: FocusBackgroundColor;
}

export const FOCUS_BACKGROUND_STYLES: {
  id: FocusBackgroundStyle;
  label: string;
}[] = [
  { id: "clouds", label: "Clouds" },
  { id: "dense", label: "Dense Fog" },
  { id: "haze", label: "Haze" },
  { id: "plain", label: "Plain" },
];

export const FOCUS_BACKGROUND_COLORS: {
  id: FocusBackgroundColor;
  label: string;
}[] = [
  { id: "light", label: "Light" },
  { id: "classic", label: "Classic" },
  { id: "dark", label: "Dark" },
];

export const FOCUS_BACKGROUND_TEXTURES: Record<
  Exclude<FocusBackgroundStyle, "plain">,
  any
> = {
  haze: require("../../.assets/FocusFog/fog-haze.png"),
  clouds: require("../../.assets/FocusFog/fog-clouds.png"),
  dense: require("../../.assets/FocusFog/fog-dense.png"),
};

export const FOCUS_BACKGROUND_FOG: Record<
  FocusBackgroundColor,
  { fog: string; card: "surface" | "surfaceAlt"; darkTheme: boolean }
> = {
  light: { fog: "#E5E7EB", card: "surface", darkTheme: false },
  classic: { fog: "#485A64", card: "surfaceAlt", darkTheme: true },
  dark: { fog: "#24262A", card: "surfaceAlt", darkTheme: true },
};

export const FOCUS_BACKGROUND_OPTIONS: FocusBackgroundOption[] =
  FOCUS_BACKGROUND_STYLES.flatMap((style) =>
    FOCUS_BACKGROUND_COLORS.map((color) => ({
      id: `${style.id}-${color.id}`,
      label:
        style.id === "plain"
          ? `Plain ${color.label}`
          : `${color.label} ${style.label}`,
      style: style.id,
      color: color.id,
    })),
  );

export const DEFAULT_FOCUS_BACKGROUND_ID = "dense-classic";

export const getFocusBackgroundOption = (
  id: string | undefined,
): FocusBackgroundOption =>
  FOCUS_BACKGROUND_OPTIONS.find((option) => option.id === id) ??
  FOCUS_BACKGROUND_OPTIONS.find(
    (option) => option.id === DEFAULT_FOCUS_BACKGROUND_ID,
  )!;
