'use strict';

const React     = require('react');
const Component = React.Component;
const controls  = require('../config').controls;
const Knob      = require('./knob.jsx');
const Switch    = require('./switch.jsx');
const _         = require('lodash');

class Editor extends Component {

  constructor(props) {
    super(props);

    this.device = null;

    this.state = {
      envelope: {
        attack: controls.envelope.settings.attack.default,
        decay: controls.envelope.settings.decay.default,
        sustain: controls.envelope.settings.sustain.default,
        release: controls.envelope.settings.release.default
      },
      waveshaper: {
        curve: controls.waveshaper.settings.curve.default
      },
      biquadFilter: {
        gain: controls.biquadFilter.settings.gain.default,
        frequency: controls.biquadFilter.settings.frequency.default
      },
      panner: {
        position: controls.panner.settings.position.default
      },
      oscillator: {
        wave: controls.oscillator.settings.wave.default,
        toggleEnvelope: controls.oscillator.settings.toggleEnvelope.default
      },
      show: false
    };

    this.settings = {
      envelope: controls.envelope.settings,
      waveshaper: controls.waveshaper.settings,
      biquadFilter: controls.biquadFilter.settings,
      panner: controls.panner.settings,
      oscillator: controls.oscillator.settings
    };
  }

  hide() {
    this.setState({
      show: false
    });
  }

  show(device) {
    this.device = device;
    this.loadDeviceParameters();
  }

  loadDeviceParameters() {
    let wave = _.findIndex(controls.oscillator.settings.wave.values, (o)=> { return o === this.device.type; });
    let toggleEnvelope = _.findIndex(controls.oscillator.settings.toggleEnvelope.values, (o)=> { return o === this.device.enableGainEnvelope; });
    
    this.setState({
      envelope: {
        attack: this.device.gain.attack,
        decay: this.device.gain.decay,
        sustain: this.device.gain.sustain,
        release: this.device.gain.release
      },
      waveshaper: {
        curve: this.device.waveshaper.curve
      },
      biquadFilter: {
        gain: this.device.biquadFilter.gain,
        frequency: this.device.biquadFilter.frequency
      },
      panner: {
        position: this.device.panner.position
      },
      oscillator: {
        wave: wave,
        toggleEnvelope: toggleEnvelope
      },
      show: true
    });
  }

  setLevel(module, parameter, level) {
    this.device[module][parameter] = parseFloat(level);
  }

  setOscillatorWave(type) {
    this.device.type = type;
  }

  toggleGainEnvelope(value) {
    this.device.enableGainEnvelope = value;
  }

  render() {

    let style = {
      display: this.state.show ? 'block' : 'none'
    }

    let envelope = this.settings.envelope;
    let waveshaper = this.settings.waveshaper;
    let biquadFilter = this.settings.biquadFilter;
    let panner = this.settings.panner;
    let oscillator = this.settings.oscillator;

    return(
      <div style={style}>
        <div className="editor-blanket"></div>
        <div className="editor">
          <div className="hide-editor" onClick={this.hide.bind(this)}>
            <i className="fa fa-times noselect"></i>
          </div>
          <div className="modules">
            <div className="editor-section">
              <div className="editor-section-label noselect">Oscillator</div>
              <Switch
                value={this.state.oscillator.wave}
                onChange={this.setOscillatorWave.bind(this)}
                label={oscillator.wave.label}
                knobColor="purple"
                labels={oscillator.wave.labels}
                values={oscillator.wave.values}/>
              <Switch
                value={this.state.oscillator.toggleEnvelope}
                onChange={this.toggleGainEnvelope.bind(this)}
                label={oscillator.toggleEnvelope.label}
                knobColor="purple"
                labels={oscillator.toggleEnvelope.labels}
                values={oscillator.toggleEnvelope.values}/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label noselect">Amplitude Envelope</div>
              <Knob 
                value={this.state.envelope.attack}
                onChange={this.setLevel.bind(this, 'gain', 'attack')}
                label={envelope.attack.label}
                min={envelope.attack.min}
                max={envelope.attack.max}
                knobColor="olive"/>
              <Knob 
                value={this.state.envelope.decay}
                onChange={this.setLevel.bind(this, 'gain', 'decay')}
                label={envelope.decay.label}
                min={envelope.decay.min}
                max={envelope.decay.max}
                knobColor="olive"/>
              <Knob 
                value={this.state.envelope.sustain}
                onChange={this.setLevel.bind(this, 'gain', 'sustain')}
                label={envelope.sustain.label}
                min={envelope.sustain.min}
                max={envelope.sustain.max}
                knobColor="olive"/>
              <Knob 
                value={this.state.envelope.release}
                onChange={this.setLevel.bind(this, 'gain', 'release')}
                label={envelope.release.label}
                min={envelope.release.min}
                max={envelope.release.max}
                knobColor="olive"/>
            </div>
            <div className="editor-section">
              <div className="editor-section-label noselect">Waveshaper & Filter</div>
              <Knob 
                value={this.state.waveshaper.curve}
                onChange={this.setLevel.bind(this, 'waveshaper', 'curve')}
                label={waveshaper.curve.label}
                min={waveshaper.curve.min}
                max={waveshaper.curve.max}/>
              <Knob 
                value={this.state.biquadFilter.gain}
                onChange={this.setLevel.bind(this, 'biquadFilter', 'gain')}
                label={biquadFilter.gain.label}
                min={biquadFilter.gain.min}
                max={biquadFilter.gain.max}/>
              <Knob 
                value={this.state.biquadFilter.frequency}
                onChange={this.setLevel.bind(this, 'biquadFilter', 'frequency')}
                label={biquadFilter.frequency.label}
                min={biquadFilter.frequency.min}
                max={biquadFilter.frequency.max}/>
              <Knob 
                value={this.state.panner.position}
                onChange={this.setLevel.bind(this, 'panner', 'position')}
                label={panner.position.label}
                min={panner.position.min}
                max={panner.position.max}
                knobColor="aqua"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Editor;
