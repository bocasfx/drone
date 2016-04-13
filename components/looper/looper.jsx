'use strict';

const React             = require('react');
const AudioDevice       = require('../audio-device.jsx');
const dragSource        = require('react-dnd').DragSource;
const LooperEditor      = require('./looper-editor.jsx');

var looperSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.left),
      top: parseInt(component.state.top)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result && result.killDevice) {
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

class Looper extends AudioDevice {

  constructor(props) {
    super(props);
    this.enableGainEnvelope = false;
  }

  get progressBarStyle() {
    return {
      position: 'absolute',
      left: '12.5px',
      top: '6px',
      padding: '0',
      margin: '0',
      'font-size': '2em'
    }
  }

  get progressBarIcon() {
    return '\u2707';
  }

  initialize() {

    super.initialize();

    this.maxFreq = 1000;

    this.bufferSource = this.audioContext.createBufferSource();

    this.bufferSource.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.panner);
    this.panner.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.bufferSource.start();
  }

  killDevice() {
    this.props.killDevice(this);
  }

  bufferData(data) {
    this.audioContext.decodeAudioData(data, (buffer)=> {
      this.bufferSource.buffer = buffer;
      this.bufferSource.loop = true;
    });
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

module.exports = dragSource('looper', looperSource, collect)(Looper);
