import React from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import type { HomeDashboardIcon } from "../SudokuBoard/SudokuBoardSharedFunctionsController";

interface DashboardActionCardProps {
  title: string;
  description: string;
  icon: HomeDashboardIcon;
  testID: string;
  badge?: string;
  metadata?: string;
  disabled?: boolean;
  onPress?: () => void;
}

const DashboardActionCard = ({
  title,
  description,
  icon,
  testID,
  badge,
  metadata,
  disabled = false,
  onPress,
}: DashboardActionCardProps) => {
  const { theme } = useTheme();
  const [focused, setFocused] = React.useState(false);

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? badge : description}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      {({ hovered, pressed }: any) => (
        <Surface
          elevation={pressed ? 1 : 3}
          style={{
            flex: 1,
            minHeight: 172,
            padding: 20,
            borderRadius: 18,
            borderWidth: focused || hovered ? 2 : 1,
            borderColor:
              focused || hovered ? theme.colors.primary : theme.colors.border,
            backgroundColor: theme.colors.surfaceAlt,
            opacity: disabled ? 0.68 : pressed ? 0.86 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.bg,
              }}
            >
              <MaterialCommunityIcons
                name={icon}
                size={27}
                color={theme.colors.primary}
              />
            </View>
            {badge ? (
              <View
                style={{
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  variant="labelMedium"
                  style={{ color: theme.colors.primary, fontWeight: "700" }}
                >
                  {badge}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            variant="titleLarge"
            style={{
              marginTop: 18,
              color: theme.semantic.text.inverse,
              fontWeight: "700",
            }}
          >
            {title}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              marginTop: 6,
              color: theme.semantic.text.inverse,
              opacity: 0.78,
            }}
          >
            {description}
          </Text>
          {metadata ? (
            <Text
              variant="labelLarge"
              style={{
                marginTop: "auto",
                paddingTop: 14,
                color: theme.colors.primary,
                fontWeight: "700",
              }}
            >
              {metadata}
            </Text>
          ) : null}
        </Surface>
      )}
    </Pressable>
  );
};

export default DashboardActionCard;
