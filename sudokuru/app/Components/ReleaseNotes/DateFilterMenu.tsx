import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, IconButton, Menu, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

interface DateFilterMenuProps {
  label: string;
  monthsForYear: (year: number) => string[];
  onChange: (value: string | null) => void;
  selectedMonth: string | null;
  testIDPrefix: "Start" | "End";
  years: number[];
}

export const DateFilterMenu = ({
  label,
  monthsForYear,
  onChange,
  selectedMonth,
  testIDPrefix,
  years,
}: DateFilterMenuProps) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [draftYear, setDraftYear] = useState(new Date().getFullYear());
  const [draftMonth, setDraftMonth] = useState<string>(MONTH_NAMES[0]);

  const menuContentStyle = {
    backgroundColor: theme.useDarkTheme
      ? theme.colors.surfaceAlt
      : theme.colors.surface,
    borderRadius: 16,
  };

  const openMenu = () => {
    const separatorIndex = selectedMonth?.lastIndexOf(" ") ?? -1;
    const selectedYear = Number(selectedMonth?.slice(separatorIndex + 1));
    const selectedMonthName = selectedMonth?.slice(0, separatorIndex);
    const year = Number.isNaN(selectedYear)
      ? (years[0] ?? new Date().getFullYear())
      : selectedYear;
    const months = monthsForYear(year);

    setDraftYear(year);
    setDraftMonth(
      selectedMonthName && months.includes(selectedMonthName)
        ? selectedMonthName
        : (months[0] ?? MONTH_NAMES[0]),
    );
    setVisible(true);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      contentStyle={menuContentStyle}
      anchor={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Button
            testID={`ReleaseNotes${testIDPrefix}DateFilterButton`}
            mode={selectedMonth ? "contained" : "outlined"}
            buttonColor={selectedMonth ? theme.colors.primary : undefined}
            textColor={
              selectedMonth ? theme.semantic.text.inverse : theme.colors.primary
            }
            compact
            onPress={openMenu}
          >
            {selectedMonth ? `${label}: ${selectedMonth}` : label}
          </Button>
        </View>
      }
    >
      <View
        testID={`ReleaseNotes${testIDPrefix}DateFilterMenu`}
        style={{ width: 260 }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingTop: 6,
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
            {label}
          </Text>
          <IconButton
            testID={`ReleaseNotes${testIDPrefix}DateFilterCloseButton`}
            icon="close"
            size={16}
            onPress={() => setVisible(false)}
            style={{ margin: 0 }}
            iconColor={theme.colors.primary}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 8,
          }}
        >
          <View>
            <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
              Year
            </Text>
            <Menu
              visible={yearMenuOpen}
              onDismiss={() => setYearMenuOpen(false)}
              contentStyle={menuContentStyle}
              anchor={
                <Button
                  testID={`ReleaseNotes${testIDPrefix}YearButton`}
                  mode="outlined"
                  buttonColor={theme.colors.surfaceAlt}
                  textColor={theme.semantic.text.inverse}
                  style={{ alignSelf: "flex-start", marginBottom: 8 }}
                  compact
                  onPress={() => setYearMenuOpen(true)}
                >
                  {String(draftYear)}
                </Button>
              }
            >
              <ScrollView style={{ maxHeight: 180 }}>
                {years.map((year) => (
                  <Menu.Item
                    testID={`ReleaseNotes${testIDPrefix}YearOption-${year}`}
                    key={year}
                    title={String(year)}
                    dense
                    titleStyle={{ color: theme.colors.primary }}
                    onPress={() => {
                      const months = monthsForYear(year);
                      setDraftYear(year);
                      if (!months.includes(draftMonth)) {
                        setDraftMonth(months[0] ?? MONTH_NAMES[0]);
                      }
                      setYearMenuOpen(false);
                    }}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>
          <View>
            <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
              Month
            </Text>
            <Menu
              visible={monthMenuOpen}
              onDismiss={() => setMonthMenuOpen(false)}
              contentStyle={menuContentStyle}
              anchor={
                <Button
                  testID={`ReleaseNotes${testIDPrefix}MonthButton`}
                  mode="outlined"
                  buttonColor={theme.colors.surfaceAlt}
                  textColor={theme.semantic.text.inverse}
                  style={{ alignSelf: "flex-start", marginBottom: 8 }}
                  compact
                  onPress={() => setMonthMenuOpen(true)}
                >
                  {draftMonth}
                </Button>
              }
            >
              <ScrollView style={{ maxHeight: 180 }}>
                {monthsForYear(draftYear).map((month) => (
                  <Menu.Item
                    testID={`ReleaseNotes${testIDPrefix}MonthOption-${month}`}
                    key={month}
                    title={month}
                    dense
                    titleStyle={{ color: theme.colors.primary }}
                    onPress={() => {
                      setDraftMonth(month);
                      onChange(`${month} ${draftYear}`);
                      setYearMenuOpen(false);
                      setMonthMenuOpen(false);
                      setVisible(false);
                    }}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>
        </View>
      </View>
    </Menu>
  );
};
