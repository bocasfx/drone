'use strict';

const React        = require('react');
const Component    = React.Component;
const PropTypes    = React.PropTypes;
const ReactDOM     = require('react-dom');
const colors       = require('../config').synthColors;
const Gain         = require('../modules/gain');
const Waveshaper   = require('../modules/waveshaper');
const BiquadFilter = require('../modules/biquad-filter');
const Panner       = require('../modules/panner');
const _            = require('lodash');

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
    this.duration = 100;
    this.timeOut = null;

    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

    this.yParameter = 'gain';
    this.xParameter = 'frequency'

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.color = _.sample(colors);
    while ((this.backgroundColor = _.sample(colors)) === this.color) {

    }
  }

  componentDidMount() {

    this.setState({
      left: this.props.left,
      top: this.props.top
    });

    this.initialize();
    this.enableGainEnvelope = true;
    this.frequency = this.props.left / this.windowWidth;;
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

  play(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (this.isPlaying) {
      this.isPlaying = false;
      if (this.enableGainEnvelope) {
        this.gain.endAutomation();
      } else {
        this.gain.off();
      }
    } else {
      this.isPlaying = true;
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
}

module.exports = AudioDevice;
