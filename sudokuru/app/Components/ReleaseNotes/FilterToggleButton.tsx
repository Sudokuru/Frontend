import React from "react";
import { Button } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

interface FilterToggleButtonProps {
  expanded: boolean;
  hasSelection: boolean;
  label: string;
  onPress: () => void;
  testID: string;
}

export const FilterToggleButton = ({
  expanded,
  hasSelection,
  label,
  onPress,
  testID,
}: FilterToggleButtonProps) => {
  const { theme } = useTheme();

  return (
    <Button
      testID={testID}
      accessibilityState={{ expanded }}
      mode={hasSelection ? "contained" : "outlined"}
      buttonColor={hasSelection ? theme.colors.primary : undefined}
      textColor={
        hasSelection ? theme.semantic.text.inverse : theme.colors.primary
      }
      compact
      onPress={onPress}
    >
      {label}
    </Button>
  );
};
