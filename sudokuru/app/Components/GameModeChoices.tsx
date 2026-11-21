import React from "react";
import { Pressable, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons";
import { Surface, Text } from "react-native-paper";
import type {
  DashboardNavigationAction,
  SudokuModeCardDescriptor,
} from "../SudokuModes/SudokuModeRegistry";
import { useTheme } from "../Contexts/ThemeContext";

interface GameModeChoicesProps {
  choices: SudokuModeCardDescriptor[];
  onChoose: (action: DashboardNavigationAction) => void;
}

/** Shared game/variant choice cards used by the navigation pages. */
const GameModeChoices = ({ choices, onChoose }: GameModeChoicesProps) => {
  const { theme } = useTheme();
  const [focusedChoice, setFocusedChoice] = React.useState<string | null>(null);
  const cardSurfaceColor = theme.useDarkTheme
    ? theme.colors.surfaceAlt
    : theme.colors.surface;
  const cardTextColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

  return (
    <Surface
      elevation={2}
      style={{
        marginTop: 12,
        overflow: "hidden",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: cardSurfaceColor,
      }}
    >
      {choices.map((choice, index) => {
        const disabled = choice.status === "comingSoon";
        const focused = focusedChoice === choice.id;
        return (
          <Pressable
            key={choice.id}
            testID={choice.testID}
            accessibilityRole="button"
            accessibilityLabel={choice.title}
            accessibilityHint={disabled ? choice.badge : choice.description}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onFocus={() => setFocusedChoice(choice.id)}
            onBlur={() => setFocusedChoice(null)}
            onPress={() => choice.action && onChoose(choice.action)}
          >
            {({ hovered, pressed }) => {
              let opacity = 1;
              if (disabled) opacity = 0.68;
              else if (pressed) opacity = 0.8;
              return (
                <View
                  style={{
                    minHeight: 84,
                    paddingHorizontal: 18,
                    paddingVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderLeftWidth: focused ? 4 : 0,
                    borderColor: theme.colors.border,
                    backgroundColor:
                      hovered || focused ? theme.colors.bg : cardSurfaceColor,
                    opacity,
                  }}
                >
                  <MaterialCommunityIcons
                    name={choice.icon}
                    size={28}
                    color={theme.colors.primary}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      variant="titleMedium"
                      style={{
                        color: cardTextColor,
                        fontWeight: "800",
                      }}
                    >
                      {choice.title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      variant="bodyMedium"
                      style={{
                        marginTop: 3,
                        color: cardTextColor,
                        opacity: 0.68,
                      }}
                    >
                      {choice.description}
                    </Text>
                  </View>
                  {choice.badge ? (
                    <Text
                      variant="labelSmall"
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "800",
                      }}
                    >
                      {choice.badge.toUpperCase()}
                    </Text>
                  ) : (
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={22}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
              );
            }}
          </Pressable>
        );
      })}
    </Surface>
  );
};

export default GameModeChoices;
