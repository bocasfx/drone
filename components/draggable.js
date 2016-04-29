'use strict';

const React     = require('react');

class Draggable extends React.Component {
  constructor(props) {
    super(props);

    this.orientation = props.orientation || 'vertical';
    this.min = 0;
    this.max = 100;
    this.mouseDown = false;
    this.mousePosition = 0;
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mousePosition = this.orientation === 'vertical' ? event.clientY : event.clientX;
    this.mouseDown = true;
    window.onmousemove = this.onMouseMove.bind(this);
    window.onmouseup = this.onMouseUp.bind(this);
  }

  onMouseUp(event) {
    event.preventDefault();
    this.mouseDown = false;
    window.onmousemove = null;
    window.onmouseup = null;
  }
}

module.exports = Draggable;
