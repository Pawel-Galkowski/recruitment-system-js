module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'linebreak-style': 'off',
    'default-param-last': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'no-shadow': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'no-nested-ternary': 'off',
    'no-return-assign': 'off',
    'no-alert': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
  },
};
