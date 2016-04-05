'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var ProgressBar = require('progressbar.js');

var Looper = React.createClass({
  getInitialState: function() {
    return {
      isPlaying: false,
      loop: true,
      progress: 0,
      audioNode: null,
      progressBar: null
    };
  },

  componentDidMount: function() {
    let domNode = ReactDOM.findDOMNode(this)
    let audioNode = domNode.children[0];

    audioNode.addEventListener('timeupdate', this.updateProgress, false);
    this.state.audioNode = audioNode;

    let progressNode = domNode.children[1];

    this.state.progressBar = new ProgressBar.Circle(progressNode, {
      color: '#FF3692',
      strokeWidth: 5,
      fill: '#333',
      trailWidth: 1,
      trailColor: '#999'
    });
  },

  handleClick: function() {

    let text = this.state.isPlaying ? 'play' : 'pause';
    this.state.progressBar.setText(`<i class="fa fa-${text}"></i>`);
    
    if (this.state.isPlaying) {
      this.state.audioNode.pause();
      this.state.isPlaying = false;
    } else {
      this.state.audioNode.loop = this.state.loop;
      this.state.audioNode.play();
      this.state.isPlaying = true;
    }
  },

  updateProgress: function() {
    let audioNode = this.state.audioNode;
    let value = 0;

    if (audioNode.currentTime > 0) {
      value = audioNode.currentTime / audioNode.duration;
    }

    this.state.progressBar.animate(value);
  },

  render: function() {
    return (
      <div>
        <audio src={this.props.src}>
          <div>Sorry :(</div>
        </audio>
        <span className="progress" onClick={this.handleClick}></span>
      </div>
    );
  }
})

module.exports = Looper;
