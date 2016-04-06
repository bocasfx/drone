'use strict';

const React           = require('react');
const Component       = React.Component;
const Looper          = require('./Looper.jsx');
const dropTarget      = require('react-dnd').DropTarget;
const HTML5Backend    = require('react-dnd-html5-backend');
const dragDropContext = require('react-dnd').DragDropContext;
const flow            = require('lodash/flow');

const mixerTarget = {

  drop: function (props, monitor, component) {
    let item = monitor.getItem();
    let delta = monitor.getDifferenceFromInitialOffset();
    console.log(`Delta: ${JSON.stringify(delta)}`);
    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);

    return {
      xPos: left,
      yPos: top
    }
  }
};

const collect = function(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    // isOver: monitor.isOver(),
    // isOverCurrent: monitor.isOver({ shallow: true }),
    // canDrop: monitor.canDrop(),
    // itemType: monitor.getItemType()
  };
}

class Mixer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let connectDropTarget = this.props.connectDropTarget;
    return connectDropTarget(
      <div className="mixer">
        <Looper src="media/loop.mp3" xPos="100" yPos="100"/>
        <Looper src="media/loop2.mp3" xPos="200" yPos="200"/>
      </div>
    );
  }
}

module.exports = flow(
  dropTarget('looper', mixerTarget, collect),
  dragDropContext(HTML5Backend)
)(Mixer);
