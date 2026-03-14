import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { appTheme } from '../theme/appTheme';

const DEFAULT_MAX_BODY_HEIGHT = 320;

function CompactExpensesTable({ expenses = [], maxBodyHeight } = {}) {
  const resolvedMaxBodyHeight = maxBodyHeight || DEFAULT_MAX_BODY_HEIGHT;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.headerCell, styles.merchantCell]}>Merchant</Text>
          <Text style={[styles.headerCell, styles.categoryCell]}>Category</Text>
          <Text style={[styles.headerCell, styles.amountCell]}>Amount</Text>
          <Text style={[styles.headerCell, styles.timeCell]}>Time</Text>
        </View>
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={[styles.bodyScroller, { maxHeight: resolvedMaxBodyHeight }]}
        >
          {expenses.map((expense) => (
            <View key={expense.id} style={styles.row}>
              <Text
                style={[styles.bodyCell, styles.merchantCell]}
                numberOfLines={1}
              >
                {expense.merchantName}
              </Text>
              <Text
                style={[styles.bodyCell, styles.categoryCell]}
                numberOfLines={1}
              >
                {expense.category}
              </Text>
              <Text
                style={[styles.bodyCell, styles.amountCell]}
                numberOfLines={1}
              >
                {expense.amountLabel}
              </Text>
              <Text
                style={[styles.bodyCell, styles.timeCell]}
                numberOfLines={1}
              >
                {expense.spentAt}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderRadius: appTheme.radii.md,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
    overflow: 'hidden',
  },
  bodyScroller: {
    minHeight: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    borderTopWidth: 1,
    borderTopColor: appTheme.colors.border,
  },
  headerRow: {
    minHeight: 42,
    borderTopWidth: 0,
    backgroundColor: appTheme.colors.surfaceElevated,
  },
  headerCell: {
    color: appTheme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bodyCell: {
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  merchantCell: {
    width: 132,
    paddingHorizontal: appTheme.spacing.sm,
  },
  categoryCell: {
    width: 100,
    paddingHorizontal: appTheme.spacing.sm,
  },
  amountCell: {
    width: 88,
    paddingHorizontal: appTheme.spacing.sm,
  },
  timeCell: {
    width: 124,
    paddingHorizontal: appTheme.spacing.sm,
  },
});

export default CompactExpensesTable;
