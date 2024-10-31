const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Add aliases for Ace Editor
  config.resolve.alias = {
    ...config.resolve.alias,
    'ace-builds': path.resolve(__dirname, 'node_modules/ace-builds')
  };

  return config;
};