import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import StarterScreen from './src/pages/StarterScreen';
import { store } from './src/redux/store';
import { appTheme } from './src/theme/appTheme';

function App() {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={appTheme.colors.background}
      />
      <StarterScreen />
    </Provider>
  );
}

export default App;
