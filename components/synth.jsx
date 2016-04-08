'use strict';

const React             = require('react');
const Component         = React.Component;
const ReactDOM          = require('react-dom');
const ProgressBar       = require('progressbar.js');
const dragSource        = require('react-dnd').DragSource;
const PropTypes         = React.PropTypes;
const flow              = require('lodash/flow');
const colors            = require('../config').synthColors;
const SynthEditor       = require('./synth-editor.jsx');

var synthSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.xPos),
      top: parseInt(component.state.yPos)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result.suicide) {
      component.suicide();
      return;
    }
    
    component.state.xPos = result.xPos;
    component.state.yPos = result.yPos;
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Synth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xPos: 0,
      yPos: 0,
      isPlaying: false,
      id: props.id,
      showEditor: false,
      showControls: false
    };

    console.log(props.id);
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

    let colorIdx = Math.floor(Math.random() * colors.length);

    this.progressBar = new ProgressBar.Circle(domNode.children[0], {
      color: colors[colorIdx],
      fill: '#CAC234',
      strokeWidth: 10,
      fill: '#333',
      trailWidth: 5,
      trailColor: '#999',
      duration: 100,
      text: {
        value: '\u223F'
      }
    });

    this.initSynth();

    this.timeOut = null;

    this.forceUpdate();
  }

  initSynth() {

    this.audioContext = this.props.audioContext;

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.maxFreq = 100;
    this.maxVol = 1;

    let initialFreq = 0;
    let initialVol = 0;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = initialVol;

    this.waveShaper = this.audioContext.createWaveShaper();
    this.waveShaper.curve = this.makeDistortionCurve(200);

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'triangle';
    this.oscillator.frequency.value = initialFreq;

    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.biquadFilter.type = 'lowshelf';
    this.biquadFilter.frequency.value = 1000;
    this.biquadFilter.gain.value = 20;
    this.biquadFilter.gain.detune = 1000;

    this.oscillator.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);

    this.oscillator.start();

    this.frequency = this.normalizeFrequency(this.state.xPos);
    this.gain = this.normalizeGain(this.state.yPos);
  }

  setDistortionCurve(amount) {
    this.waveShaper.curve = this.makeDistortionCurve(amount);
  }

  makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50;
    let samples = 44100;
    let curve = new Float32Array(samples);
    let deg = Math.PI / 180;
    let i = 0;
    let x;
    for ( ; i < samples; ++i ) {
      x = i * 2 / samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }

  play(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (this.state.isPlaying) {
      this.stopProgressBarAnimation();
      this.fadeOut();
    } else {
      this.fadeIn();
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
    this.oscillator.frequency.value = level;
  }

  set gain(level) {
    this.gainNode.gain.value = level;
  }

  get gain() {
    return this.gainNode.gain.value;
  }

  normalizeFrequency(value) {
    return value / this.windowWidth * this.maxFreq;
  }

  normalizeGain(value) {
    return (this.windowHeight - value) / this.windowHeight * this.maxVol;
  }

  onDrag(event) {
    this.frequency = this.normalizeFrequency(event.clientX);
    this.gain = this.normalizeGain(event.clientY);
  }

  setWaveToSine() {
    console.log(this.state.id);
    this.oscillator.type = 'sine';
  }

  setWaveToSquare() {
    console.log(this.state.id);
    this.oscillator.type = 'square';
  }

  setWaveToSaw() {
    console.log(this.state.id);
    this.oscillator.type = 'triangle';
  }

  fadeIn() {

    this.startProgressBarAnimation();
    this.state.isPlaying = true;
    this.gainNode.connect(this.audioContext.destination);
    this.gain = 0;

    let fadeInInterval = setInterval(function() {
      let originalGain = (this.windowHeight - this.state.yPos) / this.windowHeight * this.maxVol;
      if (this.gain > originalGain) {
        this.gain = originalGain; 
        clearInterval(fadeInInterval);
      }
      this.gain = this.gain + 0.01;

    }.bind(this), 10);
  }

  fadeOut() {
    let fadeOutInterval = setInterval(function() {
      if (this.gain < 0.0001) {
        this.gain = 0;
        this.state.isPlaying = false;
        this.gainNode.disconnect(this.audioContext.destination);
        clearInterval(fadeOutInterval);
      }
      this.gain = this.gain - 0.01;

    }.bind(this), 10);
  }

  suicide() {
    this.oscillator.stop();

    this.gainNode.disconnect();
    this.biquadFilter.disconnect();
    this.waveShaper.disconnect();
    this.oscillator.disconnect();

    this.gainNode = null;
    this.biquadFilter = null;
    this.waveShaper = null;
    this.oscillator = null;

    this.props.killSynth(this);
  }

  showEditor(event) {
    console.log('Showing');
    this.state.showEditor = true;
    this.forceUpdate();
  }

  hideEditor() {
    this.state.showEditor = false;
    this.forceUpdate();
  }

  showControls() {
    this.state.showControls = !this.state.showControls;
    this.forceUpdate();
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

    let controlsDisplay = this.state.showControls ? 'block' : 'none';
    let controlsStyle = {
      display: controlsDisplay
    }

    let editorDisplay = this.state.showEditor ? 'block' : 'none';
    let editorStyle = {
      display: editorDisplay
    }

    return connectDragSource(
      <div className="synth" style={style} onMouseEnter={this.showControls.bind(this)} onMouseLeave={this.showControls.bind(this)}>
        <span className="progress" draggable='true' onDrag={this.onDrag.bind(this)} onClick={this.play.bind(this)}></span>
        <div className="cog" onClick={this.showEditor.bind(this)}>
          <div style={controlsStyle}>
            <i className="fa fa-cog"></i>
          </div>
        </div>
        <div style={editorStyle}>
          <SynthEditor synth={this}/>
        </div>
      </div>
    );
  }
}

module.exports = dragSource('synth', synthSource, collect)(Synth);
