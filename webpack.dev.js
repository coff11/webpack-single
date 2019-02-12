const path = require('path')

const { smart } = require('webpack-merge')
const base = require('./webpack.base.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    port: 9000,
    progress: true,
    contentBase: path.resolve(__dirname, 'dist'),
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ]
})
