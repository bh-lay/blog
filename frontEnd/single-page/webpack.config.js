const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
// const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/single-page/');
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/testWebpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: path.resolve(ROOT_PATH, 'app.js')
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ['style', 'css', 'autoprefixer']
      },
      {
        test: /\.less$/,
        loader: ['style', 'css', 'autoprefixer', 'less']
      },
      {
		    test: /\.js$/,
		    loader: 'babel-loader?presets[]=es2015,presets[]=stage-0'
	    },
      {
	  	  test: /\.(eot|woff|svg|ttf|woff2|gif)(\?|$)/,
		    loader: 'file-loader?name=[hash].[ext]'
	    },
      // {
      //   test: /\.(png|jpg)$/,
      //   loader: 'url?limit=1200&name=[hash].[ext]'
      // },
      {
        test: /\.(png|jpg)$/,
        loader:"url-loader?limit=8192&name=img/[name][hash:8].[ext]"
      }
    ],
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader'
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './index.html',
    inject: true,
    files: {
      css: [ "./css/main.less" ],
      js: [ "app.js"],
      chunks: {
        head: {
          entry: "app.js",
          // "css": [ "main.css" ]
        },
        main: {
          // "entry": "app.js",
          // "css": []
        },
      }
    }
  })]
};
module.exports = config;