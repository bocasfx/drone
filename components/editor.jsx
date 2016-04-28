'use strict';

const React     = require('react');
const Component = React.Component;
const controls  = require('../config').controls;
const Slider    = require('rc-slider');
const Knob      = require('./knob.jsx');
const Toggle    = require('./toggle.jsx');

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    }

    this.device = null;
  }

  hide() {
    this.setState({
      show: false
    });
  }

  show(device) {
    this.setState({
      show: true
    });

    this.device = device;
  }

  setLevel(module, parameter, level) {
    this.device[module][parameter] = level;
  }

  setOscillatorWave(type) {
    this.device.type = type;
  }

  toggleGainEnvelope(value) {
    this.device.enableGainEnvelope = value;
  }

  render() {
    let display = this.state.show ? 'block' : 'none';
    let style = {
      display: display
    }

    let curve = controls.waveshaper.settings.curve;
    let filterGain = controls.biquadFilter.settings.gain;
    let filterFrequency = controls.biquadFilter.settings.frequency;
    let envelope = controls.envelope.settings;
    let panner = controls.panner.settings;

    return(
      <div style={style}>
        <div className="editor-blanket"></div>
        <div className="editor">
          <div className="hide-editor" onClick={this.hide.bind(this)}>
            <i className="fa fa-times noselect"></i>
          </div>
          <div className="modules">
            <div className="editor-section">
              <div className="editor-section-label noselect">Oscillator Wave</div>
              <Toggle orientation="horizontal" labels={['Sine', 'Triangle', 'Square', 'Sawtooth']} values={['sine', 'triangle', 'square', 'sawtooth']} onChange={this.setOscillatorWave.bind(this)}/>
              <Toggle orientation="horizontal" labels={['On', 'Off']} values={[true, false]} onChange={this.toggleGainEnvelope.bind(this)}/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label noselect">Amplitude Envelope</div>
              <Knob value={envelope.attack.default} onChange={this.setLevel.bind(this, 'gain', 'attack')} label="Attack" min={envelope.attack.min} max={envelope.attack.max} knobColor="olive"/>
              <Knob value={envelope.decay.default} onChange={this.setLevel.bind(this, 'gain', 'decay')} label="Decay" min={envelope.decay.min} max={envelope.decay.max} knobColor="olive"/>
              <Knob value={envelope.sustain.default} onChange={this.setLevel.bind(this, 'gain', 'sustain')} label="Sustain" min={envelope.sustain.min} max={envelope.sustain.max} knobColor="olive"/>
              <Knob value={envelope.release.default} onChange={this.setLevel.bind(this, 'gain', 'release')} label="Release" min={envelope.release.min} max={envelope.release.max} knobColor="olive"/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label noselect">Waveshaper & Filter</div>
              <Knob value={curve.default} onChange={this.setLevel.bind(this, 'waveshaper', 'curve')} label="Curve" min={curve.min} max={curve.max}/>
              <Knob value={filterGain.default} onChange={this.setLevel.bind(this, 'biquadFilter', 'gain')} label="Gain" min={filterGain.min} max={filterGain.max}/>
              <Knob value={filterFrequency.default} onChange={this.setLevel.bind(this, 'biquadFilter', 'frequency')} label="Frequency" min={filterFrequency.min} max={filterFrequency.max}/>
              <Knob value={panner.position.default} onChange={this.setLevel.bind(this, 'panner', 'position')} label={panner.position.label} min={panner.position.min} max={panner.position.max} knobColor="aqua"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Editor;
