# webpack-single

## 介绍
🚀基于webpack的单页应用脚手架。


## 使用

- **clone**
```
$ git clone git@github.com:coff11/webpack-single.git
```

- **install**
```
$ npm install
```

- **dev**
```
$ npm run dev
```

- **build**
```
$ npm run build
```

## 说明

脚手架会以src/js/index.js作为项目入口，将public中的index.html作为初始模板生成单页应用。

- css相关

需要编译打包的css(less, sass, stylus)文件放在src/css中，然后在index.js中引入，即可实现自动打包至html。
```
// style.styl 文件
body
  color #fc0

// index.js 文件
import '../css/style.styl'

```

- js相关

如果是需要编译打包的js文件直接放在src/js文件夹下即可，webpack会自动根据依赖关系进行打包。另外的情况：
  1. 通过npm install安装的js模块，如jquery等，直接在index.js中import $ from 'jquery'即可
  2. 如果有文件不希望webpack打包编译，如第三方的已经编译过的lib.min.js，则可以放在public/js中，然后在index.html中手动引入即可。

- 字体

字体文件可以放在src/assets/fonts目录中，css放在src/css目录，然后就可以在index.html中直接使用：
```
// index.html 文件
<span class="iconfont">&#xe653;</span>

```

- 图片

图片可以放在src/images目录，webpack会自动压缩打包并插入到相关文件中。

## 特性

