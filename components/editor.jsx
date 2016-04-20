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
    console.log(device);
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

        <div className="slider-label">Waveshaper Curve</div>
        <div className="slider">
          <Slider min={curve.min} max={curve.max} defaultValue={curve.default} onChange={this.setWaveShaperCurve.bind(this)}/>
        </div>

        <div className="separator"/>

        <div className="slider-label">Filter Gain</div>
        <div className="slider">
          <Slider min={filterGain.min} max={filterGain.max} defaultValue={filterGain.default} onChange={this.setFilterGain.bind(this)}/>
        </div>

        <div className="slider-label">Filter Frequency</div>
        <div className="slider">
          <Slider min={filterFrequency.min} max={filterFrequency.max} defaultValue={filterFrequency.default} onChange={this.setFilterFrequency.bind(this)}/>
        </div>

        <Knob value={5} onChange={this.handleChange} label="Gain"/>
      </div>
    );
  }
}

module.exports = Editor;
