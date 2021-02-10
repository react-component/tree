module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  rules: {
    'react/sort-comp': 0,
    'default-case': 0,
    'eslint-comments/disable-enable-pair': 0,
    'react/require-default-props': 0,
    'react/no-unused-prop-types': 1,
    'react-hooks/exhaustive-deps': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-loop-func': 0,
    '@typescript-eslint/no-loop-func': 0,
    '@typescript-eslint/consistent-type-imports': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    'max-classes-per-file': 0,
  },
};
