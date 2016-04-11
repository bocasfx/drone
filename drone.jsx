'use strict';

const React    = require('react');
const Component       = React.Component;
const config          = require('./config');
const dragDropContext = require('react-dnd').DragDropContext;
const Toolbox  = require('./components/toolbox/toolbox.jsx');
const Mixer    = require('./components/mixer.jsx');

class Drone extends Component {

  constructor(props) {
    super(props);
    this.state = {
      synths: [],
      loopers: []
    }
  }

  addAudioDevice(type, device) {
    if (type === 'synth') {
      this.state.synths.push(device);
    } else if (type === 'looper') {
      this.state.loopers.push(device);
    }

    this.forceUpdate();
  }

  render() {
    return(
      <div className="app-container">
        <Toolbox addAudioDevice={this.addAudioDevice.bind(this)}/>
        <Mixer synths={this.state.synths} loopers={this.state.loopers}/>
      </div>
    );
  }

}

module.exports = dragDropContext(config.backend)(Drone);
