import { StyleSheet, Text, View } from 'react-native';

import { appTheme } from '../theme/appTheme';

function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return 'Not set';
  }

  return `$${amount.toFixed(2)}`;
}

function ExpensesOverviewCard({
  productName,
  expenses,
  budgetAmount,
  remainingBudgetAmount,
} = {}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.productName}>{productName}</Text>
        </View>
      </View>
      <Text style={styles.summaryText}>Recent expenses</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Entries</Text>
          <Text style={styles.metaValue}>{expenses.length}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Budget</Text>
          <Text style={styles.metaValue}>{formatCurrency(budgetAmount)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Remaining</Text>
          <Text style={styles.metaValue}>
            {typeof budgetAmount === 'number'
              ? formatCurrency(remainingBudgetAmount)
              : 'Not set'}
          </Text>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: appTheme.spacing.md,
  },
  titleBlock: {
    flex: 1,
    paddingRight: appTheme.spacing.md,
  },
  productName: {
    color: appTheme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  summaryText: {
    marginBottom: appTheme.spacing.md,
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: appTheme.spacing.sm,
    marginBottom: appTheme.spacing.md,
  },
  metaItem: {
    minWidth: 92,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surfaceElevated,
  },
  metaLabel: {
    color: appTheme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaValue: {
    marginTop: 6,
    color: appTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ExpensesOverviewCard;
