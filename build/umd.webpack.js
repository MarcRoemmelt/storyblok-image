const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const baseConfig = require('./webpack.baseConfig.js');

module.exports = Object.assign(
  {},
  baseConfig,
  {
    entry: './src/lazy-responsive-storyblok-img.vue',
    mode: 'production',
    output: {
      library: 'lazy-responsive-storyblok-img',
      libraryTarget: 'umd',
      filename: 'lazy-responsive-storyblok-img.umd.js',
      umdNamedDefine: true
    },
    optimization: {
      minimize: false
    },
  }
)