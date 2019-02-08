/**
 * 按需加载babel-polyfill的关键是useBuiltIns选项，默认值为false，它的值有三种：
 * false: 不对polyfills做任何操作
 * entry: 根据target中浏览器版本的支持，将polyfills拆分引入，仅引入有浏览器不支持的polyfill
 * usage(新)：检测代码中ES6/7/8等的使用情况，仅仅加载代码中用到的polyfills
 */
module.exports = {
  "presets": [
    [
      "@babel/preset-env", 
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 10"]
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}