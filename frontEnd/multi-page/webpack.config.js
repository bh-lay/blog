const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, '../../static/build/single-page/');
const HTML_PATH = path.resolve(ROOT_PATH, '../../sys/views/multi-page/');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const devPublicPath = 'http://127.0.0.1:8088/build/multi-page/';
const prodPublicPath = '//dn-lay.qbox.me/build/multi-page/';
const publicPath = isProduction ? prodPublicPath : devPublicPath;

const config = {
  entry: {
    app: path.resolve(ROOT_PATH, 'app.js')
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
    new ExtractTextPlugin("[name].[contenthash:8].css")
  ]
};
const htmlFileNames = ['indexPage', 'blogList'];
htmlFileNames.forEach(function (fileName) {
  const htmlFileName = fileName + '.html';
  const htmlPlugin = new HtmlWebpackPlugin({
    filename: HTML_PATH + htmlFileName,
    template: './pages/' + htmlFileName,
    inject: true
  });
  config.plugins.push(htmlPlugin);
})
if (isProduction) {
  config.plugins.push(new UglifyJSPlugin());
}
module.exports = config;