import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import StarterCard from '../components/StarterCard';
import {
  selectStarterDisplay,
  selectStarterTheme,
} from '../features/starter/starterSelectors';

function StarterScreen() {
  const starterDisplay = useSelector(selectStarterDisplay);
  const starterTheme = useSelector(selectStarterTheme);

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: starterTheme.colors.background },
      ]}
    >
      <View style={styles.content}>
        <StarterCard
          productName={starterDisplay.productName}
          greetingMessage={starterDisplay.greetingMessage}
          baselineLabel={starterDisplay.baselineLabel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

export default StarterScreen;
