// npm install --save-dev style-loader css-loader webpack webpack-cli babel-loader @babel/core @babel/preset-env \
// @babel/plugin-transform-object-assign webpack-remove-debug
// npx webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: ["./js/index.js", "./styles/index.css"],
  output: {
    filename: "bundle.js",
  },
  mode: "production",
  node: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-object-assign"],
          },
        },
      },
      {
        test: /\.js$/,
        loader: "webpack-remove-debug", 
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html', 
    }),
  ],
};