import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheckIcon } from 'react-native-heroicons/solid';

import { STARTER_DISPLAY } from '../constants/starterDisplay';
import { appTheme } from '../theme/appTheme';

function StarterCard({ productName, greetingMessage, baselineLabel } = {}) {
  const metaItems = [
    STARTER_DISPLAY.THEME_AESTHETIC,
    STARTER_DISPLAY.THEME_ICON_SET,
    STARTER_DISPLAY.SCOPE_LABEL,
  ].filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <ShieldCheckIcon color={appTheme.colors.textPrimary} size={28} />
      </View>
      {baselineLabel ? <Text style={styles.label}>{baselineLabel}</Text> : null}
      <Text style={styles.productName}>{productName}</Text>
      <Text style={styles.greeting}>{greetingMessage}</Text>
      {STARTER_DISPLAY.SCOPE_BOUNDARY ? (
        <Text style={styles.storageText}>{STARTER_DISPLAY.SCOPE_BOUNDARY}</Text>
      ) : null}
      {metaItems.length > 0 ? (
        <View style={styles.metaRow}>
          {metaItems.map((metaItem, index) => (
            <View key={metaItem} style={styles.metaItemWrap}>
              {index > 0 ? <Text style={styles.metaDivider}>/</Text> : null}
              <Text style={styles.metaText}>{metaItem}</Text>
            </View>
          ))}
        </View>
      ) : null}
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
    marginBottom: appTheme.spacing.md,
    color: appTheme.colors.textSecondary,
    lineHeight: 24,
    ...appTheme.typography.body,
  },
  storageText: {
    marginBottom: appTheme.spacing.lg,
    color: appTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItemWrap: {
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
