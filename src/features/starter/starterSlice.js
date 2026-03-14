import { createSlice } from '@reduxjs/toolkit';

import { STARTER_DISPLAY } from '../../constants/starterDisplay';
import { appTheme } from '../../theme/appTheme';

const initialState = {
  productName: STARTER_DISPLAY.PRODUCT_NAME || 'ExpenseTracker',
  greetingMessage:
    STARTER_DISPLAY.SPLASH_GREETING_MESSAGE || 'Welcome to ExpenseTracker',
  baselineLabel: STARTER_DISPLAY.SPLASH_BASELINE_LABEL || '',
  heroIconName: STARTER_DISPLAY.STARTER_ICON_NAME || 'ShieldCheckIcon',
  mainIconName: STARTER_DISPLAY.MAIN_ICON_NAME || 'BanknotesIcon',
  isOfflineCapable: true,
  buildVariant: 'debug',
  theme: appTheme,
  expenses: [],
  budgetAmount: null,
  expensesStatus: 'idle',
  expensesError: null,
};

const starterSlice = createSlice({
  name: 'starter',
  initialState,
  reducers: {
    expensesLoadStarted: (state) => {
      state.expensesStatus = 'loading';
      state.expensesError = null;
    },
    expensesHydrated: (state, action) => {
      state.expenses = action.payload;
      state.expensesStatus = 'ready';
      state.expensesError = null;
    },
    budgetHydrated: (state, action) => {
      state.budgetAmount = action.payload;
    },
    expensesLoadFailed: (state, action) => {
      state.expensesStatus = 'error';
      state.expensesError = action.payload;
    },
    expenseAdded: (state, action) => {
      state.expenses.push(action.payload);
    },
    expenseRemoved: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload,
      );
    },
  },
});

const {
  budgetHydrated,
  expenseAdded,
  expenseRemoved,
  expensesHydrated,
  expensesLoadFailed,
  expensesLoadStarted,
} = starterSlice.actions;

export {
  budgetHydrated,
  expenseAdded,
  expenseRemoved,
  expensesHydrated,
  expensesLoadFailed,
  expensesLoadStarted,
};
export default starterSlice.reducer;
