import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import StarterCard from '../components/StarterCard';
import { STARTER_DISPLAY } from '../constants/starterDisplay';
import {
  selectStarterDisplay,
  selectStarterTheme,
} from '../features/starter/starterSelectors';

function StarterScreen() {
  const starterDisplay = useSelector(selectStarterDisplay);
  const starterTheme = useSelector(selectStarterTheme);

  return (
    <View
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
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {STARTER_DISPLAY.SPLASH_FOOTER_TEXT}
          </Text>
        </View>
      </View>
    </View>
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
  footer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    left: 24,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(243, 236, 255, 0.72)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default StarterScreen;
