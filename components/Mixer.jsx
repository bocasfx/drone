'use strict';

const React       = require('react');
const Component   = React.Component;
const Looper      = require('./Looper.jsx');
const dropTarget  = require('react-dnd').DropTarget;

const mixerTarget = {

  drop: function (props, monitor) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    console.log(left, top);

    // component.moveBox(item.id, left, top);
  }
};

const collect = function(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class Mixer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let connectDropTarget = this.props.connectDropTarget;
    return connectDropTarget(
      <div>
        <Looper src="media/loop.mp3" xPos="100" yPos="100"/>
        <Looper src="media/loop2.mp3" xPos="200" yPos="200"/>
      </div>
    );
  }
}

module.exports = dropTarget('looper', mixerTarget, collect)(Mixer);
