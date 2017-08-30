const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/single-page/');
const HTML_PATH = path.resolve(ROOT_PATH, '../../sys/views/single-page/index.html');
const GITHUB_HTML_PATH = path.resolve(ROOT_PATH, '../../sys/component/single-page/github.html');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    app: path.resolve(ROOT_PATH, 'app.js')
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash:8].js',
    publicPath: 'http://127.0.0.1:8088/build/single-page/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ['style', 'css', 'autoprefixer']
      },
      {
        test: /\.less/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=stage-0'
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2)(\?|$)/,
        loader: 'file-loader?name=font/[name].[hash].[ext]'
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
      template: './index.html',
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: GITHUB_HTML_PATH,
      template: './tpl/github.html',
      inject: false
    }),
  ]
};
module.exports = config;