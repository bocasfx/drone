'use strict';

const React        = require('react');
const AudioDevice  = require('./audio-device.jsx');
const dragSource   = require('react-dnd').DragSource;
const audioContext = require('../audio-context');

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

    if (!result) {
      return;
    }

    if (result.killDevice) {
      component.killDevice();
      return;
    }
    
    component.setState({
      left: result.left,
      top: result.top
    });
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

  initialize() {
    this.oscillator = audioContext.createOscillator();
    super.initialize(this.oscillator);
    this.oscillator.type = 'sine';
    this.oscillator.start();
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

    let controlsOpacity = this.state.showControls ? 1 : 0;
    let controlsStyle = {
      opacity: controlsOpacity,
      transition: 'opacity .25s ease-in-out'
    }

    let iconStyle = {
      color: this.color
    };

    let containerStyle = {
      backgroundColor: this.backgroundColor,
      border: '2px solid' + this.color
    }

    let animate = this.isPlaying ? 'anim' : '';

    return connectDragSource(
      <div className="synth" style={style} onMouseEnter={this.showControls.bind(this)} onMouseLeave={this.showControls.bind(this)}>
        <div style={controlsStyle}>
          <i className="control control-top fa fa-cog" onClick={this.showEditor.bind(this)}></i>
          <i className="control control-top control-right fa fa-times" onClick={this.killDevice.bind(this)}></i>
        </div>
        <div style={containerStyle} className="progress" draggable='true' onDrag={this.onDrag.bind(this)} onClick={this.play.bind(this)}>
          <div className={`osc ${animate}`}>
            <i style={iconStyle} className="fa fa-times-circle-o"></i>
          </div>
        </div>
        <div style={controlsStyle}>
          <i className="control control-bottom fa fa-plus" onClick={this.cloneDevice.bind(this)}></i>
          <i className="control control-bottom control-right fa fa-headphones" onClick={this.soloDevice.bind(this)}></i>
        </div>
      </div>
    );
  }
}

module.exports = dragSource('synth', synthSource, collect)(Synth);
