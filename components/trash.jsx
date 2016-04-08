'use strict';

const React      = require('react');
const Component  = React.Component;
const dropTarget = require('react-dnd').DropTarget;

const trashTarget = {

  drop: function () {
    return {
      suicide: true
    }
  }
};

const collect = function(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

class Trash extends Component {

  render() {

    let connectDropTarget = this.props.connectDropTarget;

    return connectDropTarget(
      <div className="trash"><i className="fa fa-trash"></i></div>
    );
  }
}

module.exports = dropTarget('synth', trashTarget, collect)(Trash);
