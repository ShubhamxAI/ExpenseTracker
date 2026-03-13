import { createSlice } from '@reduxjs/toolkit';

import { STARTER_DISPLAY } from '../../constants/starterDisplay';
import { appTheme } from '../../theme/appTheme';
import { loadStarterConfig } from '../../utils/loadStarterConfig';

const starterConfig = loadStarterConfig();

const initialState = {
  productName: STARTER_DISPLAY.PRODUCT_NAME,
  greetingMessage: starterConfig.greetingMessage,
  baselineLabel: starterConfig.baselineLabel,
  heroIconName: STARTER_DISPLAY.STARTER_ICON_NAME,
  isOfflineCapable: true,
  buildVariant: 'debug',
  theme: appTheme,
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
  },
});

const { refreshStarterConfig } = starterSlice.actions;

export { refreshStarterConfig };
export default starterSlice.reducer;
