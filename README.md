## 前言
为了解决编译、打包、处理缓存等一系列前端的工程化问题，之前使用`Parcel`搭建了一个简单的单页应用打包器，实现了一些基础打包功能，但是由于`Parcel`零配置的特性以及文档和相关资料的稀缺，整体上来说还是有一些功能未能很好地实现，所以抽时间搭建了这个基于`webpack`的单页应用脚手架。

后续使用过程中出现的问题或者项目需要实现更丰富的配置等则需要大家一起来完善。

## 主要环境参数
```
> webpack 4.x
> babel 7.x
```

## 使用场景
首先考虑一下自身项目的**技术栈**：
- 如果打算使用`vue`全家桶或者`react`全家桶，则推荐使用官方的`vue-cli`或者`create-react-app`来生成项目。
- 如果是一个中小型项目，可能项目中只会用到`vue`本身或者`jquery`等技术，则可以考虑使用这个脚手架。
 

## 脚手架  
- **从github获取**
```
$ git clone git@github.com:coff11/webpack-single.git
```

- **安装依赖**
```
$ npm install
```

- **本地开发**
```
$ npm run dev
```

- **生产构建**
```
$ npm run build
```

## 运行机制

脚手架会以`src/index.js`作为项目入口，将`public`目录下的`index.html`作为初始模板生成单页应用。开发过程中，只需将所有要编译的源文件放在`src`目录下，不需要编译的静态资源放在`public`目录下即可。

**关于html：**

我们所有的`DOM`结构等都应当直接写在`index.html`中，另外有一些需要说明的地方：
1. 我们不需要在`index.html`中手动引入`src`下的`js`、`css`等文件，只要依赖关系正确，这些文件在编译完成之后会被自动插入到`index.html`中。我们需要关注的是一些不用编译的第三方库文件，比如`jquery.min.js`，这类文件应当直接放在`public`目录下，并且需要手动在`index.html`中引入。打包之后这些静态文件会被原封不动地引入`index.html`，所以当我们使用了`cdn`路径时，需要手动更改这类路径。
2. 经过了配置，现在你在`index.html`中可以使用`img`标签，引用`src`目录下的图片文件在打包完成之后路径将被正确替换为打包后的路径。

**关于css：**

因为不知道你中意哪一款css预处理器，所以在脚手架中默认支持三种预处理器：`less`, `sass`, `stylus`。所以不论你使用哪一种，都可以被正确编译打包，当然代价是初始化执行`npm install`时需要多等待几秒钟时间。

因为项目的入口是`index.js`，所以编写完成的`css`文件需要在`index.js`中引入：

```
// style.styl 文件
body
  color #fc0
  background url('../images/bg.png') no-repeat

// reset.css 文件
body {
  margin: 0;
}

// index.js 文件
import '../css/style.styl'
import '../css/reset.css'

```

**关于js：**

通常项目中会有多种类型的`js`文件：
1. 自己编写的`js`文件，需要在入口文件`index.js`中引入：
    ```
    // a.js 文件
    console.log('a')
    
    // b.js 文件
    console.log('b')
    
    // index.js 文件
    import './a'
    import './b'
    ```
2. 通过`npm`安装的也需要在入口文件`index.js`中引入：
    ```
    // bash
    $ npm install jquery
    
    // index.js 文件
    import $ from 'jquery'
    
    // 类似于jquery的库也可以通过webpack插件ProvidePlugin将$注入到全局，这里不详细讨论
    ```
3. 本地的一些第三方库文件，则直接在html中引入即可：
    ```
    // index.html 文件
    <script src="./js/libs.min.js"></script>
    
    /*
        通过这种方式引入的js库
        在index.js中使用引入库中的变量可能会被eslint抛错不予编译
        实际是可以拿到变量的
        比如通过script标签引入jquery，然后在index.js中访问$
        eslint会抛错，'$' is not defined
        实际在index.js中是可以拿到$变量的
    */ 
    
    ```

**关于图片：**

默认情况下，脚手架会对`src`目录下的图片先进行压缩然后打包，如果不需要压缩功能则可以参考后面的配置手动关闭。

**关于字体：**

脚手架已经配置了相关功能，可以对字体文件打包处理，建议字体源文件放在`src/assets/fonts`目录下，css文件放在`src/assets/css`文件下。这种情况下需要手动更改一下`css`文件中的字体文件的引用路径。

**关于vue文件：**

脚手架支持了直接以单文件方式使用vue，即可以直接使用`.vue`文件，具体使用方式参考下文的说明。


## 支持的特性

**eslint校验代码**

脚手架默认开启`eslint`对`js`代码进行校验，校验出错的情况下编译将不被允许。校验规则采用的是`Standard`，`eslint`的所有规则都是可插拔的，具体可以参考[Rules](https://cn.eslint.org/docs/rules/)。

当`devServer`运行抛错或者编译未通过时，查看终端是否有`eslint`的报错，针对相关提示修改代码使其符合规范即可，但是需要注意`eslint`的校验也不是完全正确的，可以作为参考即可。

当然，如果你觉得`eslint`过于繁琐，也可以手动关闭它：
```
// webpack.base.js
// 删除前面带 - 的行即可
  {
    test: /\.js$/,
    use: [
      'babel-loader',
-     {
-       loader: 'eslint-loader',
-       options: {
-         formatter: require('eslint-friendly-formatter')
-       }
-     }
    ],
    exclude: '/node_modules',
    include: path.resolve(__dirname, './src')
  },
```

**支持es6+及按需polyfill**

脚手架实现了根据配置的浏览器环境自动编译需要编译的代码，也就是说在项目中你可以随意使用`es6+`的特性，比如箭头函数，模板字符串，解构赋值，`const`等等`es6`特性。

在之前的`Parcel`打包器中，如果想要使用`promise`以及一些数组对象的新`API`，则需要全局引入`babel-polyfill`，带来的后果就是文件体积骤增。当然，在这个脚手架中，已经实现了按需引入`polyfill`，也就是说比如你只使用了`promise`这一种特性，则脚手架编译时只会自动帮你加入`es6.promise`模块，而不会引入其他模块，这种按需加载的方式大大减少了代码体积。

**autoprefixer**

脚手架借助`postcss`实现了根据浏览器环境配置来自动添加`css`前缀。

**tree shaking**

代码中常常会出现一些从头到尾都没有使用到的代码，针对这一部分代码，脚手架借助插件进行了`tree shaking`，去除这些无用的代码，`tree shaking`包括`js`以及`css`两个方面：
```
// module.js 文件
export function a () {
    return 'a'
}
export function b () {
    return 'b'
}
export function c () {
    return 'c'
}

// index.js 文件
import { a } from './module'
console.log(a())

// 由于只用到了a函数，所以打包时不会整个引入module.js，b函数和c函数这部分代码就被shaking掉了

```
```
// style.css 文件

.block {
    width: 100px;
    height: 200px;
    color: #fc0;
}

// 如果html中没有这个class，则这部分代码不会被打包

```
以上只是举例，实际情况下，`tree shaking`会有更多种应用场景。

**图片压缩**

默认情况下，脚手架借助`image-webpack-loader`这一`loader`实现了图片压缩，如果不需要这一功能，则可以在`webpack.base.js`中删除这一部分：
```
// webpack.base.js
// 删除前面带 - 的行即可
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 1024,  // 1k限制
          outputPath: 'images/',
          // publicPath: 'https://www.cdn.com'
        }
      },
-     {
-       loader: 'image-webpack-loader'
-     }
    ]
  },
```

**指定静态资源不打包**

`public`目录下除了`index.html`之外的文件都不会被编译，只会按相同的目录结构保留到`dist`目录下，当然`index.html`中的这部分资源的引用路径也会保持和打包之前一致，所以如果使用了`cdn`等路径需要手动更改。

**资源自动添加cdn路径**

只需要配置`output`中的`publicPath`即可：
```
// webpack.base.js
output: {
  publicPath: 'http://www.cdn.com'
},
``` 
如果只想添加图片资源的`publicPath`：
```
// webpack.base.js
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024,  // 1k限制
        outputPath: 'images/',
+       publicPath: 'https://www.cdn.com'
      }
    },
    {
      loader: 'image-webpack-loader'
    }
  ]
},
```
**开发环境devServer**

这一部分脚手架并未做过多配置，可以根据下面的代码或者官方文档配置相关参数即可。

```
// webpack.dev.js
devServer: {
  // 可以更改host实现在移动端调试
  host: '0.0.0.0',

  // 端口
  port: 9000,
  
  // server开启后自动打开浏览器
  open: false,

  // server资源的根目录  
  contentBase: './dist',

  // 配置代理
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
        '/api': ''
      }
    }
  }
}
```
`webpack`对`proxy`的实现借助了中间件`http-proxy-middleware`，更多高级的用法可以参考 [文档](https://github.com/chimurai/http-proxy-middleware#options)。

**sourcemap**

脚手架默认对`js`开启了`sourcemap`方便调试，如果不需要可以更改相关配置：
```
// webpack.base.js
// 删除前面带 - 的行

- devtool: 'source-map',

// 如果需要其他种类的sourcemap可以自行搜索配置
```

**使用Vue**

脚手架已经配置好了`.vue`文件的解析，并且在`public/index.html`中加入了`dom`节点：
```
<div id="app"></div>
```
所以你可以直接在项目中使用`vue`，但是在此之前你需要先安装`vue`：
```
$ npm install vue
```
当然别忘了项目的入口文件是`index.js`，所以可以在`index.js`中初始化`vue`。
```
import Vue from 'vue'
import App from './app'

new Vue({
  render: h => h(App)
}).$mount('#app')

```

## 其他

**目录结构：**

如果你使用`vue`，推荐的目录结构为：
```
├─ public
│  └─ index.html
├─ src
│  ├─ assets
│  ├─ components
│  ├─ pages
│  ├─ App.vue
│  └─ index.js
```

当然你可以完全用喜欢的方式组织项目结构，但是默认配置的入口别忘了：`src/index.js`。


**更多配置可以直接参考 [webpack文档](https://www.webpackjs.com/)。**