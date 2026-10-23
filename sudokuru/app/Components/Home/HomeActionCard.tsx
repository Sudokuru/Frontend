import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import type { HomeHeroAction } from "./HomeDashboard";

interface HomeActionCardProps {
  action: HomeHeroAction;
  isMobile: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}

const HomeActionCard = ({
  action,
  isMobile,
  onPress,
  children,
}: HomeActionCardProps) => {
  const { theme } = useTheme();
  const textColor = theme.useDarkTheme
    ? theme.semantic.text.inverse
    : theme.semantic.text.quaternary;

  return (
    <View
      style={{
        marginTop: 14,
        padding: isMobile ? 14 : 18,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        gap: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.useDarkTheme
          ? theme.colors.surfaceAlt
          : theme.colors.surface,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          variant={isMobile ? "titleMedium" : "titleLarge"}
          style={{ color: textColor, fontWeight: "800" }}
        >
          {action.title}
        </Text>
        <Text
          variant="bodySmall"
          style={{ marginTop: 3, color: textColor, opacity: 0.7 }}
        >
          {action.description}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
        }}
      >
        {children}
        <Button
          testID={action.testID}
          mode="contained"
          icon="arrow-right"
          contentStyle={{ flexDirection: "row-reverse" }}
          buttonColor={theme.colors.primary}
          textColor={
            theme.useDarkTheme
              ? theme.semantic.text.info
              : theme.semantic.text.inverse
          }
          onPress={onPress}
        >
          {action.label}
        </Button>
      </View>
    </View>
  );
};

export default HomeActionCard;
