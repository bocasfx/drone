'use strict';

const React           = require('react');
const Component       = React.Component;
const config          = require('./config');
const Toolbox         = require('./components/toolbox.jsx');
const Mixer           = require('./components/mixer.jsx');
const _               = require('lodash');
const inflect         = require('i')();

class Drone extends Component {

  constructor(props) {
    super(props);
    this.state = {
      synths: [],
      loopers: []
    }
  }

  addAudioDevice(device) {
    let type = inflect.pluralize(device.type);
    this.state[type].push(device);
    this.forceUpdate();
  }

  killDevice(device) {
    let type = inflect.pluralize(device.props.type);
    _.remove(this.state[type], {
      key: device.props.id
    });
    this.forceUpdate();
  }

  render() {
    return(
      <div className="app-container">
        <Toolbox/>
        <Mixer synths={this.state.synths} loopers={this.state.loopers} killDevice={this.killDevice.bind(this)} addAudioDevice={this.addAudioDevice.bind(this)}/>
      </div>
    );
  }

}

module.exports = Drone;
