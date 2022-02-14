module.exports = {
  root: true,
  extends: ['@react-native-community', 'standard'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 0,
    'jsx-quotes': ['error', 'prefer-single'],
    prettier: {
      'space-before-function-paren': ['error', 'never'],
    },
  },
};

// module.exports = {
//   env: {
//     es2021: true,
//     node: true,
//   },
//   extends: [
//     'plugin:react/recommended',
//     'airbnb',
//   ],
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaFeatures: {
//       jsx: true,
//     },
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   plugins: [
//     '@typescript-eslint',
//   ],
//   root: true,
//   rules: {
//     'import/extensions': [
//       'error',
//       'ignorePackages',
//       {
//         js: 'never',
//         jsx: 'never',
//         ts: 'never',
//         tsx: 'never',
//       },
//     ],
//     'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
//     'no-use-before-define': 'off',
//     '@typescript-eslint/no-use-before-define': ['error'],
//   },
//   settings: {
//     'import/resolver': {
//       node: {
//         extensions: ['.js', '.jsx', '.ts', '.tsx'],
//       },
//     },
//   },
// };
