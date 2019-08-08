const base = require('@umijs/fabric/dist/eslint');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    'eslint-comments/disable-enable-pair': 0,
    'react/require-default-props': 0,
    'react/no-unused-prop-types': 1,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
  },
};