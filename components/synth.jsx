'use strict';

const React        = require('react');
const ReactDOM     = require('react-dom');
const audioContext = require('../audio-context');
const colors       = require('../config').synthColors;
const ProgressBar  = require('progressbar.js');
const Gain         = require('../modules/gain');
const Waveshaper   = require('../modules/waveshaper');
const BiquadFilter = require('../modules/biquad-filter');
const Panner       = require('../modules/panner');
const _            = require('lodash');

class Synth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      left: 0,
      top: 0,
      id: this.props.id,
      showControls: false
    }

    this.isPlaying = false;
    this.duration = 100;
    this.timeOut = null;

    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

    this.yParameter = 'gain';
    this.xParameter = 'frequency'

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  componentDidMount() {
    let domNode = ReactDOM.findDOMNode(this);

    this.setState({
      left: this.props.left,
      top: this.props.top
    });

    let color = _.sample(colors);
    let fill = null;
    while ((fill = _.sample(colors)) === this.color) {}

    this.initialize();

    this.duration = (this.gain.attack + this.gain.decay + this.gain.sustain + this.gain.release) * 1000;

    this.progressBar = new ProgressBar.Circle(domNode.children[1], {
      color: color,
      strokeWidth: 10,
      fill: fill,
      trailWidth: 5,
      trailColor: '#999',
      duration: this.duration,
      text: {
        value: this.progressBarIcon,
        style: this.progressBarStyle
      }
    });

    
    this.enableGainEnvelope = true;
    this.frequency = this.props.left / this.windowWidth;;
  }

  initialize(source) {

    let level = 1 - (this.props.top / this.windowHeight);

    this.gain         = new Gain({level: level});
    this.waveshaper   = new Waveshaper({});
    this.biquadFilter = new BiquadFilter({});
    this.panner       = new Panner({});

    this.oscillator = audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.start();

    this.oscillator.connect(this.waveshaper.node);
    this.waveshaper.connect(this.biquadFilter.node);
    this.biquadFilter.connect(this.panner.node);
    this.panner.connect(this.gain.node);
  }

  get progressBarStyle() {
    return {
      position: 'absolute',
      left: '16px',
      top: '1px',
      padding: '0',
      margin: '0',
      'font-size': '2em'
    }
  }

  get progressBarIcon() {
    return '\u223F';
  }

  set frequency(freq) {
    this.oscillator.frequency.value = freq * 200;
  }

  set type(type) {
    this.oscillator.type = type;
  }

  killDevice() {
    this.oscillator.stop();

    if (this.isPlaying) {
      this.gain.disconnect();
    }

    this.panner.disconnect(this.gain.node);
    this.biquadFilter.disconnect(this.panner.node);
    this.waveshaper.disconnect(this.biquadFilter.node);
    this.oscillator.disconnect(this.waveshaper.node );

    this.gain = null;
    this.biquadFilter = null;
    this.waveshaper = null;
    this.oscillator = null;

    this.props.killDevice(this);
  }

  cloneDevice() {
    console.log('clone');
  }

  soloDevice() {
    console.log('solo');
  }

  showEditor() {
    this.props.showEditor(this);
  }

  startProgressBarAnimation() {
    this.animateProgressBar();
    this.timeOut = setInterval(this.animateProgressBar.bind(this), this.duration);
  }

  animateProgressBar() {
    this.progressBar.set(0);
    this.progressBar.animate(2);
  }

  stopProgressBarAnimation() {
    this.progressBar.animate(0);
    clearTimeout(this.timeOut);
  }

  play() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopProgressBarAnimation();
      if (this.enableGainEnvelope) {
        this.gain.endAutomation();
      } else {
        this.gain.off();
      }
    } else {
      this.isPlaying = true;
      this.startProgressBarAnimation();
      if (this.enableGainEnvelope) {
        this.gain.startAutomation();
      } else {
        this.gain.on();
      }
    }
  }

  showControls() {
    this.setState({
      showControls: !this.state.showControls
    });
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mousePosition = this.orientation === 'vertical' ? event.clientY : event.clientX;
    this.mouseDown = true;
  }

  onMouseUp(event) {
    event.preventDefault();
    this.mouseDown = false;
    if (!this.isDragging) {
      this.play();
      return;
    }
    window.onmousemove = null;
    window.onmouseup = null;
    this.isDragging = false;
  }

  onMouseMove(event) {
    event.preventDefault();
    if (this.mouseDown) {
      
      window.onmousemove = this.onMouseMove.bind(this);
      window.onmouseup = this.onMouseUp.bind(this);

      this.isDragging = true;
      this[this.xParameter] = event.clientX / this.windowWidth;
      this[this.yParameter].level = 1 - (event.clientY / this.windowHeight);
      this.setState({
        left: event.clientX - 35,
        top: event.clientY - 75
      });
    }
  }

  render() {
    let isDragging = false;
    let left = this.state.left;
    let top = this.state.top;
    let opacity = isDragging ? 0 : 1;
    let style = {
      opacity: opacity,
      left: left + 'px',
      top: top + 'px'
    };

    let controlsDisplay = this.state.showControls ? 1 : 0;
    let controlsStyle = {
      opacity: controlsDisplay,
      transition: 'opacity .25s ease-in-out'
    }

    return (
      <div className="synth" style={style} onMouseMove={this.onMouseMove.bind(this)} onMouseLeave={this.showControls.bind(this)} onMouseEnter={this.showControls.bind(this)}>
        <div style={controlsStyle}>
          <i className="control control-top fa fa-cog" onClick={this.showEditor.bind(this)}></i>
          <i className="control control-top control-right fa fa-times" onClick={this.killDevice.bind(this)}></i>
        </div>
        <div className="progress noselect" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}></div>
        <div style={controlsStyle}>
          <i className="control control-bottom fa fa-plus" onClick={this.cloneDevice.bind(this)}></i>
          <i className="control control-bottom control-right fa fa-headphones" onClick={this.soloDevice.bind(this)}></i>
        </div>
      </div>
    );
  }
}

module.exports = Synth;
