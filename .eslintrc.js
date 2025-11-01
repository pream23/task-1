/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: [
      'next',
      'eslint:recommended',
      'plugin:tailwindcss/recommended',
      'prettier',
    ],
    plugins: ['tailwindcss'],
    rules: {
      // Add any custom rules here
    },
  };
  