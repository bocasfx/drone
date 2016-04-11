'use strict';

const React           = require('react');
const Component       = React.Component;
const ToolboxBtn      = require('./toolbox-btn.jsx');

class Toolbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      class: 'toolbox',
      showButtons: false,
      addAudioDevice: props.addAudioDevice
    };
  }

  render() {

    return (
      <div className={this.state.class}>
        <div className="logo">DRONE</div>
        <ToolboxBtn iconClass="synth" addAudioDevice={this.state.addAudioDevice}/>
        <ToolboxBtn iconClass="looper" addAudioDevice={this.state.addAudioDevice}/>
      </div>
    );
  }
}

module.exports = Toolbox;