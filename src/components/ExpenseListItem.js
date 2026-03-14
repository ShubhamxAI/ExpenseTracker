import { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { TrashIcon } from 'react-native-heroicons/outline';

import { appTheme } from '../theme/appTheme';

const SWIPE_ACTION_WIDTH = 104;
const SWIPE_REMOVE_THRESHOLD = 96;
const SWIPE_REMOVE_OFFSET = 420;

function clampSwipeDistance(distance) {
  return Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, distance));
}

function ExpenseListItem({
  merchantName,
  category,
  amountLabel,
  spentAt,
  onRemove,
} = {}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const removeHandlerRef = useRef(onRemove);
  const isRemovingRef = useRef(false);

  removeHandlerRef.current = onRemove;

  function resetPosition() {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }

  function completeRemoval() {
    if (isRemovingRef.current) {
      return;
    }

    isRemovingRef.current = true;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -SWIPE_REMOVE_OFFSET,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        removeHandlerRef.current?.();
      }
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !isRemovingRef.current &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        gestureState.dx < -10,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(clampSwipeDistance(gestureState.dx));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx <= -SWIPE_REMOVE_THRESHOLD) {
          completeRemoval();
          return;
        }

        resetPosition();
      },
      onPanResponderTerminate: () => {
        resetPosition();
      },
    }),
  ).current;

  return (
    <View style={styles.swipeShell}>
      <View style={styles.removeAction}>
        <TrashIcon color={appTheme.colors.textPrimary} size={20} />
        <Text style={styles.removeLabel}>Remove</Text>
      </View>
      <Animated.View
        style={[
          styles.item,
          {
            opacity,
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.copyBlock}>
          <Text style={styles.merchantName}>{merchantName}</Text>
          <Text style={styles.metaText}>
            {category}
            {' · '}
            {spentAt}
          </Text>
        </View>
        <Text style={styles.amountLabel}>{amountLabel}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeShell: {
    position: 'relative',
    overflow: 'hidden',
  },
  removeAction: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SWIPE_ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: appTheme.spacing.xs,
    backgroundColor: '#7D2035',
    borderRadius: appTheme.radii.md,
  },
  removeLabel: {
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.label,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.md,
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.colors.border,
  },
  copyBlock: {
    flex: 1,
    paddingRight: appTheme.spacing.md,
  },
  merchantName: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  metaText: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  amountLabel: {
    color: appTheme.colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },
});

export default ExpenseListItem;
