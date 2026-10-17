const js = require('@eslint/js');
const globals = require('globals');
const pluginCypress = require('eslint-plugin-cypress');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['cypress.config.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['cypress/**/*.js'],
    ...pluginCypress.configs.recommended,
  },
  prettier,
];
