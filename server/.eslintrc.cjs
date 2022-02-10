module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
  },
};
