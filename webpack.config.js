'use strict';

module.exports = {
  entry: [
    'babel-polyfill',
    './app.js'
  ],
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
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0', 'react']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }]
  }
};
