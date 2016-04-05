'use strict';

const React         = require('react');
const Component     = React.Component;
const Mixer         = require('./Mixer.jsx');
var HTML5Backend    = require('react-dnd-html5-backend');
var dragDropContext = require('react-dnd').DragDropContext;

class MixerContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Mixer/>
    );
  }
}

module.exports = dragDropContext(HTML5Backend)(MixerContainer);
