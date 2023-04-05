module.exports = {
  extends: [
    'turbo',
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'sort-imports-es6-autofix'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'import/order': 'off',
    'sort-imports': 'off',
    'sort-imports-es6-autofix/sort-imports-es6': [2, {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
    }]
  }
};