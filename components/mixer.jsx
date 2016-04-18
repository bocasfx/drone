'use strict';

const React      = require('react');
const Component  = React.Component;
const Synth      = require('./synth/synth.jsx');
const Looper     = require('./looper/looper.jsx');
const dropTarget = require('react-dnd').DropTarget;
const flow       = require('lodash/flow');
const Editor     = require('./editor.jsx');

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
      left: left,
      top: top
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
  }

  componentDidMount() {
    this.state.synths = this.props.synths;
    this.state.loopers = this.props.loopers;
    this.forceUpdate();
  }

  showEditor(device) {
    this.refs.editor.show(device);
  }

  render() {
    
    let connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="mixer">
        <div className="axes"></div>
        {
          this.state.synths.map((item)=> {
            return <Synth type={item.type} id={item.key} key={item.key} left={item.left} top={item.top} killDevice={this.props.killDevice} showEditor={this.showEditor.bind(this)}/>
          })
        } {
          this.state.loopers.map((item)=> {
            return <Looper type={item.type} id={item.key} key={item.key} left={item.left} top={item.top} killDevice={this.props.killDevice} showEditor={this.showEditor.bind(this)}/>
          })
        }
        <Editor ref="editor"/>
      </div>
    );
  }
}

module.exports = flow(
  dropTarget(['synth', 'looper', 'toolbox-btn'], mixerTarget, collect)
)(Mixer);
