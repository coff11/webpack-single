const { smart } = require('webpack-merge')
const base = require('./webpack.base.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 处理css压缩后js不压缩的问题
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = smart(base, {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:5].css'
    })
  ],
  output: {
    // publicPath: 'http://www.cdn.com'
  }
})
