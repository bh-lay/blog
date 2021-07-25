const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const HTML_PATH = path.resolve(ROOT_PATH, '../../sys/views/multi-page/');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

require('dotenv').config({
	path: path.resolve(ROOT_PATH, '../../.env')
})

const isProduction = process.env.NODE_ENV === 'production';
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/multi-page/');

const config = {
  entry: {
    "multi-base": [
      './assets/jquery.js',
      './assets/bootstrap/js/bootstrap.js',
      './assets/highlight.js',
      './assets/dialog.js'
    ],
    "multi-define": './assets/multi-define.js',
    "labs-detail": [
      './assets/jquery.js',
      './assets/highlight.js',
      './assets/labs-detail/index.js'
    ]
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash:8].js',
    publicPath: process.env.cdnDomain + '/build/multi-page/'
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
const SameHtmlFileNames = ['indexPage', 'blogList', 'blogDetail', 'labsList', 'panoList', 'photographyList', 'bless'];
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