'use strict';

const React       = require('react');
const ReactDOM    = require('react-dom');
const ProgressBar = require('progressbar.js');
const dragSource  = require('react-dnd').DragSource;
const PropTypes   = React.PropTypes;

const looperSource = {
  beginDrag: function (props) {
    return props;
  },

  endDrag: function(props, monitor, component) {
    component.setPosition(500, 500);
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const Looper = React.createClass({
  propTypes: {
    xPos: PropTypes.string.isRequired,
    yPos: PropTypes.string.isRequired,
    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      isPlaying: false,
      loop: true,
      progress: 0,
      audioNode: null,
      progressBar: null,
      xPos: 0,
      yPos: 0
    };
  },

  componentDidMount: function() {
    let domNode = ReactDOM.findDOMNode(this)
    let audioNode = domNode.children[0];

    this.state.xPos = this.props.xPos;
    this.state.yPos = this.props.yPos;

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
    this.forceUpdate();
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

  setPosition: function(x, y) {
    this.state.xPos = x;
    this.state.yPos = y;
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
    let isDragging = this.props.isDragging;
    let connectDragSource = this.props.connectDragSource;
    let xPos = this.state.xPos;
    let yPos = this.state.yPos;
    let opacity = isDragging ? 0.5 : 1;
    let style = {
      opacity: opacity,
      left: xPos + 'px',
      top: yPos + 'px'
    };

    return connectDragSource(
      <div className="looper" style={style}>
        <audio src={this.props.src}>
          <div>Sorry :(</div>
        </audio>
        <span className="progress" onClick={this.handleClick}></span>
      </div>
    );
  }
})

// module.exports = Looper;
module.exports = dragSource('looper', looperSource, collect)(Looper);
