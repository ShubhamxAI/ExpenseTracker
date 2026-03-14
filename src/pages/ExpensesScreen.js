import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CategoryBarChart from '../components/CategoryBarChart';
import CompactExpensesTable from '../components/CompactExpensesTable';
import ExpenseListItem from '../components/ExpenseListItem';
import ExpensesOverviewCard from '../components/ExpensesOverviewCard';
import {
  deleteExpenseFromDatabase,
  loadExpensesFromDatabase,
} from '../data/expenseDatabase';
import {
  selectExpenses,
  selectExpensesError,
  selectExpensesStatus,
  selectStarterDisplay,
  selectStarterTheme,
} from '../features/starter/starterSelectors';
import {
  expenseRemoved,
  expensesHydrated,
  expensesLoadFailed,
  expensesLoadStarted,
} from '../features/starter/starterSlice';
import { appTheme } from '../theme/appTheme';
import { exportExpensesCsv } from '../utils/exportExpensesCsv';

const MAX_VISIBLE_EXPENSES = 5;
const EXPENSE_ROW_HEIGHT = 76;
const INTERNAL_LIST_MAX_HEIGHT = MAX_VISIBLE_EXPENSES * EXPENSE_ROW_HEIGHT;
const EXCEL_VIEW_MAX_BODY_HEIGHT = 360;

function ExpensesScreen() {
  const dispatch = useDispatch();
  const starterTheme = useSelector(selectStarterTheme);
  const starterDisplay = useSelector(selectStarterDisplay);
  const expenses = useSelector(selectExpenses);
  const expensesStatus = useSelector(selectExpensesStatus);
  const expensesError = useSelector(selectExpensesError);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isExcelVisible, setIsExcelVisible] = useState(false);
  const [pendingRemovalId, setPendingRemovalId] = useState(null);
  const [actionStatusMessage, setActionStatusMessage] = useState('');
  const shouldUseInternalListScroll = expenses.length > MAX_VISIBLE_EXPENSES;

  useEffect(() => {
    let isMounted = true;

    async function hydrateExpenses() {
      dispatch(expensesLoadStarted());

      try {
        const storedExpenses = await loadExpensesFromDatabase();

        if (isMounted) {
          dispatch(expensesHydrated(storedExpenses));
        }
      } catch (error) {
        if (isMounted) {
          dispatch(expensesLoadFailed(error.message));
        }
      }
    }

    if (expensesStatus === 'idle') {
      hydrateExpenses();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, expensesStatus]);

  async function handleRemoveExpense(expenseId) {
    if (pendingRemovalId) {
      return;
    }

    setPendingRemovalId(expenseId);

    try {
      await deleteExpenseFromDatabase(expenseId);
      dispatch(expenseRemoved(expenseId));
    } catch (error) {
      dispatch(expensesLoadFailed(error.message));
    } finally {
      setPendingRemovalId(null);
    }
  }

  function handleOpenMenu() {
    setIsMenuVisible(true);
  }

  function handleCloseMenu() {
    setIsMenuVisible(false);
  }

  function handleOpenExcelView() {
    handleCloseMenu();
    setIsExcelVisible(true);
  }

  function handleCloseExcelView() {
    setIsExcelVisible(false);
  }

  async function handleExportCsv() {
    handleCloseMenu();

    try {
      const exportedFileUri = await exportExpensesCsv(expenses);
      setActionStatusMessage(`CSV exported from ${exportedFileUri}`);
    } catch (error) {
      setActionStatusMessage(error.message);
    }
  }

  function renderExpenseItems() {
    return expenses.map((expense) => (
      <ExpenseListItem
        key={expense.id}
        merchantName={expense.merchantName}
        category={expense.category}
        amountLabel={expense.amountLabel}
        spentAt={expense.spentAt}
        onRemove={() => handleRemoveExpense(expense.id)}
      />
    ));
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: starterTheme.colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <ExpensesOverviewCard
          productName={starterDisplay.productName}
          expenses={expenses}
          onMenuPress={handleOpenMenu}
        />
        <CategoryBarChart expenses={expenses} />
        <View style={styles.listCard}>
          {actionStatusMessage ? (
            <Text style={styles.stateMessage}>{actionStatusMessage}</Text>
          ) : null}
          {expensesStatus === 'loading' ? (
            <Text style={styles.stateMessage}>Loading local expenses...</Text>
          ) : null}
          {expensesStatus === 'error' ? (
            <Text style={styles.errorMessage}>{expensesError}</Text>
          ) : null}
          {shouldUseInternalListScroll ? (
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.internalListScroller}
              contentContainerStyle={styles.internalListContent}
            >
              {renderExpenseItems()}
            </ScrollView>
          ) : (
            renderExpenseItems()
          )}
          {expensesStatus === 'ready' && expenses.length === 0 ? (
            <Text style={styles.stateMessage}>
              All local demo expenses have been removed from the device
              database.
            </Text>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={isMenuVisible}
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleCloseMenu}>
          <View style={styles.menuCard}>
            <Pressable style={styles.menuItem} onPress={handleOpenExcelView}>
              <Text style={styles.menuTitle}>View Excel</Text>
              <Text style={styles.menuCaption}>
                Open the compact table view
              </Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleExportCsv}>
              <Text style={styles.menuTitle}>Export Excel</Text>
              <Text style={styles.menuCaption}>
                Exports a CSV file for sharing
              </Text>
            </Pressable>
            <Pressable
              style={styles.menuDismissButton}
              onPress={handleCloseMenu}
            >
              <Text style={styles.menuDismissLabel}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={isExcelVisible}
        onRequestClose={handleCloseExcelView}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.excelCard}>
            <View style={styles.excelHeader}>
              <View>
                <Text style={styles.excelEyebrow}>Excel View</Text>
                <Text style={styles.excelTitle}>Compact expenses table</Text>
              </View>
              <Pressable
                style={styles.menuDismissButton}
                onPress={handleCloseExcelView}
              >
                <Text style={styles.menuDismissLabel}>Done</Text>
              </Pressable>
            </View>
            <CompactExpensesTable
              expenses={expenses}
              maxBodyHeight={EXCEL_VIEW_MAX_BODY_HEIGHT}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(7, 3, 14, 0.72)',
  },
  menuCard: {
    margin: 24,
    padding: appTheme.spacing.lg,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.sm,
  },
  menuItem: {
    paddingVertical: appTheme.spacing.md,
    paddingHorizontal: appTheme.spacing.sm,
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.surface,
  },
  menuTitle: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  menuCaption: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  menuDismissButton: {
    alignSelf: 'flex-start',
    paddingVertical: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.md,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
  },
  menuDismissLabel: {
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.label,
  },
  excelCard: {
    margin: 24,
    padding: appTheme.spacing.lg,
    maxHeight: '82%',
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.lg,
  },
  excelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
  },
  excelEyebrow: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.accent,
    ...appTheme.typography.label,
  },
  excelTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.sm,
  },
  internalListScroller: {
    maxHeight: INTERNAL_LIST_MAX_HEIGHT,
  },
  internalListContent: {
    gap: appTheme.spacing.sm,
    paddingBottom: appTheme.spacing.xs,
  },
  stateMessage: {
    paddingVertical: appTheme.spacing.md,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  errorMessage: {
    paddingVertical: appTheme.spacing.md,
    color: '#F09CB0',
    ...appTheme.typography.body,
  },
});

export default ExpensesScreen;
