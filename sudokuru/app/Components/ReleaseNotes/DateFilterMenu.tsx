import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, IconButton, Menu, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import { MONTH_NAMES, parseMonthYear } from "./ReleaseNoteFunctions";
import type { MonthName } from "./ReleaseNoteFunctions";

interface DateFilterMenuProps {
  isMonthDisabled: (year: number, month: MonthName) => boolean;
  label: string;
  monthsForYear: (year: number) => MonthName[];
  onChange: (value: string | null) => void;
  selectedMonth: string | null;
  testIDPrefix: "Start" | "End";
  years: number[];
}

export const DateFilterMenu = ({
  isMonthDisabled,
  label,
  monthsForYear,
  onChange,
  selectedMonth,
  testIDPrefix,
  years,
}: DateFilterMenuProps) => {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<"year" | "month" | null>(null);
  const [draftYear, setDraftYear] = useState(new Date().getFullYear());
  const [draftMonth, setDraftMonth] = useState<MonthName>(MONTH_NAMES[0]);

  const menuContentStyle = {
    backgroundColor: theme.useDarkTheme
      ? theme.colors.surfaceAlt
      : theme.colors.surface,
    borderRadius: 16,
  };

  const openMenu = () => {
    const selectedDate = selectedMonth ? parseMonthYear(selectedMonth) : null;
    const selectedMonthName = selectedDate
      ? MONTH_NAMES[selectedDate.getMonth()]
      : null;
    const year =
      selectedDate?.getFullYear() ?? years[0] ?? new Date().getFullYear();
    const months = monthsForYear(year);

    setDraftYear(year);
    setDraftMonth(
      selectedMonthName && months.includes(selectedMonthName)
        ? selectedMonthName
        : (months[0] ?? MONTH_NAMES[0]),
    );
    setVisible(true);
  };

  const closeMenu = () => {
    setOpenSubmenu(null);
    setVisible(false);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
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
            onPress={closeMenu}
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
              visible={openSubmenu === "year"}
              onDismiss={() => setOpenSubmenu(null)}
              contentStyle={menuContentStyle}
              anchor={
                <Button
                  testID={`ReleaseNotes${testIDPrefix}YearButton`}
                  mode="outlined"
                  buttonColor={theme.colors.surfaceAlt}
                  textColor={theme.semantic.text.inverse}
                  style={{ alignSelf: "flex-start", marginBottom: 8 }}
                  compact
                  onPress={() => setOpenSubmenu("year")}
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
                      if (
                        selectedMonth != null &&
                        months.includes(draftMonth) &&
                        !isMonthDisabled(year, draftMonth)
                      ) {
                        onChange(`${draftMonth} ${year}`);
                      } else if (!months.includes(draftMonth)) {
                        setDraftMonth(months[0] ?? MONTH_NAMES[0]);
                      }
                      setOpenSubmenu(null);
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
              visible={openSubmenu === "month"}
              onDismiss={() => setOpenSubmenu(null)}
              contentStyle={menuContentStyle}
              anchor={
                <Button
                  testID={`ReleaseNotes${testIDPrefix}MonthButton`}
                  mode="outlined"
                  buttonColor={theme.colors.surfaceAlt}
                  textColor={theme.semantic.text.inverse}
                  style={{ alignSelf: "flex-start", marginBottom: 8 }}
                  compact
                  onPress={() => setOpenSubmenu("month")}
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
                    disabled={isMonthDisabled(draftYear, month)}
                    titleStyle={{ color: theme.colors.primary }}
                    onPress={() => {
                      setDraftMonth(month);
                      onChange(`${month} ${draftYear}`);
                      closeMenu();
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
