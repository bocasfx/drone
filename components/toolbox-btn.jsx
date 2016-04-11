'use strict';

const React = require('react');
const Component = React.Component;
const dragSource        = require('react-dnd').DragSource;
const PropTypes         = React.PropTypes;

var toolboxBtnSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.xPos),
      top: parseInt(component.state.yPos)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result.suicide) {
      component.suicide();
      return;
    }
    
    console.log(component.props.iconClass);
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
      // xPos: PropTypes.number.isRequired,
      // yPos: PropTypes.number.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  constructor(props) {
    super(props);
    this.iconClass = props.iconClass;
    this.state = {
      xPos: 0,
      yPos: 0
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
