'use strict';

const React          = require('react');
const ReactDOM       = require('react-dom');
const MixerContainer = require('./components/MixerContainer.jsx');

ReactDOM.render(
  <MixerContainer/>,
  document.getElementById('container')
);
