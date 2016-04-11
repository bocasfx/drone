'use strict';

const React    = require('react');
const Component       = React.Component;
const config          = require('./config');
const dragDropContext = require('react-dnd').DragDropContext;
const Toolbox  = require('./components/toolbox.jsx');
const Mixer    = require('./components/mixer.jsx');

class Drone extends Component {

  render() {
    return(
      <div className="app-container">
        <Toolbox/>
        <Mixer synths={[]} loopers={[]}/>
      </div>
    );
  }

}

module.exports = dragDropContext(config.backend)(Drone);
