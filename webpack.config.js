const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Odin-Project: Todo List',
    template: './src/home.html',
    inject: 'head',
  })],
};