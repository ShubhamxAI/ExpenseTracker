import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import { STARTER_DISPLAY } from './src/constants/starterDisplay';
import ExpensesScreen from './src/pages/ExpensesScreen';
import StarterScreen from './src/pages/StarterScreen';
import { store } from './src/redux/store';
import { ensureExpenseNotificationPermissionsAsync } from './src/utils/expenseNotifications';

function AppContent() {
  const [activeStage, setActiveStage] = useState(
    STARTER_DISPLAY.FLOW_STAGES.SPLASH,
  );

  useEffect(() => {
    ensureExpenseNotificationPermissionsAsync();

    const splashTimer = setTimeout(() => {
      setActiveStage(STARTER_DISPLAY.FLOW_STAGES.MAIN);
    }, STARTER_DISPLAY.SPLASH_DURATION_MS);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  if (activeStage === STARTER_DISPLAY.FLOW_STAGES.SPLASH) {
    return <StarterScreen />;
  }

  return <ExpensesScreen />;
}

function App() {
  return (
    <Provider store={store}>
      <StatusBar hidden translucent barStyle="light-content" />
      <AppContent />
    </Provider>
  );
}

export default App;
