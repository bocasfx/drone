'use strict';

const React      = require('react');
const Component  = React.Component;
const Synth      = require('./synth.jsx');
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
    connectDropTarget: connect.dropTarget(),
  };
}

class Mixer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      synths: []
    };
  }

  componentDidMount() {
    this.setState({
      synths: this.props.synths
    });
  }

  showEditor(device) {
    this.refs.editor.show(device);
  }

  createDevice(event) {

    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    let device = {
      left: event.clientX - 35,
      top: event.clientY - 90,
      key: Date.now(),
      type: 'synth'
    }

    this.props.addAudioDevice(device);
  }

  render() {
    
    let connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="mixer" onDoubleClick={this.createDevice.bind(this)}>
        <div className="axes"></div>
        {
          this.state.synths.map((item)=> {
            return <Synth type={item.type} id={item.key} key={item.key} left={item.left} top={item.top} killDevice={this.props.killDevice} showEditor={this.showEditor.bind(this)}/>
          })
        }
        <Editor ref="editor"/>
      </div>
    );
  }
}

module.exports = flow(
  dropTarget(['synth', 'toolbox-btn'], mixerTarget, collect)
)(Mixer);
