const path     = require('path');
const fs       = require('fs');
const srcPath  = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  context: srcPath,
  entry: 'index.js',
  mode: 'development',
  target: 'node',
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  externals: nodeModules,
  resolve: {
    modules: ['src'],
    extensions: ['*', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  }
}
