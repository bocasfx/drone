'use strict';

const React        = require('react');
const AudioDevice  = require('../audio-device.jsx');
const dragSource   = require('react-dnd').DragSource;
const audioContext = require('../../audio-context');

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
    if (result.killDevice) {
      component.killDevice();
      return;
    }
    
    component.state.left = result.left;
    component.state.top = result.top;
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

    this.oscillator = audioContext.createOscillator();
    super.initialize(this.oscillator);
    this.oscillator.type = 'triangle';
    this.oscillator.start();
  }

  set frequency(freq) {
    this.oscillator.frequency.value = freq * 200;
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

    let controlsDisplay = this.state.showControls ? 1 : 0;
    let controlsStyle = {
      opacity: controlsDisplay
    }

    return connectDragSource(
      <div className="synth" style={style} onMouseEnter={this.showControls.bind(this)} onMouseLeave={this.showControls.bind(this)}>
        <div style={controlsStyle}>
          <i className="cog fa fa-cog"></i>
          <i className="times fa fa-times" onClick={this.killDevice.bind(this)}></i>
        </div>
        <div className="progress" draggable='true' onDrag={this.onDrag.bind(this)} onClick={this.play.bind(this)}></div>
      </div>
    );
  }
}

module.exports = dragSource('synth', synthSource, collect)(Synth);
