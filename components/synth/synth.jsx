'use strict';

const React             = require('react');
const AudioDevice       = require('../audio-device.jsx');
const dragSource        = require('react-dnd').DragSource;
const SynthEditor       = require('./synth-editor.jsx');

var synthSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.left),
      top: parseInt(component.state.top)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result.suicide) {
      component.suicide();
      return;
    }
    
    component.state.left = result.left;
    component.state.top = result.top;

    if (!component.playOnDrag) {
      component.oscillatorFrequency = component.normalizeFrequency(result.left);
      component.gain = component.normalizeGain(result.top);
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Synth extends AudioDevice {

  constructor(props) {
    super(props);
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

  initialize() {

    super.initialize();
    
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'triangle';
    this.oscillator.frequency.value = 0;

    this.oscillator.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);

    this.oscillatorFrequency = this.normalizeFrequency(this.state.left);
    this.gain = this.normalizeGain(this.state.top);

    this.oscillator.start();
  }

  set oscillatorFrequency(level) {
    this.oscillator.frequency.value = level;
  }

  onDrag(event) {
    if (this.playOnDrag) {
      this.oscillatorFrequency = this.normalizeFrequency(event.clientX);
      this.gain = this.normalizeGain(event.clientY);
    }
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

    this.props.killDevice(this);
  }

  render() {
    let isDragging = this.props.isDragging;
    let connectDragSource = this.props.connectDragSource;
    let left = this.state.left;
    let top = this.state.top;
    let opacity = isDragging ? 0 : 1;
    let style = {
      opacity: opacity,
      left: left + 'px',
      top: top + 'px'
    };

    return connectDragSource(
      <div className="synth" style={style}>
        <span className="progress" draggable='true' onDrag={this.onDrag.bind(this)} onClick={this.play.bind(this)}></span>
      </div>
    );
  }
}

module.exports = dragSource('synth', synthSource, collect)(Synth);
