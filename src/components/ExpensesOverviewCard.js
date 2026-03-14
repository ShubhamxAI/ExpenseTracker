import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BanknotesIcon,
  EllipsisHorizontalCircleIcon,
} from 'react-native-heroicons/solid';

import { STARTER_DISPLAY } from '../constants/starterDisplay';
import { appTheme } from '../theme/appTheme';

function ExpensesOverviewCard({ productName, expenses, onMenuPress } = {}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>{STARTER_DISPLAY.MAIN_PAGE_LABEL}</Text>
          <Text style={styles.productName}>{productName}</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.iconBadge}>
            <BanknotesIcon color={appTheme.colors.textPrimary} size={26} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open expenses menu"
            onPress={onMenuPress}
            style={({ pressed }) => [
              styles.menuButton,
              pressed ? styles.menuButtonPressed : null,
            ]}
          >
            <EllipsisHorizontalCircleIcon
              color={appTheme.colors.textPrimary}
              size={24}
            />
          </Pressable>
        </View>
      </View>
      <Text style={styles.summaryText}>{STARTER_DISPLAY.MAIN_PAGE_TITLE}</Text>
      <Text style={styles.countText}>{expenses.length} entries available</Text>
      <Text style={styles.scopeText}>{STARTER_DISPLAY.SCOPE_BOUNDARY}</Text>
      <Text style={styles.scopeMetaText}>
        {STARTER_DISPLAY.OUT_OF_SCOPE_CAPABILITIES.join(' · ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: appTheme.spacing.lg,
    padding: appTheme.spacing.xl,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: appTheme.spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.sm,
  },
  eyebrow: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.accent,
    ...appTheme.typography.label,
  },
  productName: {
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.title,
  },
  iconBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: appTheme.colors.primary,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
  },
  menuButtonPressed: {
    opacity: 0.8,
  },
  summaryText: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  countText: {
    marginBottom: appTheme.spacing.sm,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  scopeText: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.label,
  },
  scopeMetaText: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
});

export default ExpensesOverviewCard;
