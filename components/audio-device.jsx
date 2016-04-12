'use strict';

const React             = require('react');
const Component         = React.Component;
const PropTypes         = React.PropTypes;
const ReactDOM          = require('react-dom');
const colors            = require('../config').synthColors;
const ProgressBar       = require('progressbar.js');
const q                 = require('q');

class AudioDevice extends Component {

  static get propTypes() {
    return {
      left: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  state = {
    left: 0,
    top: 0,
    isPlaying: false,
    id: this.props.id,
    showEditor: false,
    showControls: false
  }

  constructor(props) {
    super(props);
  }

  get progressBarStyle() {
    return {};
  }

  get progressBarIcon() {
    return {};
  }

  componentDidMount() {
    let domNode = ReactDOM.findDOMNode(this);

    this.state.left = this.props.left;
    this.state.top = this.props.top;

    this.isPlaying = false;
    this.progress = 0;
    this.duration = 100;
    this.timeOut = null;

    this.enableGainEnvelope = true;
    this.attack = 0;
    this.sustain = 50;
    this.decay = 0;
    this.release = 50;

    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

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
        value: this.progressBarIcon,
        style: this.progressBarStyle
      }
    });

    this.initialize();
    this.forceUpdate();
  }

  initialize() {
    this.audioContext = this.props.audioContext;

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.maxVol = 1;
    this.maxFreq = 100;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    this.waveShaper = this.audioContext.createWaveShaper();
    this.waveShaper.curve = this.makeWaveShaperCurve(0);

    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.biquadFilter.type = 'lowshelf';
    this.biquadFilter.frequency.value = 18000;
    this.biquadFilter.gain.value = 20;
    this.biquadFilter.gain.detune = 0;
  }

  makeWaveShaperCurve(amount) {
    let samples = 44100;
    let curve = new Float32Array(samples);
    let deg = Math.PI / 180;
    let x = null;

    for (var i=0 ; i < samples; i++ ) {
      x = i * 2 / samples - 1;
      curve[i] = ( 3 + amount ) * x * 20 * deg / ( Math.PI + amount * Math.abs(x) );
    }

    return curve;
  }

  set gain(level) {
    this.gainNode.gain.value = level;
  }

  get gain() {
    return this.gainNode.gain.value;
  }

  set filterFrequency(freq) {
    this.biquadFilter.frequency.value = freq;
  }

  set filterGain(level) {
    this.biquadFilter.gain.value = level;
  }

  set filterDetune(level) {
    this.biquadFilter.gain.detune = level;
  }

  set waveShaperCurve(amount) {
    this.waveShaper.curve = this.makeWaveShaperCurve(amount);
  }

  normalizeFrequency(value) {
    return value / this.windowWidth * this.maxFreq;
  }

  normalizeGain(value) {
    return (this.windowHeight - value) / this.windowHeight * this.maxVol;
  }

  showEditor() {
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

  suicide(device) {
    this.props.killLooper(device);
  }

  onDrag() {
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

  play(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopProgressBarAnimation();
      this.fadeOut().then(()=> {
        clearTimeout(this.noteOffTimeout);
        clearTimeout(this.noteOnTimeout);
        this.gainNode.disconnect(this.audioContext.destination);
      });
    } else {
      this.isPlaying = true;
      this.startProgressBarAnimation();
      this.gainNode.connect(this.audioContext.destination);
      this.noteOn();
    }
  }

  noteOn() {
    if (this.enableGainEnvelope) {
      this.fadeIn()
        .then(this.scheduleNoteOff.bind(this))
        .then(this.fadeOut.bind(this))
        .then(this.scheduleNoteOn.bind(this));
    } else {
      this.fadeIn();
    }
  }

  scheduleNoteOff() {
    let deferred = q.defer();
    this.noteOffTimeout = setTimeout(()=> {
      if(!this.isPlaying) {
        deferred.reject();
      }
      deferred.resolve();
    }, this.sustain);
    return deferred.promise;
  }

  scheduleNoteOn() {
    let deferred = q.defer();
    this.noteOnTimeout = setTimeout(()=> {
      if(!this.isPlaying) {
        deferred.reject();
      }
      this.noteOn();
      deferred.resolve();
    }, this.release);
    return deferred.promise;
  }

  fadeIn() {


    let deferred = q.defer();
    this.gain = 0;

    let originalGain = (this.windowHeight - this.state.top) / this.windowHeight * this.maxVol;
    let step = originalGain / 50;

    let fadeInInterval = setInterval(function() {

      if (this.gain > originalGain) {
        this.gain = originalGain; 
        clearInterval(fadeInInterval);
        if(!this.isPlaying) {
          deferred.reject();
        }
        deferred.resolve();
      }
      this.gain = this.gain + step;

    }.bind(this), this.attack);

    return deferred.promise;
  }

  fadeOut() {


    let deferred = q.defer();
    let step = this.gain / 50;

    let fadeOutInterval = setInterval(function() {
      if (this.gain < 0.0001) {
        this.gain = 0;
        clearInterval(fadeOutInterval);
        deferred.resolve();
      }
      this.gain = this.gain - step;

    }.bind(this), this.decay);

    return deferred.promise;
  }
}

module.exports = AudioDevice;
