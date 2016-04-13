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

  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      top: 0,
      isPlaying: false,
      id: this.props.id,
      showEditor: false
    }
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
    this.attack = 1;
    this.sustain = 200;
    this.decay = 100;
    this.release = 200;

    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

    this.yParameter = 'gain';
    this.xParameter = 'frequency'

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

    this.gainNode = this.audioContext.createGain();
    this.gain = 0;

    this.waveShaper = this.audioContext.createWaveShaper();
    this.waveShaper.curve = this.makeWaveShaperCurve(0);

    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.biquadFilter.type = 'lowshelf';
    this.biquadFilter.frequency.value = 18000;
    this.biquadFilter.gain.value = 0;
    this.biquadFilter.gain.detune = 0;

    this.panner = this.audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';
    this.panner.refDistance = 10;
    this.panner.maxDistance = 10000;
    this.panner.rolloffFactor = 1;
    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 0;
    this.panner.coneOuterGain = 0;
    this.panner.setOrientation(1,0,0);
    this.panner.setPosition(this.windowWidth/2, this.windowHeight/2, 0);

    this.listener = this.audioContext.listener;
    this.listener.setOrientation(0,0,-1,0,1,0);
    this.listener.setPosition(this.windowWidth/2, this.windowHeight/2, 5);
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

  get gain() {
    return this.gainNode.gain.value;
  }

  set gain(level) {
    this.gainNode.gain.value = level;
    this.originalGain = level;
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

  set frequency(freq) {
  }

  showEditor() {
    this.state.showEditor = true;
    this.forceUpdate();
  }

  hideEditor() {
    this.state.showEditor = false;
    this.forceUpdate();
  }

  onDrag(event) {
    this[this.xParameter] = event.clientX / this.windowWidth;
    this[this.yParameter] = event.clientY / this.windowHeight;
  }

  startProgressBarAnimation() {
    this.timeOut = setInterval(this.animateProgressBar.bind(this), 75);
  }

  animateProgressBar() {
    if (this.progress > 1.99) {
      this.progress = 0;
      this.progressBar.set(0);
    } else {
      this.progress = this.progress + 1/this.duration;
      this.progressBar.animate(this.progress);  
    }
  }

  stopProgressBarAnimation() {
    this.progressBar.animate(0);
    clearTimeout(this.timeOut);
  }

  play(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopProgressBarAnimation();
      clearTimeout(this.noteOffTimeout);
      clearTimeout(this.noteOnTimeout);
      this.fadeOut(10).then(()=> {
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
        .then(this.fadeOut.bind(this, this.decay))
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

    let start = new Date().getTime();
    let time = 0;

    let deferred = q.defer(); 
    let originalGain = this.originalGain || 1;

    let step = originalGain / 50;

    let fadeInStep = ()=> {

      if (this.gain > originalGain) {
        this.gain = originalGain; 
        if(!this.isPlaying) {
          deferred.reject();
        }
        deferred.resolve();
      } else {
        if(this.isPlaying) {
          time += this.attack;
          this.gain = this.gain + step;
          let diff = new Date().getTime() - start - time;
          setTimeout(fadeInStep.bind(this), this.attack - diff);
        }
      }
    }

    setTimeout(fadeInStep.bind(this), this.attack)
    return deferred.promise;
  }

  fadeOut(decay) {

    let start = new Date().getTime();
    let time = 0;

    let deferred = q.defer();
    let step = this.gain / 50;

    let fadeOutStep = ()=> {
      if (this.gain < 0.0001) {
        this.gain = 0;
        deferred.resolve();
      } else {
        time += decay;
        this.gain = this.gain - step;
        let diff = new Date().getTime() - start - time;
        setTimeout(fadeOutStep, decay - diff);
      }
    }

    setTimeout(fadeOutStep, decay);
    return deferred.promise;
  }
}

module.exports = AudioDevice;
