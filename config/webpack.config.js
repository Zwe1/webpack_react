const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map", // pro环境: cheap-module-source-map
  entry: ["./index.js"], // 入口文件,数组可配置多入口打包
  output: {
    publicPath: __dirname + "./dist", // js引用路径
    // publicPath: '// [cdn].com',  可配置cdn地址，提高访问速度
    path: path.resolve(__dirname, "./dist"), // 输出目录
    filename: "[name].[hash].js" // 打包出来的文件名
  },
  resolve: {
    extension: ["", ".js", ".jsx"],
    alias: {
      // 配置别名，可以加快webpack模块查找速度，方便引用
      pages: path.join(__dirname, "./src/pages")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", "less-loader"], // postcss-loader做样式的兼容处理
        include: path.resolve(__dirname, "./src") // 作用范围
        //   exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)/,
        use: {
          loader: "url-loader",
          options: {
            outputPath: "images",
            limit: 10 * 1024 // 图片最大10kb
          }
        }
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]-[hash:5].min.[ext]",
            limit: 5 * 1024, //字体文件最大5kb
            publicPath: "fonts/",
            outputPath: "fonts/"
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "index.html",
      hash: true,
      minify: {
        removeAttributeQuotes: true // 压缩，去掉引号
      }
    }),
    new CleanWebpackPlugin(), // 每次打包时清除打包目录旧版本文件
    new webpack.HotModuleReplacementPlugin() // 保留页面状态，热更新
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, "./dist"), //静态文件根目录
    port: 3000,
    host: "localhost",
    historyApiFallback: true, //所有404连接到index.html
    overlay: true,
    compress: true // 服务器返回浏览器的时候是否gzip压缩
  }
};
