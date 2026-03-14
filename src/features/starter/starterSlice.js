import { createSlice } from '@reduxjs/toolkit';

import { STARTER_DISPLAY } from '../../constants/starterDisplay';
import { starterSeedExpenses } from '../../data/expenseDatabase';
import { appTheme } from '../../theme/appTheme';
import { loadStarterConfig } from '../../utils/loadStarterConfig';

const starterConfig = loadStarterConfig();

const initialState = {
  productName: STARTER_DISPLAY.PRODUCT_NAME,
  greetingMessage: starterConfig.greetingMessage,
  baselineLabel: starterConfig.baselineLabel,
  heroIconName: STARTER_DISPLAY.STARTER_ICON_NAME,
  mainIconName: STARTER_DISPLAY.MAIN_ICON_NAME,
  isOfflineCapable: true,
  buildVariant: 'debug',
  theme: appTheme,
  expenses: starterSeedExpenses,
  expensesStatus: 'idle',
  expensesError: null,
};

const starterSlice = createSlice({
  name: 'starter',
  initialState,
  reducers: {
    refreshStarterConfig: (state) => {
      const refreshedConfig = loadStarterConfig();

      state.greetingMessage = refreshedConfig.greetingMessage;
      state.baselineLabel = refreshedConfig.baselineLabel;
    },
    expensesLoadStarted: (state) => {
      state.expensesStatus = 'loading';
      state.expensesError = null;
    },
    expensesHydrated: (state, action) => {
      state.expenses = action.payload;
      state.expensesStatus = 'ready';
      state.expensesError = null;
    },
    expensesLoadFailed: (state, action) => {
      state.expensesStatus = 'error';
      state.expensesError = action.payload;
    },
    expenseRemoved: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload,
      );
    },
  },
});

const {
  expenseRemoved,
  expensesHydrated,
  expensesLoadFailed,
  expensesLoadStarted,
  refreshStarterConfig,
} = starterSlice.actions;

export {
  expenseRemoved,
  expensesHydrated,
  expensesLoadFailed,
  expensesLoadStarted,
  refreshStarterConfig,
};
export default starterSlice.reducer;
