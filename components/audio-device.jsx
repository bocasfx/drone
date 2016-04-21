'use strict';

const React        = require('react');
const Component    = React.Component;
const PropTypes    = React.PropTypes;
const ReactDOM     = require('react-dom');
const colors       = require('../config').synthColors;
const ProgressBar  = require('progressbar.js');
const Gain         = require('../modules/gain');
const Waveshaper   = require('../modules/waveshaper');
const BiquadFilter = require('../modules/biquad-filter');
const Panner       = require('../modules/panner');

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
      id: this.props.id,
      showControls: false
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
    let fillIdx = Math.floor(Math.random() * colors.length);

    this.progressBar = new ProgressBar.Circle(domNode.children[1], {
      color: colors[colorIdx],
      strokeWidth: 10,
      fill: colors[fillIdx],
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

  initialize(source) {

    let level = 1 - (this.props.top / this.windowHeight);

    this.gain         = new Gain({level: level});
    this.waveshaper   = new Waveshaper({});
    this.biquadFilter = new BiquadFilter({});
    this.panner       = new Panner({});

    source.connect(this.waveshaper.node);
    this.waveshaper.connect(this.biquadFilter.node);
    this.biquadFilter.connect(this.panner.node);
    this.panner.connect(this.gain.node);
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
    this.state.showControls = !this.state.showControls;
    this.forceUpdate();
  }
}

module.exports = AudioDevice;
