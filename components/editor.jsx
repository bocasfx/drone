'use strict';

const React     = require('react');
const Component = React.Component;
const controls  = require('../config').controls;
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

  setAttack(level) {
    this.state.device.gain.attack = level;
  }

  setDecay(level) {
    this.state.device.gain.decay = level;
  }

  setSustain(level) {
    this.state.device.gain.sustain = level;
  }

  setRelease(level) {
    this.state.device.gain.release = level;
  }

  setRefDistance(level) {
    this.state.device.panner.refDistance = level;
  }

  setMaxDistance(level) {
    this.state.device.panner.maxDistance = level;
  }

  setRolloffFactor(level) {
    this.state.device.panner.rolloffFactor = level;
  }

  setConeInnerAngle(level) {
    this.state.device.panner.coneInnerAngle = level;
  }

  setConeOuterAngle(level) {
    this.state.device.panner.coneOuterAngle = level;
  }

  setConeOuterGain(level) {
    this.state.device.panner.coneOuterGain = level;
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
          <div className="editor-section">
            <div className="editor-section-label">Amplitude Envelope</div>
            <Knob value={envelope.attack.default} onChange={this.setAttack.bind(this)} label="Attack" min={envelope.attack.min} max={envelope.attack.max} knobColor="olive"/>
            <Knob value={envelope.decay.default} onChange={this.setDecay.bind(this)} label="Decay" min={envelope.decay.min} max={envelope.decay.max} knobColor="olive"/>
            <Knob value={envelope.sustain.default} onChange={this.setSustain.bind(this)} label="Sustain" min={envelope.sustain.min} max={envelope.sustain.max} knobColor="olive"/>
            <Knob value={envelope.release.default} onChange={this.setRelease.bind(this)} label="Release" min={envelope.release.min} max={envelope.release.max} knobColor="olive"/>
          </div>
          <div className="editor-section">
            <div className="editor-section-label">Waveshaper & Filter</div>
            <Knob value={curve.default} onChange={this.setWaveShaperCurve.bind(this)} label="Curve" min={curve.min} max={curve.max}/>
            <Knob value={filterGain.default} onChange={this.setFilterGain.bind(this)} label="Gain" min={filterGain.min} max={filterGain.max}/>
            <Knob value={filterFrequency.default} onChange={this.setFilterFrequency.bind(this)} label="Frequency" min={filterFrequency.min} max={filterFrequency.max}/>
          </div>
          <div className="editor-section">
            <div className="editor-section-label">Panner</div>
            <Knob value={panner.refDistance.default} onChange={this.setRefDistance.bind(this)} label="Reference Distance" min={panner.refDistance.min} max={panner.refDistance.max} knobColor="aqua"/>
            <Knob value={panner.maxDistance.default} onChange={this.setMaxDistance.bind(this)} label="Max Distance" min={panner.maxDistance.min} max={panner.maxDistance.max} knobColor="aqua"/>
            <Knob value={panner.rolloffFactor.default} onChange={this.setRolloffFactor.bind(this)} label="Rolloff Factor" min={panner.rolloffFactor.min} max={panner.rolloffFactor.max} knobColor="aqua"/>
            <Knob value={panner.coneInnerAngle.default} onChange={this.setConeInnerAngle.bind(this)} label="Cone Inner Angle" min={panner.coneInnerAngle.min} max={panner.coneInnerAngle.max} knobColor="aqua"/>
            <Knob value={panner.coneOuterAngle.default} onChange={this.setConeOuterAngle.bind(this)} label="Cone Outer Angle" min={panner.coneOuterAngle.min} max={panner.coneOuterAngle.max} knobColor="aqua"/>
            <Knob value={panner.coneOuterGain.default} onChange={this.setConeOuterGain.bind(this)} label="Cone Outer Gain" min={panner.coneOuterGain.min} max={panner.coneOuterGain.max} knobColor="aqua"/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Editor;
