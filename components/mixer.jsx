'use strict';

const React           = require('react');
const ReactDOM        = require('react-dom');
const Component       = React.Component;
const Synth           = require('./synth.jsx');
const Looper          = require('./looper.jsx');
const dropTarget      = require('react-dnd').DropTarget;
const HTML5Backend    = require('react-dnd-html5-backend');
const dragDropContext = require('react-dnd').DragDropContext;
const flow            = require('lodash/flow');
const Trash           = require('./trash.jsx');
const _               = require('lodash');

const mixerTarget = {

  drop: function (props, monitor) {
    if (monitor.didDrop()) {
      return;
    }

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
      synths: [],
      loopers: []
    };
    this.audioContext = new window.AudioContext();
  }

  componentDidMount() {
    this.state.synths = this.props.synths;
    this.state.loopers = this.props.loopers;
    this.forceUpdate();
  }

  onDoubleClick(event) {
    let newSynth = {
      left: event.clientX - 25,
      top: event.clientY - 25,
      key: Date.now()
    }
    this.state.synths.push(newSynth);

    // let newLooper = {
    //   left: event.clientX - 25,
    //   top: event.clientY - 25,
    //   key: Date.now()
    // }
    // this.state.loopers.push(newLooper);

    this.forceUpdate();
  }

  killSynth(synth) {
    console.log(this.state.synths.length);
    this.state.synths = _.remove(this.state.synths, function(item) {
      return item.key !== synth.state.id;
    })
    console.log(this.state.synths);
    this.forceUpdate();
  }

  killLooper(looper) {
    console.log(this.state.loopers.length);
    this.state.loopers = _.remove(this.state.loopers, function(item) {
      return item.key !== looper.state.id;
    })
    console.log(this.state.loopers);
    this.forceUpdate();
  }

  render() {
    
    let connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="mixer" onDoubleClick={this.onDoubleClick.bind(this)}>
        {
          this.state.synths.map((item)=> {
            return <Synth audioContext={this.audioContext} id={item.key} key={item.key} xPos={item.left} yPos={item.top} killSynth={this.killSynth.bind(this)}/>
          })
        } {
          this.state.loopers.map((item)=> {
            return <Looper id={item.key} key={item.key} xPos={item.left} yPos={item.top} killLooper={this.killLooper.bind(this)}/>
          })
        }
        <Trash/>
      </div>
    );
  }
}

module.exports = flow(
  dropTarget(['synth', 'looper'], mixerTarget, collect),
  dragDropContext(HTML5Backend)
)(Mixer);
