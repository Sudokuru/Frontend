import React from "react";
import type { View } from "react-native";
import { Button } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

interface FilterToggleButtonProps {
  buttonRef?: React.RefObject<React.ComponentRef<typeof View> | null>;
  expanded: boolean;
  hasSelection: boolean;
  label: string;
  onPress: () => void;
  testID: string;
}

export const FilterToggleButton = ({
  buttonRef,
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
      // react-native-paper types `touchableRef` as `React.RefObject<View>`,
      // a shape React 19 ref hooks no longer produce (theirs include
      // `null`). This assertion only bridges that library typing skew; the
      // runtime ref value is the same focusable control either way.
      touchableRef={buttonRef as unknown as React.RefObject<View>}
      // Paper forwards only the label (not accessibilityState) to the
      // focusable touchable, so the expanded state belongs in the name.
      accessibilityLabel={
        expanded ? `${label}, expanded` : `${label}, collapsed`
      }
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
