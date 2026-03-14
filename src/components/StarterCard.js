import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheckIcon } from 'react-native-heroicons/solid';

import { STARTER_DISPLAY } from '../constants/starterDisplay';
import { appTheme } from '../theme/appTheme';

function StarterCard({ productName, greetingMessage, baselineLabel } = {}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <ShieldCheckIcon color={appTheme.colors.textPrimary} size={28} />
      </View>
      <Text style={styles.label}>{baselineLabel}</Text>
      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.greeting}>{greetingMessage}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{STARTER_DISPLAY.THEME_AESTHETIC}</Text>
        <Text style={styles.metaDivider}>/</Text>
        <Text style={styles.metaText}>{STARTER_DISPLAY.THEME_ICON_SET}</Text>
        <Text style={styles.metaDivider}>/</Text>
        <Text style={styles.metaText}>{STARTER_DISPLAY.SCOPE_LABEL}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: appTheme.radii.lg,
    padding: appTheme.spacing.xl,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    ...appTheme.shadows.card,
  },
  iconBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    marginBottom: appTheme.spacing.lg,
    backgroundColor: appTheme.colors.primary,
  },
  label: {
    marginBottom: appTheme.spacing.sm,
    color: appTheme.colors.accent,
    ...appTheme.typography.label,
  },
  productName: {
    marginBottom: appTheme.spacing.md,
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.title,
  },
  greeting: {
    marginBottom: appTheme.spacing.lg,
    color: appTheme.colors.textSecondary,
    lineHeight: 24,
    ...appTheme.typography.body,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  metaDivider: {
    marginHorizontal: appTheme.spacing.sm,
    color: appTheme.colors.border,
  },
});

export default StarterCard;
