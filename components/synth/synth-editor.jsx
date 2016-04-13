'use strict';

require('rc-slider/assets/index.css');

const React     = require('react');
const Component = React.Component;
const Slider    = require('rc-slider');

class SynthEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      synth: props.synth
    }
  }

  close() {
    console.log('closing');
  }

  setWaveShaperCurve(amount) {
    this.state.synth.waveShaperCurve = amount;
  }

  setFilterGain(level) {
    this.state.synth.filterGain = level;
  }

  setFilterFrequency(level) {
    this.state.synth.filterFrequency = level;
  }

  render() {
    return (
      <div className="synth-editor">
        <div className="close-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>

        <div className="slider-label">Waveshaper Curve</div>
        <div className="slider">
          <Slider min={0} max={500} defaultValue={0} onChange={this.setWaveShaperCurve.bind(this)}/>
        </div>

        <div className="separator"/>

        <div className="slider-label">Filter Gain</div>
        <div className="slider">
          <Slider min={0} max={40} defaultValue={20} onChange={this.setFilterGain.bind(this)}/>
        </div>

        <div className="slider-label">Filter Frequency</div>
        <div className="slider">
          <Slider min={20} max={2500} defaultValue={0} onChange={this.setFilterFrequency.bind(this)}/>
        </div>
      </div>
    )
  }
}

module.exports = SynthEditor;
