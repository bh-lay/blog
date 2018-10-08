const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const HTML_PATH = path.resolve(ROOT_PATH, '../../sys/views/multi-page/');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/multi-page/');
const devPublicPath = 'http://127.0.0.1:8088/build/multi-page/';
const prodPublicPath = 'http://static.bh-lay.com/build/multi-page/';
const publicPath = isProduction ? prodPublicPath : devPublicPath;

const config = {
  entry: {
    "multi-base": [
      './assets/jquery.js',
      './assets/bootstrap/js/bootstrap.js',
      './assets/highlight.js',
      './assets/dialog.js'
    ],
    "multi-define": './assets/multi-define.js',
    "links": [
      './assets/jquery.js',
      './assets/dialog.js',
      './assets/links/index.js'
    ],
    "labs-detail": [
      './assets/jquery.js',
      './assets/highlight.js',
      './assets/labs-detail/index.js'
    ]
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash:8].js',
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: isProduction
              }
            },
            'less-loader'
          ]
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=stage-0'
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2)(\?|$)/,
        loader: 'file-loader?name=font/[name].[hash:8].[ext]'
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].[contenthash:8].css"),
    // 前端英雄榜页面
    new HtmlWebpackPlugin({
      filename: path.resolve(HTML_PATH, 'links.html'),
      template: './pages/links.html',
      inject: true,
      hash: true,
      chunks: ['links']
    }),
    // 前端实验室详情页面
    new HtmlWebpackPlugin({
      filename: path.resolve(HTML_PATH, 'labsDetail.html'),
      template: './pages/labsDetail.html',
      inject: true,
      hash: true,
      chunks: ['labs-detail']
    })
  ]
};
const SameHtmlFileNames = ['indexPage', 'blogList', 'blogDetail', 'labsList', 'panoList', 'photographyList'];
SameHtmlFileNames.forEach(function (fileName) {
  const htmlFileName = fileName + '.html';
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: path.resolve(HTML_PATH, htmlFileName),
    template: './pages/' + htmlFileName,
    inject: true,
    hash: false,
    chunks: ['multi-base', 'multi-define']
  });
  config.plugins.push(htmlPlugin);
});
if (isProduction) {
  config.plugins.push(new UglifyJSPlugin());
}
module.exports = config;