const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const es3ifyPlugin = require('es3ify-webpack-plugin')
const GasPlugin = require('gas-webpack-plugin')

module.exports = {
  entry: {
    'sample': './src/sample/app.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  optimization: {
    minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: false,
                mangle: false,
                beautify: false,
                output: {
                    quote_keys: true
                }
            }
        })
    ]
  },
  plugins: [
    new GasPlugin(),
    new es3ifyPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeAttributeQuotes: false
            }
          }
        ]
      }
    ]
  }
}
