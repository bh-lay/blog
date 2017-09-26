const path = require('path');
//定义了一些文件夹的路径
const ROOT_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');


module.exports =  {
  entry: {
    app: path.resolve(ROOT_PATH, 'src/app.js')
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader'
      },
      {
        test: /\.(html|eot|woff|svg|ttf|woff2|png|jpe?g|gif|css|less)$/,
        use: 'file-loader?name=[name].[hash:8].[ext]'
      },
    ]
  }
};;