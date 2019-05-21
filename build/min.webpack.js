const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const baseConfig = require('./webpack.baseConfig.js');

module.exports = Object.assign(
  {},
  baseConfig,
  {
    mode: 'production',
    output: {
      libraryTarget: 'commonjs',
      filename: '[name].min.js',
    },
    optimization: {
      minimize: true
    }
  }
)
