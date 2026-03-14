import { createSelector } from '@reduxjs/toolkit';

const selectStarterState = (state) => state.starter;

const selectStarterDisplay = createSelector(
  [selectStarterState],
  (starterState) => ({
    productName: starterState.productName,
    greetingMessage: starterState.greetingMessage,
    baselineLabel: starterState.baselineLabel,
    heroIconName: starterState.heroIconName,
    mainIconName: starterState.mainIconName,
  }),
);

const selectStarterTheme = (state) => state.starter.theme;

const selectExpenses = (state) => state.starter.expenses;

const selectExpensesStatus = (state) => state.starter.expensesStatus;

const selectExpensesError = (state) => state.starter.expensesError;

export {
  selectExpenses,
  selectExpensesError,
  selectExpensesStatus,
  selectStarterDisplay,
  selectStarterState,
  selectStarterTheme,
};
