'use strict';

const React    = require('react');
const ReactDOM = require('react-dom');
const Mixer    = require('./components/mixer.jsx');

let synths = [];
let loopers = [];

ReactDOM.render(
  <Mixer synths={synths} loopers={loopers}/>,
  document.getElementById('container')
);
