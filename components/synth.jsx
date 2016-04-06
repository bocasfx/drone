'use strict';

const React             = require('react');
const Component         = React.Component;
const ReactDOM          = require('react-dom');
const ProgressBar       = require('progressbar.js');
const dragSource        = require('react-dnd').DragSource;
const PropTypes         = React.PropTypes;
const ContextMenu       = require('./context-menu.jsx');
const contextMenuLayer  = require('react-contextmenu').ContextMenuLayer;
const flow              = require('lodash/flow');

var looperSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.xPos),
      top: parseInt(component.state.yPos)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    component.state.xPos = result.xPos;
    component.state.yPos = result.yPos;
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    something: 'else'
  };
}

class Looper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xPos: 0,
      yPos: 0,
      isPlaying: false
    };
  }

  static get propTypes() {
    return {
      xPos: PropTypes.number.isRequired,
      yPos: PropTypes.number.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  componentDidMount() {
    let domNode = ReactDOM.findDOMNode(this);

    this.state.xPos = this.props.xPos;
    this.state.yPos = this.props.yPos;

    this.isPlaying = false;
    this.progress = 0;
    this.duration = 100;

    this.progressBar = new ProgressBar.Circle(domNode.children[0], {
      color: '#FF3692',
      strokeWidth: 10,
      fill: '#333',
      trailWidth: 5,
      trailColor: '#999',
      duration: 100
    });

    this.initSynth();

    this.timeOut = null;

    this.forceUpdate();
  }

  initSynth() {

    this.audioContext = new window.AudioContext();

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.maxFreq = 200;
    this.maxVol = 1;

    let initialFreq = 0;
    let initialVol = 0;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = initialVol;

    
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'triangle';
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();

    this.oscillator.frequency.value = initialFreq;

    this.frequency = this.state.xPos;
    this.gain = this.windowHeight - this.state.yPos;
  }

  play(event) {

    event.stopPropagation();

    let text = this.state.isPlaying ? 'play' : 'pause';
    this.progressBar.setText(`<i class="fa fa-${text}"></i>`);

    if (this.state.isPlaying) {
      this.stopProgressBarAnimation();
      this.gainNode.disconnect(this.audioContext.destination);
      this.state.isPlaying = false;
    } else {
      this.startProgressBarAnimation();
      this.gainNode.connect(this.audioContext.destination);
      this.state.isPlaying = true;
    }
  }

  startProgressBarAnimation() {
    this.timeOut = setInterval(this.animateProgressBar.bind(this), 100);
  }

  animateProgressBar() {
    this.progress = this.progress === 1 ? 0 : this.progress;
    this.progress = this.progress + 1/this.duration;
    this.progressBar.animate(this.progress, ()=> {
      this.progressBar.animate(0);
    });
  }

  stopProgressBarAnimation() {
    clearTimeout(this.timeOut);
  }

  set frequency(level) {
    this.oscillator.frequency.value = level / this.windowWidth * this.maxFreq;
  }

  set gain(level) {
    this.gainNode.gain.value = level / this.windowHeight * this.maxVol;
  }

  onDrag(event) {
    this.frequency = event.clientX;
    this.gain = this.windowHeight - event.clientY;
  }

  setWaveToSine() {
    this.oscillator.type = 'sine';
  }

  setWaveToSquare() {
    this.oscillator.type = 'square';
  }

  setWaveToSaw() {
    this.oscillator.type = 'triangle';
  }

  render() {
    let isDragging = this.props.isDragging;
    let connectDragSource = this.props.connectDragSource;
    let xPos = this.state.xPos;
    let yPos = this.state.yPos;
    let opacity = isDragging ? 0 : 1;
    let style = {
      opacity: opacity,
      left: xPos + 'px',
      top: yPos + 'px'
    };

    return connectDragSource(
        <div className="looper" style={style}>
          <span className="progress" onClick={this.play.bind(this)} draggable='true' onDrag={this.onDrag.bind(this)}></span>
          <ContextMenu synth={this}/>
        </div>
    );
  }
}

module.exports = flow (
  dragSource('looper', looperSource, collect),
  contextMenuLayer('some_unique_identifier')
)(Looper);
