import React, { useState } from "react";
import { View } from "react-native";
import { Button, Chip, IconButton, Menu, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

interface MultiSelectFilterMenuProps<T extends string> {
  label: string;
  maxWidth: number;
  onChange: (selected: Set<T>) => void;
  optionLabel: (option: T) => string;
  optionTestIDPrefix: string;
  options: readonly T[];
  selected: Set<T>;
  testIDPrefix: string;
}

export const MultiSelectFilterMenu = <T extends string>({
  label,
  maxWidth,
  onChange,
  optionLabel,
  optionTestIDPrefix,
  options,
  selected,
  testIDPrefix,
}: MultiSelectFilterMenuProps<T>) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const hasSelection = selected.size > 0;

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
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      contentStyle={{
        backgroundColor: theme.useDarkTheme
          ? theme.colors.surfaceAlt
          : theme.colors.surface,
        borderRadius: 16,
      }}
      anchor={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            testID={`ReleaseNotes${testIDPrefix}FilterButton`}
            mode={hasSelection ? "contained" : "outlined"}
            buttonColor={hasSelection ? theme.colors.primary : undefined}
            textColor={
              hasSelection ? theme.semantic.text.inverse : theme.colors.primary
            }
            compact
            onPress={() => setVisible(true)}
          >
            {hasSelection ? `${label} (${selected.size})` : label}
          </Button>
        </View>
      }
    >
      <View
        testID={`ReleaseNotes${testIDPrefix}FilterMenu`}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          padding: 10,
          maxWidth,
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
            size={16}
            onPress={() => setVisible(false)}
            style={{ margin: 0 }}
            iconColor={theme.colors.primary}
          />
        </View>
        {options.map((option) => {
          const isSelected = selected.has(option);
          return (
            <Chip
              testID={`ReleaseNotes${optionTestIDPrefix}Option-${option}`}
              key={option}
              selected={isSelected}
              onPress={() => toggleOption(option)}
              mode={isSelected ? "flat" : "outlined"}
              selectedColor={theme.semantic.text.inverse}
              style={{
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
              }}
              textStyle={{ color: theme.semantic.text.inverse }}
            >
              {optionLabel(option)}
            </Chip>
          );
        })}
      </View>
    </Menu>
  );
};
