import { useWindowDimensions } from "react-native";

export const getMinWindowDimensions = (): number => {
  const size = useWindowDimensions();
  return Math.min(size.width, size.height);
};
