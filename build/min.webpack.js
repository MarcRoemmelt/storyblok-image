const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const baseConfig = require('./webpack.baseConfig.js');

module.exports = Object.assign(
  {},
  baseConfig,
  {
    entry: './src/index.js',
    mode: 'production',
    output: {
      libraryTarget: 'window',
      library: 'StoryblokImage',
      filename: 'lazy-responsive-storyblok-img.min.js',
    },
    optimization: {
      minimize: true
    }
  }
)
