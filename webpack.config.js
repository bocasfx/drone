'use strict';

module.exports = {
  entry: './app.js',
  output: {
    path: __dirname + '/public/js/',
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  }
};
