var path          = require("path")
var webpack       = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './.connect-opal.js',
    './.connect-entry.js'
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './build'),
    publicPath: 'http://local.sh:8080/',
    chunkFilename: "[name].js"
  },
  historyApiFallback: true,
  resolve : {
    alias: {
      jquery: "./node_modules/jquery/dist/jquery.js",
    }
  },
  module: {
    loaders: [
      { 
        test: /\.rb$/, 
        exclude: /node_modules|\.bundle|opalrb-loader/,
        loader: "opalrb-loader",
        query: {
          "requirable": false,
          "dynamic_require_severity": "ignore"
        }
      }
    ]
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
  ],
  stats: {
    colors: true // Nice colored output
  },
  devtool: 'sourcemap',
};
