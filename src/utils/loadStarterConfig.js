import starterConfig from '../config/starterConfig';
import starterConfigExample from '../config/starterConfig.example';

function normalizeString({ value, fallbackValue } = {}) {
  if (typeof value !== 'string') {
    return fallbackValue;
  }

  const trimmedValue = value.trim();

  return trimmedValue || fallbackValue;
}

function loadStarterConfig() {
  const sourceConfig = starterConfig || starterConfigExample;

  return {
    greetingMessage: normalizeString({
      value: sourceConfig.greetingMessage,
      fallbackValue: starterConfigExample.greetingMessage,
    }),
    baselineLabel: normalizeString({
      value: sourceConfig.baselineLabel,
      fallbackValue: starterConfigExample.baselineLabel,
    }),
  };
}

export { loadStarterConfig };
