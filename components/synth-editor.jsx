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
    this.state.synth.hideEditor();
  }

  setWaveShaperCurve(value) {
    this.state.synth.setWaveShaperCurve(value);
  }

  setGain(event) {
    this.state.synth.gain = this.state.synth.normalizeGain(parseInt(event.target.value));
  }

  render() {

    let waveShaperCurveLevel = this.state.synth.state.levels.waveShaperCurve;

    return (
      <div className="synth-editor">
        <div className="close-synth-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>
        <div className="slider-label">Waveshaper Curve</div>
        <div className="slider">
          <Slider min={0} max={500} defaultValue={waveShaperCurveLevel} onChange={this.setWaveShaperCurve.bind(this)}/>
        </div>
      </div>
    )
  }
}

module.exports = SynthEditor;
