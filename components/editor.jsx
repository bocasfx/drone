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
    this.state.show = false;
    this.forceUpdate();
  }

  show(device) {
    this.state.show = true;
    this.device = device;
    this.forceUpdate();
  }

  setLevel(module, parameter, level) {
    this.device[module][parameter] = level;
  }

  setOscillatorWave(type) {
    this.device.type = type;
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
            <i className="fa fa-times"></i>
          </div>
          <div className="modules">
            <div className="editor-section">
              <div className="editor-section-label">Amplitude Envelope</div>
              <Knob value={envelope.attack.default} onChange={this.setLevel.bind(this, 'gain', 'attack')} label="Attack" min={envelope.attack.min} max={envelope.attack.max} knobColor="olive"/>
              <Knob value={envelope.decay.default} onChange={this.setLevel.bind(this, 'gain', 'decay')} label="Decay" min={envelope.decay.min} max={envelope.decay.max} knobColor="olive"/>
              <Knob value={envelope.sustain.default} onChange={this.setLevel.bind(this, 'gain', 'sustain')} label="Sustain" min={envelope.sustain.min} max={envelope.sustain.max} knobColor="olive"/>
              <Knob value={envelope.release.default} onChange={this.setLevel.bind(this, 'gain', 'release')} label="Release" min={envelope.release.min} max={envelope.release.max} knobColor="olive"/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label">Waveshaper & Filter</div>
              <Knob value={curve.default} onChange={this.setLevel.bind(this, 'waveshaper', 'curve')} label="Curve" min={curve.min} max={curve.max}/>
              <Knob value={filterGain.default} onChange={this.setLevel.bind(this, 'biquadFilter', 'gain')} label="Gain" min={filterGain.min} max={filterGain.max}/>
              <Knob value={filterFrequency.default} onChange={this.setLevel.bind(this, 'biquadFilter', 'frequency')} label="Frequency" min={filterFrequency.min} max={filterFrequency.max}/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label">Panner</div>
              <Knob value={panner.refDistance.default} onChange={this.setLevel.bind(this, 'panner', 'refDistance')} label="Reference Distance" min={panner.refDistance.min} max={panner.refDistance.max} knobColor="aqua"/>
              <Knob value={panner.maxDistance.default} onChange={this.setLevel.bind(this, 'panner', 'maxDistance')} label="Max Distance" min={panner.maxDistance.min} max={panner.maxDistance.max} knobColor="aqua"/>
              <Knob value={panner.rolloffFactor.default} onChange={this.setLevel.bind(this, 'panner', 'rolloffFactor')} label="Rolloff Factor" min={panner.rolloffFactor.min} max={panner.rolloffFactor.max} knobColor="aqua"/>
              <Knob value={panner.coneInnerAngle.default} onChange={this.setLevel.bind(this, 'panner', 'coneInnerAngle')} label="Cone Inner Angle" min={panner.coneInnerAngle.min} max={panner.coneInnerAngle.max} knobColor="aqua"/>
              <Knob value={panner.coneOuterAngle.default} onChange={this.setLevel.bind(this, 'panner', 'coneOuterAngle')} label="Cone Outer Angle" min={panner.coneOuterAngle.min} max={panner.coneOuterAngle.max} knobColor="aqua"/>
              <Knob value={panner.coneOuterGain.default} onChange={this.setLevel.bind(this, 'panner', 'coneOuterGain')} label="Cone Outer Gain" min={panner.coneOuterGain.min} max={panner.coneOuterGain.max} knobColor="aqua"/>
              <Knob value={panner.position.default} onChange={this.setLevel.bind(this, 'panner', 'position')} label="Position" min={panner.position.min} max={panner.position.max} knobColor="aqua"/>
            </div>
          </div>
          <div className="settings">
            <div className="editor-section">
              <div className="editor-section-label">Oscillator Wave</div>
              <Toggle orientation="horizontal" values={['sine', 'triangle', 'square', 'sawtooth']} onChange={this.setOscillatorWave.bind(this)}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Editor;
