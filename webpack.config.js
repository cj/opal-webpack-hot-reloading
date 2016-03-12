var path    = require("path")
var webpack = require('webpack');

module.exports = {
  entry: [
    // 'webpack-hot-middleware/client?path=/__webpack_hmr',
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './hello.rb'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: 'http://local.sh:8080/assets/'
  },
  module: {
    loaders: [
      { 
        test: /\.rb$/, 
        exclude: /node_modules|\.bundle/,
        loader: "opalrb-loader",
      }
    ]
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true // Nice colored output
  },
  devtool: 'sourcemap',
};
