'use strict';

const React             = require('react');
const Component         = React.Component;
const PropTypes         = React.PropTypes;
const ReactDOM          = require('react-dom');
const colors            = require('../config').synthColors;
const ProgressBar       = require('progressbar.js');
const q                 = require('q');
const Gain              = require('../modules/gain');
const Waveshaper        = require('../modules/waveshaper');
const BiquadFilter      = require('../modules/biquad-filter');
const audioContext      = require('../audio-context');

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
      id: this.props.id
    }

    this.isPlaying = false;
    this.progress = 0;
    this.duration = 100;
    this.timeOut = null;

    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

    this.yParameter = 'gain';
    this.xParameter = 'frequency'

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
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
    this.enableGainEnvelope = true;
    this.frequency = this.props.left / this.windowWidth;;
    this.forceUpdate();
  }

  initialize() {

    this.gain = new Gain({
      level: 1 - (this.props.top / this.windowHeight)
    });

    this.waveshaper = new Waveshaper({});

    this.biquadFilter = new BiquadFilter({});

    this.panner = audioContext.createPanner();
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

    this.listener = audioContext.listener;
    this.listener.setOrientation(0,0,-1,0,1,0);
    this.listener.setPosition(this.windowWidth/2, this.windowHeight/2, 5);
  }

  set frequency(freq) {
  }

  onDrag(event) {
    this[this.xParameter] = event.clientX / this.windowWidth;
    this[this.yParameter].level = 1 - (event.clientY / this.windowHeight);
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
      this.gain.endAutomation();
    } else {
      this.isPlaying = true;
      this.startProgressBarAnimation();
      this.gain.startAutomation();
    }
  }
}

module.exports = AudioDevice;
