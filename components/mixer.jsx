'use strict';

const React           = require('react');
const Component       = React.Component;
const Synth           = require('./synth.jsx');
const dropTarget      = require('react-dnd').DropTarget;
const HTML5Backend    = require('react-dnd-html5-backend');
const dragDropContext = require('react-dnd').DragDropContext;
const flow            = require('lodash/flow');

const mixerTarget = {

  drop: function (props, monitor) {
    let item = monitor.getItem();
    let delta = monitor.getDifferenceFromInitialOffset();
    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);

    return {
      xPos: left,
      yPos: top
    }
  }
};

const collect = function(connect) {
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
    this.state = {
      synths: []
    };
    this.audioContext = new window.AudioContext();
  }

  componentDidMount() {
    this.state.synths = this.props.synths;
    this.forceUpdate();
  }

  onDoubleClick(event) {
    let newSynth = {
      left: event.clientX - 25,
      top: event.clientY - 25,
      key: Date.now()
    }
    this.state.synths.push(newSynth);
    this.forceUpdate();
  }

  render() {
    
    let connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="mixer" onDoubleClick={this.onDoubleClick.bind(this)}>
        {
          this.state.synths.map((item)=> {
            return <Synth audioContext={this.audioContext} key={item.key} xPos={item.left} yPos={item.top}/>
          })
        }
      </div>
    );
  }
}

module.exports = flow(
  dropTarget('looper', mixerTarget, collect),
  dragDropContext(HTML5Backend)
)(Mixer);
