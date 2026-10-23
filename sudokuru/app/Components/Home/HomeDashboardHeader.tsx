import React from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Menu, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import type { GameDifficulty } from "../../Functions/GameDifficulties";
import HomeActionCard from "./HomeActionCard";
import type {
  DashboardNavigationAction,
  HomeHeroAction,
  HomeResumeDescriptor,
} from "./HomeDashboard";

interface HomeDashboardHeaderProps {
  isEditing: boolean;
  isMobile: boolean;
  height?: number;
  heroAction: HomeHeroAction;
  supportingResumes: HomeResumeDescriptor[];
  difficulty: GameDifficulty;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onNavigate: (action: DashboardNavigationAction) => void;
  onReset: () => void;
  onDone: () => void;
}

const HomeDifficultySelector = ({
  options,
  difficulty,
  onChange,
}: {
  options: HomeHeroAction["difficultyOptions"];
  difficulty: GameDifficulty;
  onChange: (difficulty: GameDifficulty) => void;
}) => {
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(false);
  if (!options) return null;
  const label =
    options.find((option) => option.value === difficulty)?.label ?? difficulty;

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button
          testID="HomeDifficultySelector"
          accessibilityLabel={`Difficulty: ${label}`}
          mode="outlined"
          icon="chevron-down"
          textColor={theme.colors.primary}
          style={{ minWidth: 140, borderColor: theme.colors.primary }}
          onPress={() => setVisible(true)}
        >
          {label}
        </Button>
      }
      contentStyle={{ backgroundColor: theme.colors.bg }}
    >
      <ScrollView style={{ maxHeight: 320 }}>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            testID={`HomeDifficulty-${option.value}`}
            title={option.label}
            leadingIcon={option.value === difficulty ? "check" : undefined}
            titleStyle={{ color: theme.semantic.text.tertiary }}
            onPress={() => {
              onChange(option.value);
              setVisible(false);
            }}
          />
        ))}
      </ScrollView>
    </Menu>
  );
};

const HomeDashboardHeader = ({
  isEditing,
  isMobile,
  height,
  heroAction,
  supportingResumes,
  difficulty,
  onDifficultyChange,
  onNavigate,
  onReset,
  onDone,
}: HomeDashboardHeaderProps) => {
  const { theme } = useTheme();
  const primaryButtonTextColor = theme.useDarkTheme
    ? theme.semantic.text.info
    : theme.semantic.text.inverse;
  const headingVariant = isMobile ? "headlineSmall" : "headlineMedium";
  const logoSize = isMobile ? 52 : 64;

  return (
    <View
      style={{
        minHeight: height,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        {isEditing ? (
          <>
            <Text
              accessibilityRole="header"
              variant={headingVariant}
              style={{ color: theme.semantic.text.tertiary, fontWeight: "800" }}
            >
              Edit Home
            </Text>
            <Text
              numberOfLines={1}
              variant="bodySmall"
              style={{ color: theme.semantic.text.tertiary, opacity: 0.7 }}
            >
              Drag shortcuts to rearrange them.
            </Text>
          </>
        ) : (
          <>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <Image
                accessible={false}
                source={require("../../../.assets/goldLogoNoText.png")}
                style={{
                  width: logoSize,
                  height: logoSize,
                  resizeMode: "contain",
                }}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  accessibilityRole="header"
                  variant={headingVariant}
                  style={{
                    color: theme.semantic.text.tertiary,
                    fontWeight: "800",
                  }}
                >
                  Sudokuru
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{
                    marginTop: 2,
                    color: theme.semantic.text.tertiary,
                    opacity: 0.72,
                  }}
                >
                  Play puzzles, learn solving strategies, and practice with
                  focused drills.
                </Text>
              </View>
            </View>
            <HomeActionCard
              action={heroAction}
              isMobile={isMobile}
              onPress={() => onNavigate(heroAction.action)}
            >
              <HomeDifficultySelector
                options={heroAction.difficultyOptions}
                difficulty={difficulty}
                onChange={onDifficultyChange}
              />
            </HomeActionCard>
            {supportingResumes.map((resume) => (
              <HomeActionCard
                key={resume.id}
                action={{
                  title: `Resume ${resume.title}`,
                  description: resume.description,
                  label: `Resume ${resume.title}`,
                  testID: resume.testID,
                  action: resume.action,
                }}
                isMobile={isMobile}
                onPress={() => onNavigate(resume.action)}
              />
            ))}
          </>
        )}
      </View>
      {isEditing ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Button
            testID="HomeResetShortcutsButton"
            compact
            textColor={theme.colors.primary}
            onPress={onReset}
          >
            Reset
          </Button>
          <Button
            testID="HomeCustomizeDoneButton"
            mode="contained"
            buttonColor={theme.colors.primary}
            textColor={primaryButtonTextColor}
            onPress={onDone}
          >
            Done
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default HomeDashboardHeader;
