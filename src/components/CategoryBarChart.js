import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChartPieIcon } from 'react-native-heroicons/solid';
import Svg, { Circle, G } from 'react-native-svg';

import { appTheme } from '../theme/appTheme';
import { getSignedExpenseAmount } from '../utils/expenseAmount';

const PIE_CHART_SIZE = 156;
const PIE_CHART_STROKE_WIDTH = 28;
const PIE_CHART_RADIUS = (PIE_CHART_SIZE - PIE_CHART_STROKE_WIDTH) / 2;
const PIE_CHART_CIRCUMFERENCE = 2 * Math.PI * PIE_CHART_RADIUS;
const PIE_CHART_COLORS = [
  '#C5A86A',
  '#8A63D2',
  '#5E9ED6',
  '#4BA78A',
  '#D9777A',
  '#9B7BD8',
];

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function CategoryBarChart({ expenses = [] } = {}) {
  const categoryBreakdown = useMemo(() => {
    const totalsByCategory = expenses.reduce((categoryTotals, expense) => {
      if (expense.transactionType === 'credit') {
        return categoryTotals;
      }

      const nextTotals = { ...categoryTotals };
      const nextAmount = Math.abs(getSignedExpenseAmount(expense));

      nextTotals[expense.category] =
        (nextTotals[expense.category] || 0) + nextAmount;

      return nextTotals;
    }, {});

    return Object.entries(totalsByCategory)
      .map(([category, totalAmount], index) => ({
        category,
        totalAmount,
        color: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length],
      }))
      .sort(
        (leftCategory, rightCategory) =>
          rightCategory.totalAmount - leftCategory.totalAmount,
      );
  }, [expenses]);

  const totalSpent = categoryBreakdown.reduce(
    (runningTotal, categoryEntry) => runningTotal + categoryEntry.totalAmount,
    0,
  );

  const pieSegments = useMemo(() => {
    let accumulatedRatio = 0;

    return categoryBreakdown.map((categoryEntry) => {
      const ratio = categoryEntry.totalAmount / totalSpent;
      const strokeDashoffset = PIE_CHART_CIRCUMFERENCE * (1 - accumulatedRatio);
      const strokeDasharray = `${PIE_CHART_CIRCUMFERENCE * ratio} ${PIE_CHART_CIRCUMFERENCE}`;

      accumulatedRatio += ratio;

      return {
        ...categoryEntry,
        percentage: ratio * 100,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categoryBreakdown, totalSpent]);

  if (categoryBreakdown.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Category Snapshot</Text>
          <Text style={styles.title}>Spending by category</Text>
        </View>
        <ChartPieIcon color={appTheme.colors.textSecondary} size={20} />
      </View>
      <View style={styles.chartBody}>
        <View style={styles.pieChartBlock}>
          <Svg height={PIE_CHART_SIZE} width={PIE_CHART_SIZE}>
            <G
              rotation="-90"
              origin={`${PIE_CHART_SIZE / 2}, ${PIE_CHART_SIZE / 2}`}
            >
              <Circle
                cx={PIE_CHART_SIZE / 2}
                cy={PIE_CHART_SIZE / 2}
                fill="none"
                r={PIE_CHART_RADIUS}
                stroke={appTheme.colors.surface}
                strokeWidth={PIE_CHART_STROKE_WIDTH}
              />
              {pieSegments.map((segment) => (
                <Circle
                  key={segment.category}
                  cx={PIE_CHART_SIZE / 2}
                  cy={PIE_CHART_SIZE / 2}
                  fill="none"
                  r={PIE_CHART_RADIUS}
                  stroke={segment.color}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  strokeLinecap="butt"
                  strokeWidth={PIE_CHART_STROKE_WIDTH}
                />
              ))}
            </G>
          </Svg>
          <View style={styles.pieChartCenterLabel}>
            <Text style={styles.centerLabelEyebrow}>Total</Text>
            <Text style={styles.centerLabelValue}>
              {formatCurrency(totalSpent)}
            </Text>
          </View>
        </View>
        <View style={styles.legendList}>
          {pieSegments.map((categoryEntry) => (
            <View key={categoryEntry.category} style={styles.row}>
              <View style={styles.labelRow}>
                <View style={styles.legendLabelGroup}>
                  <View
                    style={[
                      styles.legendSwatch,
                      { backgroundColor: categoryEntry.color },
                    ]}
                  />
                  <Text style={styles.categoryLabel}>
                    {categoryEntry.category}
                  </Text>
                </View>
                <Text style={styles.amountLabel}>
                  {Math.round(categoryEntry.percentage)}%
                </Text>
              </View>
              <Text style={styles.detailText}>
                {formatCurrency(categoryEntry.totalAmount)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: appTheme.spacing.lg,
    padding: appTheme.spacing.lg,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: appTheme.spacing.lg,
  },
  eyebrow: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  title: {
    color: appTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  chartBody: {
    gap: appTheme.spacing.lg,
  },
  pieChartBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  pieChartCenterLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelEyebrow: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  centerLabelValue: {
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  legendList: {
    gap: 12,
  },
  row: {
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: appTheme.colors.border,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  legendLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
    flexShrink: 1,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryLabel: {
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  amountLabel: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  detailText: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
});

export default CategoryBarChart;
