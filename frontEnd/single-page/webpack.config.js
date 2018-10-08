const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const HTML_PATH = path.resolve(ROOT_PATH, '../../sys/views/single-page/index.html');
const GITHUB_HTML_PATH = path.resolve(ROOT_PATH, '../../sys/component/single-page/github.html');

const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/single-page/');
const cdnPath = isProduction ? 'http://static.bh-lay.com' : '//127.0.0.1:8088';
const publicPath = cdnPath + '/build/single-page/';

const config = {
  entry: {
    app: path.resolve(ROOT_PATH, 'src/app.js')
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
        test: /(pages|comments|templates)\/([^\.]+)\.html$/,
        use: 'raw-loader'
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
    new HtmlWebpackPlugin({
      filename: HTML_PATH,
      template: './src/index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: GITHUB_HTML_PATH,
      template: './src/github.html',
      inject: false
    }),
    new ExtractTextPlugin("[name].[contenthash:8].css"),
    new webpack.DefinePlugin({
      CDN_PATH: JSON.stringify(cdnPath)
    })
  ]
};
if (isProduction) {
  config.plugins.push(new UglifyJSPlugin());
}
module.exports = config;