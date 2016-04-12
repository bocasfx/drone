'use strict';

const React = require('react');
const Component = React.Component;
const dragSource        = require('react-dnd').DragSource;
const PropTypes         = React.PropTypes;

var toolboxBtnSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.left),
      top: parseInt(component.state.top)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result.suicide) {
      component.suicide();
      return;
    }

    console.log(result);

    let iconClass = component.props.iconClass;

    let offset = iconClass === 'synth' ? 100 : 150;

    let device = {
      left: result.left + offset,
      top: result.top,
      key: Date.now()
    }
    component.state.addAudioDevice(iconClass, device);
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class ToolboxBtn extends Component {

  static get propTypes() {
    return {
      // left: PropTypes.number.isRequired,
      // top: PropTypes.number.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  constructor(props) {
    super(props);
    this.iconClass = props.iconClass;
    this.state = {
      left: 0,
      top: 0,
      addAudioDevice: props.addAudioDevice
    };
  }

  render() {
    let connectDragSource = this.props.connectDragSource;
    let className = `toolbox-btn ${this.iconClass}`;

    return connectDragSource(
      <div className={className}></div>
    );
  }
}

module.exports = dragSource('toolbox-btn', toolboxBtnSource, collect)(ToolboxBtn);
