const selectStarterState = (state) => state.starter;

const selectStarterDisplay = (state) => ({
  productName: state.starter.productName,
  greetingMessage: state.starter.greetingMessage,
  baselineLabel: state.starter.baselineLabel,
  heroIconName: state.starter.heroIconName,
});

const selectStarterTheme = (state) => state.starter.theme;

export { selectStarterDisplay, selectStarterState, selectStarterTheme };
