const path = require('path');

module.exports = {
  "stories": [
    {
      directory: '../node_modules/@nobodyz/productivity-clock_ui',
      titlePrefix: '@nobodyz/productivity-clock_ui',
      files: './**/*.stories.@(js|jsx|ts|tsx)',
    },
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  webpackFinal: async (config, {
    configType
  }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  },
  core: {
    builder: {
      name: 'webpack5'
    }
  }
}