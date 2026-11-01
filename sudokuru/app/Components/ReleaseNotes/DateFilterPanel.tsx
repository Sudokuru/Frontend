import React, { useState } from "react";
import { View } from "react-native";
import { Chip, IconButton, Text } from "react-native-paper";
import { useTheme } from "../../Contexts/ThemeContext";
import { MONTH_NAMES, parseMonthYear } from "./ReleaseNoteFunctions";
import type { MonthName } from "./ReleaseNoteFunctions";

interface DateFilterPanelProps {
  isMonthDisabled: (year: number, month: MonthName) => boolean;
  label: string;
  monthsForYear: (year: number) => MonthName[];
  onChange: (value: string | null) => void;
  onCollapse: () => void;
  selectedMonth: string | null;
  testIDPrefix: "Start" | "End";
  years: number[];
}

/**
 * Expanded inline panel for a date filter. Year and month chips are visible
 * at the same time; the month chips always reflect the highlighted year.
 */
export const DateFilterPanel = ({
  isMonthDisabled,
  label,
  monthsForYear,
  onChange,
  onCollapse,
  selectedMonth,
  testIDPrefix,
  years,
}: DateFilterPanelProps) => {
  const { theme } = useTheme();

  const committedDate = selectedMonth ? parseMonthYear(selectedMonth) : null;
  const committedMonthName = committedDate
    ? MONTH_NAMES[committedDate.getMonth()]
    : null;
  const committedYear = committedDate?.getFullYear() ?? null;
  const defaultYear = years[0] ?? new Date().getFullYear();

  // The section mounts this panel when it expands, so the year context
  // starts from the committed year; selectYear keeps it current while the
  // panel stays mounted.
  const [yearContext, setYearContext] = useState(committedYear ?? defaultYear);

  const selectYear = (year: number) => {
    setYearContext(year);
    if (
      committedMonthName != null &&
      monthsForYear(year).includes(committedMonthName) &&
      !isMonthDisabled(year, committedMonthName)
    ) {
      onChange(`${committedMonthName} ${year}`);
    }
  };

  const selectMonth = (month: MonthName) => {
    onChange(`${month} ${yearContext}`);
    onCollapse();
  };

  const isMonthSelected = (month: MonthName) =>
    committedMonthName === month && committedYear === yearContext;

  return (
    <View
      testID={`ReleaseNotes${testIDPrefix}DateFilterSection`}
      style={{
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
          testID={`ReleaseNotes${testIDPrefix}DateFilterCloseButton`}
          icon="close"
          accessibilityLabel={`Close ${label} filter`}
          size={16}
          onPress={onCollapse}
          style={{ margin: 0 }}
          iconColor={theme.colors.primary}
        />
      </View>
      <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>Year</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {years.map((year) => {
          const isSelected = yearContext === year;
          // Selected chips use black text on the primary background; white
          // text does not meet contrast requirements there.
          const chipTextColor = isSelected
            ? theme.semantic.text.info
            : theme.semantic.text.inverse;
          return (
            <Chip
              testID={`ReleaseNotes${testIDPrefix}YearOption-${year}`}
              key={year}
              selected={isSelected}
              onPress={() => selectYear(year)}
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
              {String(year)}
            </Chip>
          );
        })}
      </View>
      <Text style={{ color: theme.colors.primary, marginBottom: 4 }}>
        Month
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 2,
        }}
      >
        {monthsForYear(yearContext).map((month) => {
          const isSelected = isMonthSelected(month);
          const disabled = isMonthDisabled(yearContext, month);
          // Selected chips use black text on the primary background; white
          // text does not meet contrast requirements there.
          const chipTextColor = isSelected
            ? theme.semantic.text.info
            : theme.semantic.text.inverse;
          return (
            <Chip
              testID={`ReleaseNotes${testIDPrefix}MonthOption-${month}`}
              key={month}
              selected={isSelected}
              disabled={disabled}
              onPress={() => selectMonth(month)}
              mode={isSelected ? "flat" : "outlined"}
              selectedColor={chipTextColor}
              style={{
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
                opacity: disabled ? 0.5 : 1,
              }}
              textStyle={{ color: chipTextColor }}
            >
              {month}
            </Chip>
          );
        })}
      </View>
    </View>
  );
};
