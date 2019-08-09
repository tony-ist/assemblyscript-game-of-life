const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    bundle: './src/index.js',
    benchmark: './src/benchmark.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: [ '.js' ]
  },
  module: {
    defaultRules: [
      {
        type: "javascript/auto",
        resolve: {}
      },
      {
        test: /\.json$/i,
        type: "json"
      }
    ],
    rules: [
      {
        test: /\.wasm$/,
        use: 'wasm-loader'
      }
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'html', 'index.html'), to: path.resolve(__dirname, 'dist') },
      { from: path.resolve(__dirname, 'html', 'benchmark.html'), to: path.resolve(__dirname, 'dist') }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
