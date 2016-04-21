'use strict';

const React     = require('react');
const Component = React.Component;
const ranges    = require('../config').ranges;
const Slider    = require('rc-slider');
const Knob      = require('./knob.jsx');

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      device: null
    }
  }

  hide() {
    this.state.show = false;
    this.forceUpdate();
  }

  show(device) {
    this.state.show = true;
    this.state.device = device;
    this.forceUpdate();
  }

  setWaveShaperCurve(curve) {
    this.state.device.waveshaper.curve = curve;
  }

  setFilterGain(gain) {
    this.state.device.biquadFilter.gain = gain;
  }

  setFilterFrequency(frequency) {
    this.state.device.biquadFilter.frequency = frequency;
  }

  handleChange(val) {
    console.log(val);
  }

  render() {
    let display = this.state.show ? 'block' : 'none';
    let style = {
      display: display
    }

    let curve = ranges.waveshaper.curve;
    let filterGain = ranges.biquadFilter.gain;
    let filterFrequency = ranges.biquadFilter.frequency;

    return(
      <div style={style} className="editor">
        <div className="hide-editor" onClick={this.hide.bind(this)}>
          <i className="fa fa-times"></i>
        </div>
        <Knob value={curve.default} onChange={this.setWaveShaperCurve.bind(this)} label="Curve" min={curve.min} max={curve.max}/>
        <Knob value={filterGain.default} onChange={this.setFilterGain.bind(this)} label="Gain" min={filterGain.min} max={filterGain.max}/>
        <Knob value={filterFrequency.default} onChange={this.setFilterFrequency.bind(this)} label="Frequency" min={filterFrequency.min} max={filterFrequency.max}/>
      </div>
    );
  }
}

module.exports = Editor;
