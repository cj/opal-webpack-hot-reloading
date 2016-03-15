// http://learn.humanjavascript.com/react-ampersand/styles-stylus-and-hot-loading
var path               = require("path");
var webpack            = require('webpack');
var AssetsPlugin       = require('assets-webpack-plugin');
var ExtractTextPlugin  = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var production         = process.env.RACK_ENV == 'production';
var config             = {
  context: __dirname,
  resolve: {
    root: path.resolve( __dirname ),
    extensions: ['', '.js', '.css', '.rb']
  },
  module: {
    loaders: [
      { 
        test: /\.rb$/, 
        exclude: /node_modules|\.bundle/,
        loader: "opalrb-loader",
        root: path.resolve('./'),
        query: {
          "requirable": false,
          "dynamic_require_severity": "ignore"
        }
      },
      {
        test: /\.css$/,
        // exclude: /node_modules|\.bundle|opalrb-loader/,
        // loader: ExtractTextPlugin.extract('stylus', 'css-loader!stylus-loader'),
        // loader: 'css-loader!stylus-loader',
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        loader: production ? ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
                           : 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  // packageAlias: false,
  stats: {
    colors: true // Nice colored output
  },
  postcss: function (webpack) {
    return [
      require("postcss-import")({ addDependencyTo: webpack }),
      require("postcss-url")(),
      require("postcss-cssnext")(),
      // add your "plugins" here
      // ...
      // and if you want to compress,
      // just use css-loader option that already use cssnano under the hood
      require("postcss-browser-reporter")(),
      require("postcss-reporter")(),
    ]
  }
}

if (production) {
  config.entry = [
    './.connect-opal.js',
    './.connect-entry.js'
  ]
  config.plugins = [
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'build'),
      prettyPrint: true,
      filename: 'assets.json',
      fullPath: false
    }),
    new CleanWebpackPlugin(['dist', 'build'], {
      root: __dirname,
      // verbose: true, 
      // dry: false
    }),
    new ExtractTextPlugin('[name].css')
  ]
  config.output = {
    // filename: '[name]-[id]-[hash].js',
    filename: '[name]-[hash].js',
    publicPath: '/build/',
    path: path.join(__dirname, './build'),
  }
} else {
  config.entry = [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './.connect-opal.js',
    './.connect-entry.js'
  ]
  config.plugins = [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ]
  config.output = {
    // filename: '[name]-[id]-[hash].js',
    filename: '[name].js',
    publicPath: 'http://local.sh:8080/',
    path: path.join(__dirname),
  }
  config.devtool = 'sourcemap'
}

// http://moduscreate.com/optimizing-react-es6-webpack-production-build/

module.exports = config;
