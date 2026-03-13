module.exports = {
  root: true,
  extends: ['airbnb-base', '@react-native', 'prettier'],
  env: {
    es2023: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json'],
      },
    },
  },
  overrides: [
    {
      files: [
        'babel.config.js',
        'metro.config.js',
        '.eslintrc.js',
        '.prettierrc.js',
      ],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-commonjs': 'error',
    'no-param-reassign': ['error', { props: false }],
    'react/react-in-jsx-scope': 'off',
  },
};
