'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Looper = require('./components/Looper.jsx');

ReactDOM.render(
  <div>
    <Looper src="media/loop.mp3"/>
    <Looper src="media/loop2.mp3"/>
  </div>,
  document.getElementById('container')
);
