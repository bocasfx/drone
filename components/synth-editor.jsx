'use strict';

const React     = require('react');
const Component = React.Component;

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

  setDistortionCurve(event) {
    if (event.target.value === '') {
      return;
    }

    let level = parseInt(event.target.value);

    this.state.synth.setDistortionCurve(level);
  }

  setGain(event) {
    this.state.synth.gain = this.state.synth.normalizeGain(parseInt(event.target.value));
  }

  render() {
    return (
      <div className="synth-editor">
        <div className="close-synth-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>
        <label>WSC <input type="number" defaultValue="200" onChange={this.setDistortionCurve.bind(this)}/></label><br />
      </div>
    )
  }
}

module.exports = SynthEditor;
