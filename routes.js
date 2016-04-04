'use strict';

require('node-jsx').install();

const React = require('react');
const ReactDOMServer  = require('react-dom/server');
const looper = React.createFactory(require('./components/Looper.react'));

module.exports = {
  index: (req, res)=> {
    let markup = ReactDOMServer.renderToString(looper());
    res.render('home', {
      markup: markup,
      state: {}
    });
  }
};
