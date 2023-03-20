module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/eslint-recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    // browser: true,
    node: true,
  },
  rules: {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
          'log',
          'trace'
        ]
      }
    ],
    'keyword-spacing': 1,
    'space-before-blocks': [1, 'always'],
    'space-before-function-paren': [1, 'always'],
    'no-mixed-spaces-and-tabs': [2, false],
    'spaced-comment': 1,
    'no-eq-null': 0,
    'no-multiple-empty-lines': 1,
    'object-property-newline': 0,
    'no-unused-expressions': 0,
    'no-useless-escape': 0,
    'no-useless-return': 0,
    'space-unary-ops': 0,
    'no-unreachable': 0,
    '@typescript-eslint/no-unused-vars': 1
  }
}