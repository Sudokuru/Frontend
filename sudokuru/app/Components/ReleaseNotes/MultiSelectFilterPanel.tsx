import React from "react";
import { View } from "react-native";
import { Chip, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

interface MultiSelectFilterPanelProps<T extends string> {
  label: string;
  onChange: (selected: Set<T>) => void;
  onCollapse: () => void;
  optionLabel: (option: T) => string;
  optionTestIDPrefix: string;
  options: readonly T[];
  selected: Set<T>;
  testIDPrefix: string;
}

/**
 * Expanded inline panel for a multi-select filter. The panel stays open while
 * options are toggled so several can be picked in a row.
 */
export const MultiSelectFilterPanel = <T extends string>({
  label,
  onChange,
  onCollapse,
  optionLabel,
  optionTestIDPrefix,
  options,
  selected,
  testIDPrefix,
}: MultiSelectFilterPanelProps<T>) => {
  const { theme } = useTheme();

  const toggleOption = (option: T) => {
    const next = new Set(selected);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    onChange(next);
  };

  return (
    <View
      testID={`ReleaseNotes${testIDPrefix}FilterSection`}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        padding: 10,
        marginTop: 4,
        borderRadius: 16,
        backgroundColor: theme.useDarkTheme
          ? theme.colors.surfaceAlt
          : theme.colors.surface,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
          {label}
        </Text>
        <IconButton
          testID={`ReleaseNotes${testIDPrefix}FilterCloseButton`}
          icon="close"
          accessibilityLabel={`Close ${label} filter`}
          size={16}
          onPress={onCollapse}
          style={{ margin: 0 }}
          iconColor={theme.colors.primary}
        />
      </View>
      {options.map((option) => {
        const isSelected = selected.has(option);
        // Selected chips use black text on the primary background; white
        // text does not meet contrast requirements there.
        const chipTextColor = isSelected
          ? theme.semantic.text.info
          : theme.semantic.text.inverse;
        return (
          <Chip
            testID={`ReleaseNotes${optionTestIDPrefix}Option-${option}`}
            key={option}
            selected={isSelected}
            onPress={() => toggleOption(option)}
            mode={isSelected ? "flat" : "outlined"}
            selectedColor={chipTextColor}
            style={{
              backgroundColor: isSelected
                ? theme.colors.primary
                : theme.colors.surfaceAlt,
              borderColor: theme.colors.border,
            }}
            textStyle={{ color: chipTextColor }}
          >
            {optionLabel(option)}
          </Chip>
        );
      })}
    </View>
  );
};
