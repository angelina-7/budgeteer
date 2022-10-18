const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    dashboard: './src/dashboard.js',
    expenses: './src/expenses.js',
    budget: './src/budget.js',
    summary: './src/summary.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './'),
    },
    hot: true,
    port: 9000,
  },
};
