const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const host = 'localhost'
const port = 3000

module.exports = {
  entry: [
    `webpack-dev-server/client?http://${host}:${port}`,
    path.resolve(__dirname, 'examples/index'),
  ],
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'react-axios-hoc': path.resolve(__dirname),
    },
  },
  devServer: {
    host,
    port,
    stats: 'minimal',
    historyApiFallback: true,
  },
}
