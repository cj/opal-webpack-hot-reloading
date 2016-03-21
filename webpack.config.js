// http://learn.humanjavascript.com/react-ampersand/styles-stylus-and-hot-loading
// https://github.com/pekim/postcss-modules-resolve-from-alias
var path               = require("path");
var webpack            = require('webpack');
var AssetsPlugin       = require('assets-webpack-plugin');
var ExtractTextPlugin  = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CompressionPlugin  = require("compression-webpack-plugin");
var production         = process.env.RACK_ENV == 'production';
var config             = {
  context: __dirname,
  resolve: {
    alias: {
      app: path.resolve( __dirname, 'app' ),
      theme: path.resolve( __dirname, 'private', 'Buntington_HTML_pack', 'Buntington_HTML' )
    },
    root: [__dirname],
    extensions: ['', '.js', '.css', '.rb']
  },
  module: {
    loaders: [
      { 
        test: /\.rb$/, 
        exclude: /node_modules|\.bundle/,
        loader: "opalrb-loader-cj",
        root: path.resolve('./'),
        query: { "dynamic_require_severity": "ignore" }
      },
      {
        test: /\.css$/,
        loader: production ? ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
                           : 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url?limit=10000!img?progressive=true'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  // packageAlias: false,
  stats: {
    colors: true // Nice colored output
  },
  postcss: function (webpack) {
    return [
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
    './.connect/opal.js',
    './.connect/entry.js'
  ]
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'public', 'assets'),
      prettyPrint: true,
      filename: 'assets.json',
      fullPath: false
    }),
    new CleanWebpackPlugin(['public/assets'], {
      root: __dirname,
      // verbose: true, 
      // dry: false
    }),
    new ExtractTextPlugin('main.[hash].css', {
      allChunks: true
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$/,
      // threshold: 10240,
      minRatio: Infinity
    }),
  ]
  config.output = {
    // filename: '[name]-[id]-[hash].js',
    filename: 'main.[hash].js',
    publicPath: '/public/assets/',
    path: path.join(__dirname, 'public', 'assets'),
  }
} else {
  config.entry = [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './.connect/opal.js',
    './.connect/entry.js'
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
  // config.devtool = 'source-map'
  config.devtool = '#inline-source-map'
}

// http://moduscreate.com/optimizing-react-es6-webpack-production-build/

module.exports = config;
