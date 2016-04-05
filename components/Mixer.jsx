'use strict';

const React   = require('react');
const Looper  = require('./Looper.jsx');

const Mixer = React.createClass({
  render: function() {
    return (
      <div>
        <Looper src="media/loop.mp3"/>
        <Looper src="media/loop2.mp3"/>
      </div>
    );
  }
});

module.exports = Mixer;