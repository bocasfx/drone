'use strict';

const React          = require('react');
const ReactDOM       = require('react-dom');
const Mixer = require('./components/Mixer.jsx');

let synths = [];

ReactDOM.render(
  <Mixer synths={synths}/>,
  document.getElementById('container')
);
