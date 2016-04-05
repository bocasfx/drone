'use strict';

const React           = require('react');
const Component       = React.Component;
const Looper          = require('./Looper.jsx');
const HTML5Backend    = require('react-dnd-html5-backend');
const dragDropContext = require('react-dnd').DragDropContext;

class Mixer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Looper src="media/loop.mp3" xPos="100" yPos="100"/>
        <Looper src="media/loop2.mp3" xPos="200" yPos="200"/>
      </div>
    );
  }
}

module.exports = dragDropContext(HTML5Backend)(Mixer);
