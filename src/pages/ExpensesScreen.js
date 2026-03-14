import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  ArrowsUpDownIcon,
  CheckIcon,
  ChevronDownIcon,
  EllipsisHorizontalCircleIcon,
  FunnelIcon,
} from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';

import CategoryBarChart from '../components/CategoryBarChart';
import CompactExpensesTable from '../components/CompactExpensesTable';
import ExpenseListItem from '../components/ExpenseListItem';
import ExpensesOverviewCard from '../components/ExpensesOverviewCard';
import {
  addExpenseToDatabase,
  deleteExpenseFromDatabase,
  loadBudgetFromDatabase,
  loadExpensesFromDatabase,
  upsertBudgetInDatabase,
} from '../data/expenseDatabase';
import {
  selectBudgetAmount,
  selectExpenses,
  selectExpensesError,
  selectExpensesStatus,
  selectStarterDisplay,
  selectStarterTheme,
} from '../features/starter/starterSelectors';
import {
  budgetHydrated,
  expenseAdded,
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
const STICKY_MENU_TOP_OFFSET =
  (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0) + 24;
const SORT_OPTIONS = {
  TIMESTAMP: 'timestamp',
  AMOUNT_DESC: 'amount-desc',
  CATEGORY_ASC: 'category-asc',
};
const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.TIMESTAMP]: 'Timestamp',
  [SORT_OPTIONS.AMOUNT_DESC]: 'Amount',
  [SORT_OPTIONS.CATEGORY_ASC]: 'Category',
};
const FILTER_OPTIONS = {
  TODAY: 'today',
  SEVEN_DAYS: '7-days',
  THIRTY_DAYS: '30-days',
  SIX_MONTHS: '6-months',
};
const FILTER_OPTION_LABELS = {
  [FILTER_OPTIONS.TODAY]: 'Today',
  [FILTER_OPTIONS.SEVEN_DAYS]: '7 days',
  [FILTER_OPTIONS.THIRTY_DAYS]: '30 days',
  [FILTER_OPTIONS.SIX_MONTHS]: '6 months',
};

function parseAmountLabel(amountLabel = '') {
  const numericValue = Number.parseFloat(amountLabel.replace(/[^0-9.]/g, ''));

  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function parseSpentAtDate(spentAt = '') {
  const match = spentAt.match(
    /^([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/,
  );

  if (!match) {
    return null;
  }

  const [, monthLabel, dayLabel, hourLabel, minuteLabel, meridiem] = match;
  const monthIndexByLabel = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const monthIndex = monthIndexByLabel[monthLabel];

  if (monthIndex === undefined) {
    return null;
  }

  const now = new Date();
  const parsedDate = new Date(now.getFullYear(), monthIndex, Number(dayLabel));
  let hours = Number(hourLabel) % 12;

  if (meridiem === 'PM') {
    hours += 12;
  }

  parsedDate.setHours(hours, Number(minuteLabel), 0, 0);

  if (parsedDate.getTime() > now.getTime() + 24 * 60 * 60 * 1000) {
    parsedDate.setFullYear(now.getFullYear() - 1);
  }

  return parsedDate;
}

function getFilterStartDate(filterOption) {
  const now = new Date();
  const startDate = new Date(now);

  if (filterOption === FILTER_OPTIONS.TODAY) {
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  if (filterOption === FILTER_OPTIONS.SEVEN_DAYS) {
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  if (filterOption === FILTER_OPTIONS.THIRTY_DAYS) {
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);
    return startDate;
  }

  startDate.setMonth(startDate.getMonth() - 6);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
}

function ExpensesScreen() {
  const dispatch = useDispatch();
  const starterTheme = useSelector(selectStarterTheme);
  const starterDisplay = useSelector(selectStarterDisplay);
  const budgetAmount = useSelector(selectBudgetAmount);
  const expenses = useSelector(selectExpenses);
  const expensesStatus = useSelector(selectExpensesStatus);
  const expensesError = useSelector(selectExpensesError);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAddExpenseVisible, setIsAddExpenseVisible] = useState(false);
  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [isExcelVisible, setIsExcelVisible] = useState(false);
  const [pendingRemovalId, setPendingRemovalId] = useState(null);
  const [actionStatusMessage, setActionStatusMessage] = useState('');
  const [expenseMerchantName, setExpenseMerchantName] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseAmountValue, setExpenseAmountValue] = useState('');
  const [budgetInputValue, setBudgetInputValue] = useState('');
  const [isControlsDropdownVisible, setIsControlsDropdownVisible] =
    useState(false);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.TIMESTAMP);
  const [filterOption, setFilterOption] = useState(FILTER_OPTIONS.THIRTY_DAYS);
  const menuOpacity = useRef(new Animated.Value(1)).current;
  const menuTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollOffsetRef = useRef(0);
  const isMenuVisibleRef = useRef(true);
  const hasRequestedSmsPermissionRef = useRef(false);
  const totalSpent = expenses.reduce(
    (runningTotal, expense) =>
      runningTotal + parseAmountLabel(expense.amountLabel),
    0,
  );
  const remainingBudgetAmount =
    typeof budgetAmount === 'number' ? budgetAmount - totalSpent : null;
  const filteredExpenses = useMemo(() => {
    const startDate = getFilterStartDate(filterOption);

    return expenses.filter((expense) => {
      const expenseDate = parseSpentAtDate(expense.spentAt);

      if (!expenseDate) {
        return false;
      }

      return expenseDate >= startDate;
    });
  }, [expenses, filterOption]);
  const visibleExpenses = useMemo(() => {
    const sortableExpenses = [...filteredExpenses];

    if (sortOption === SORT_OPTIONS.AMOUNT_DESC) {
      return sortableExpenses.sort(
        (leftExpense, rightExpense) =>
          parseAmountLabel(rightExpense.amountLabel) -
          parseAmountLabel(leftExpense.amountLabel),
      );
    }

    if (sortOption === SORT_OPTIONS.CATEGORY_ASC) {
      return sortableExpenses.sort((leftExpense, rightExpense) => {
        const categoryCompare = leftExpense.category.localeCompare(
          rightExpense.category,
        );

        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        return (
          (leftExpense.displayOrder || 0) - (rightExpense.displayOrder || 0)
        );
      });
    }

    return sortableExpenses.sort(
      (leftExpense, rightExpense) =>
        (leftExpense.displayOrder || 0) - (rightExpense.displayOrder || 0),
    );
  }, [filteredExpenses, sortOption]);
  const shouldUseInternalListScroll =
    visibleExpenses.length > MAX_VISIBLE_EXPENSES;

  useEffect(() => {
    let isMounted = true;

    async function hydrateExpenses() {
      dispatch(expensesLoadStarted());

      try {
        const [storedExpenses, storedBudgetAmount] = await Promise.all([
          loadExpensesFromDatabase(),
          loadBudgetFromDatabase(),
        ]);

        if (isMounted) {
          dispatch(expensesHydrated(storedExpenses));
          dispatch(budgetHydrated(storedBudgetAmount));
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

  useEffect(() => {
    let isMounted = true;

    async function requestSmsPermission() {
      if (Platform.OS !== 'android' || hasRequestedSmsPermissionRef.current) {
        return;
      }

      hasRequestedSmsPermissionRef.current = true;

      try {
        const currentPermissionStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        );

        if (currentPermissionStatus) {
          return;
        }

        const permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'Allow SMS access',
            message:
              'ExpenseTracker needs SMS access to read transaction messages on this device.',
            buttonPositive: 'Allow',
            buttonNegative: 'Not now',
          },
        );

        if (!isMounted) {
          return;
        }

        if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
          setActionStatusMessage('SMS permission granted.');
          return;
        }

        if (permissionStatus === PermissionsAndroid.RESULTS.DENIED) {
          setActionStatusMessage('SMS permission denied.');
          return;
        }

        setActionStatusMessage('SMS permission blocked in Android settings.');
      } catch (error) {
        if (isMounted) {
          setActionStatusMessage(error.message);
        }
      }
    }

    requestSmsPermission();

    return () => {
      isMounted = false;
    };
  }, []);

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
    setIsControlsDropdownVisible(false);
    setIsMenuVisible(true);
  }

  function setStickyMenuVisibility(shouldShow) {
    if (isMenuVisibleRef.current === shouldShow) {
      return;
    }

    isMenuVisibleRef.current = shouldShow;
    Animated.parallel([
      Animated.timing(menuOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: shouldShow ? 180 : 140,
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: shouldShow ? 0 : -18,
        duration: shouldShow ? 180 : 140,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleCloseMenu() {
    setIsMenuVisible(false);
  }

  function handleOpenExcelView() {
    handleCloseMenu();
    setIsControlsDropdownVisible(false);
    setIsExcelVisible(true);
  }

  function handleOpenAddExpenseView() {
    handleCloseMenu();
    setIsControlsDropdownVisible(false);
    setExpenseMerchantName('');
    setExpenseCategory('');
    setExpenseAmountValue('');
    setIsAddExpenseVisible(true);
  }

  function handleOpenBudgetView() {
    handleCloseMenu();
    setIsControlsDropdownVisible(false);
    setBudgetInputValue(
      typeof budgetAmount === 'number' ? budgetAmount.toFixed(2) : '',
    );
    setIsBudgetVisible(true);
  }

  function handleCloseExcelView() {
    setIsExcelVisible(false);
  }

  function handleCloseAddExpenseView() {
    setIsAddExpenseVisible(false);
  }

  function handleCloseBudgetView() {
    setIsBudgetVisible(false);
  }

  async function handleExportCsv() {
    handleCloseMenu();
    setIsControlsDropdownVisible(false);

    try {
      const exportedFileUri = await exportExpensesCsv(visibleExpenses);
      setActionStatusMessage(`CSV exported from ${exportedFileUri}`);
    } catch (error) {
      setActionStatusMessage(error.message);
    }
  }

  async function handleSaveBudget() {
    const parsedBudget = Number.parseFloat(budgetInputValue);

    if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
      setActionStatusMessage('Enter a valid budget amount before saving.');
      return;
    }

    try {
      const savedBudgetAmount = await upsertBudgetInDatabase(parsedBudget);
      dispatch(budgetHydrated(savedBudgetAmount));
      setActionStatusMessage(
        `Budget saved at $${savedBudgetAmount.toFixed(2)}`,
      );
      handleCloseBudgetView();
    } catch (error) {
      setActionStatusMessage(error.message);
    }
  }

  async function handleSaveExpense() {
    const parsedAmount = Number.parseFloat(expenseAmountValue);

    if (!expenseMerchantName.trim() || !expenseCategory.trim()) {
      setActionStatusMessage('Enter a merchant and category before saving.');
      return;
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setActionStatusMessage('Enter a valid expense amount before saving.');
      return;
    }

    try {
      const nextExpense = await addExpenseToDatabase({
        merchantName: expenseMerchantName,
        category: expenseCategory,
        amount: parsedAmount,
      });

      dispatch(expenseAdded(nextExpense));
      setActionStatusMessage('Expense saved to the local SQLite database.');
      handleCloseAddExpenseView();
    } catch (error) {
      setActionStatusMessage(error.message);
    }
  }

  function handleToggleControlsDropdown() {
    setIsControlsDropdownVisible((currentValue) => !currentValue);
  }

  function handleCloseControlsDropdown() {
    setIsControlsDropdownVisible(false);
  }

  function handleSelectSortOption(nextSortOption) {
    setSortOption(nextSortOption);
    handleCloseControlsDropdown();
  }

  function handleSelectFilterOption(nextFilterOption) {
    setFilterOption(nextFilterOption);
    handleCloseControlsDropdown();
  }

  function handleScreenScroll(event) {
    const nextOffsetY = event.nativeEvent.contentOffset.y;

    if (nextOffsetY <= 12) {
      setStickyMenuVisibility(true);
    } else if (nextOffsetY > lastScrollOffsetRef.current + 8) {
      setStickyMenuVisibility(false);
      setIsControlsDropdownVisible(false);
    } else if (nextOffsetY < lastScrollOffsetRef.current - 8) {
      setStickyMenuVisibility(true);
    }

    lastScrollOffsetRef.current = nextOffsetY;
  }

  function renderExpenseItems() {
    return visibleExpenses.map((expense) => (
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
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyMenuWrap,
          {
            opacity: menuOpacity,
            transform: [{ translateY: menuTranslateY }],
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open expenses menu"
          onPress={handleOpenMenu}
          style={({ pressed }) => [
            styles.stickyMenuButton,
            pressed ? styles.stickyMenuButtonPressed : null,
          ]}
        >
          <EllipsisHorizontalCircleIcon
            color={appTheme.colors.textPrimary}
            size={20}
          />
          <Text style={styles.stickyMenuLabel}>Menu</Text>
        </Pressable>
      </Animated.View>
      {isControlsDropdownVisible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sort and filter options"
          onPress={handleCloseControlsDropdown}
          style={styles.controlsDismissOverlay}
        />
      ) : null}
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScreenScroll}
        scrollEventThrottle={16}
      >
        <ExpensesOverviewCard
          productName={starterDisplay.productName}
          expenses={visibleExpenses}
          budgetAmount={budgetAmount}
          remainingBudgetAmount={remainingBudgetAmount}
        />
        <CategoryBarChart expenses={visibleExpenses} />
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <View>
              <Text style={styles.listEyebrow}>Ledger</Text>
              <Text style={styles.listTitle}>Recent expenses</Text>
            </View>
            <View style={styles.controlsRow}>
              <View style={styles.controlWrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open sort and filter options"
                  onPress={handleToggleControlsDropdown}
                  style={({ pressed }) => [
                    styles.controlTrigger,
                    pressed ? styles.controlTriggerPressed : null,
                  ]}
                >
                  <ArrowsUpDownIcon
                    color={appTheme.colors.textPrimary}
                    size={16}
                  />
                  <Text style={styles.controlSlash}>/</Text>
                  <FunnelIcon color={appTheme.colors.textPrimary} size={16} />
                  <ChevronDownIcon
                    color={appTheme.colors.textPrimary}
                    size={16}
                  />
                </Pressable>
                <Text style={styles.controlCurrentValue}>
                  {SORT_OPTION_LABELS[sortOption]}
                  {' / '}
                  {FILTER_OPTION_LABELS[filterOption]}
                </Text>
                {isControlsDropdownVisible ? (
                  <View style={styles.controlDropdownMenu}>
                    <View style={styles.controlSection}>
                      <Text style={styles.controlSectionLabel}>Sort</Text>
                      {Object.entries(SORT_OPTION_LABELS).map(
                        ([optionValue, optionLabel]) => (
                          <Pressable
                            key={optionValue}
                            onPress={() => handleSelectSortOption(optionValue)}
                            style={styles.controlDropdownItem}
                          >
                            <Text
                              style={[
                                styles.controlDropdownItemLabel,
                                optionValue === sortOption
                                  ? styles.controlDropdownItemLabelActive
                                  : null,
                              ]}
                            >
                              {optionLabel}
                            </Text>
                            {optionValue === sortOption ? (
                              <CheckIcon
                                color={appTheme.colors.accent}
                                size={16}
                              />
                            ) : null}
                          </Pressable>
                        ),
                      )}
                    </View>
                    <View style={styles.controlSectionDivider} />
                    <View style={styles.controlSection}>
                      <Text style={styles.controlSectionLabel}>Filter</Text>
                      {Object.entries(FILTER_OPTION_LABELS).map(
                        ([optionValue, optionLabel]) => (
                          <Pressable
                            key={optionValue}
                            onPress={() =>
                              handleSelectFilterOption(optionValue)
                            }
                            style={styles.controlDropdownItem}
                          >
                            <Text
                              style={[
                                styles.controlDropdownItemLabel,
                                optionValue === filterOption
                                  ? styles.controlDropdownItemLabelActive
                                  : null,
                              ]}
                            >
                              {optionLabel}
                            </Text>
                            {optionValue === filterOption ? (
                              <CheckIcon
                                color={appTheme.colors.accent}
                                size={16}
                              />
                            ) : null}
                          </Pressable>
                        ),
                      )}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          {actionStatusMessage ? (
            <Text style={styles.stateMessage}>{actionStatusMessage}</Text>
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
          {expensesStatus === 'ready' && visibleExpenses.length === 0 ? (
            <Text style={styles.stateMessage}>
              No expenses match the current filter.
            </Text>
          ) : null}
        </View>
      </Animated.ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={isMenuVisible}
        onRequestClose={handleCloseMenu}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleCloseMenu}>
          <View style={styles.menuCard}>
            <Pressable
              style={styles.menuItem}
              onPress={handleOpenAddExpenseView}
            >
              <Text style={styles.menuTitle}>Add Expense</Text>
              <Text style={styles.menuCaption}>
                Save a manual expense to the local SQLite database
              </Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleOpenExcelView}>
              <Text style={styles.menuTitle}>View Excel</Text>
              <Text style={styles.menuCaption}>
                Open the compact table view
              </Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleOpenBudgetView}>
              <Text style={styles.menuTitle}>Enter Budget</Text>
              <Text style={styles.menuCaption}>
                Save a spending budget to the local database
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
        visible={isAddExpenseVisible}
        onRequestClose={handleCloseAddExpenseView}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.addExpenseCard}>
            <View style={styles.excelHeader}>
              <View>
                <Text style={styles.excelEyebrow}>Add Expense</Text>
                <Text style={styles.excelTitle}>Save to local SQLite</Text>
              </View>
              <Pressable
                style={styles.menuDismissButton}
                onPress={handleCloseAddExpenseView}
              >
                <Text style={styles.menuDismissLabel}>Close</Text>
              </Pressable>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Merchant</Text>
              <TextInput
                placeholder="Cedar House Cafe"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={expenseMerchantName}
                onChangeText={setExpenseMerchantName}
                style={styles.budgetInput}
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Category</Text>
              <TextInput
                placeholder="Dining"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={expenseCategory}
                onChangeText={setExpenseCategory}
                style={styles.budgetInput}
              />
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Amount</Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="24.50"
                placeholderTextColor={appTheme.colors.textSecondary}
                value={expenseAmountValue}
                onChangeText={setExpenseAmountValue}
                style={styles.budgetInput}
              />
            </View>
            <Text style={styles.menuCaption}>
              The expense is stored offline in SQLite and timestamped with the
              current device time.
            </Text>
            <Pressable
              style={styles.saveBudgetButton}
              onPress={handleSaveExpense}
            >
              <Text style={styles.saveBudgetLabel}>Save Expense</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={isBudgetVisible}
        onRequestClose={handleCloseBudgetView}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.budgetCard}>
            <View style={styles.excelHeader}>
              <View>
                <Text style={styles.excelEyebrow}>Budget</Text>
                <Text style={styles.excelTitle}>Enter monthly budget</Text>
              </View>
              <Pressable
                style={styles.menuDismissButton}
                onPress={handleCloseBudgetView}
              >
                <Text style={styles.menuDismissLabel}>Close</Text>
              </Pressable>
            </View>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="2500.00"
              placeholderTextColor={appTheme.colors.textSecondary}
              value={budgetInputValue}
              onChangeText={setBudgetInputValue}
              style={styles.budgetInput}
            />
            <Text style={styles.menuCaption}>
              Remaining budget is calculated automatically below the saved
              total.
            </Text>
            <Pressable
              style={styles.saveBudgetButton}
              onPress={handleSaveBudget}
            >
              <Text style={styles.saveBudgetLabel}>Save Budget</Text>
            </Pressable>
          </View>
        </View>
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
              expenses={visibleExpenses}
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
    paddingTop: STICKY_MENU_TOP_OFFSET + 52,
    paddingBottom: 32,
  },
  stickyMenuWrap: {
    position: 'absolute',
    top: STICKY_MENU_TOP_OFFSET,
    right: 24,
    zIndex: 8,
  },
  controlsDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 4,
  },
  stickyMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: appTheme.spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surfaceElevated,
  },
  stickyMenuButtonPressed: {
    opacity: 0.88,
  },
  stickyMenuLabel: {
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.label,
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
  budgetCard: {
    margin: 24,
    padding: appTheme.spacing.lg,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.lg,
  },
  addExpenseCard: {
    margin: 24,
    padding: appTheme.spacing.lg,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.md,
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
  formField: {
    gap: appTheme.spacing.xs,
  },
  formLabel: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  budgetInput: {
    paddingVertical: appTheme.spacing.md,
    paddingHorizontal: appTheme.spacing.md,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surface,
    color: appTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  saveBudgetButton: {
    alignSelf: 'flex-start',
    paddingVertical: appTheme.spacing.md,
    paddingHorizontal: appTheme.spacing.lg,
    borderRadius: appTheme.radii.md,
    backgroundColor: appTheme.colors.primary,
  },
  saveBudgetLabel: {
    color: appTheme.colors.textPrimary,
    ...appTheme.typography.label,
  },
  listCard: {
    paddingHorizontal: appTheme.spacing.md,
    paddingVertical: appTheme.spacing.md,
    borderRadius: appTheme.radii.lg,
    backgroundColor: appTheme.colors.surface,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    gap: appTheme.spacing.md,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: appTheme.spacing.md,
    zIndex: 6,
  },
  listEyebrow: {
    marginBottom: appTheme.spacing.xs,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  listTitle: {
    color: appTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  controlsRow: {
    alignItems: 'flex-end',
  },
  controlWrap: {
    position: 'relative',
    alignItems: 'flex-end',
    zIndex: 7,
  },
  controlTrigger: {
    minWidth: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: appTheme.spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: 'transparent',
  },
  controlTriggerPressed: {
    backgroundColor: 'rgba(243, 236, 255, 0.05)',
  },
  controlSlash: {
    color: appTheme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  controlCurrentValue: {
    marginTop: appTheme.spacing.xs,
    color: appTheme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  controlDropdownMenu: {
    position: 'absolute',
    top: 54,
    right: 0,
    minWidth: 212,
    zIndex: 8,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    backgroundColor: appTheme.colors.surfaceElevated,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  controlSection: {
    paddingVertical: appTheme.spacing.xs,
  },
  controlSectionLabel: {
    paddingTop: appTheme.spacing.sm,
    paddingHorizontal: appTheme.spacing.md,
    paddingBottom: appTheme.spacing.xs,
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.label,
  },
  controlSectionDivider: {
    height: 1,
    backgroundColor: appTheme.colors.border,
  },
  controlDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: appTheme.spacing.md,
  },
  controlDropdownItemLabel: {
    color: appTheme.colors.textSecondary,
    ...appTheme.typography.body,
  },
  controlDropdownItemLabelActive: {
    color: appTheme.colors.textPrimary,
  },
  internalListScroller: {
    maxHeight: INTERNAL_LIST_MAX_HEIGHT,
  },
  internalListContent: {
    gap: 10,
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
