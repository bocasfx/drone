'use strict';

const React          = require('react');
const ReactDOM       = require('react-dom');
const Mixer = require('./components/Mixer.jsx');

ReactDOM.render(
  <Mixer/>,
  document.getElementById('container')
);
