'use strict';

const React     = require('react');
const Draggable = require('./draggable');

class Toggle extends Draggable {
  constructor(props) {
    super(props);
    
    this.state = {
      position: 0,
      realValue: 0
    }

    this.values = props.values;
    this.shaftWidth = 12;

    this.initStyles();
  }

  initStyles() {

    this.styles = {
      shaft: {
        width: this.shaftWidth + 'px',
        height: this.shaftWidth + 'px',
        backgroundColor: '#C7C1BD',
        borderRadius: '50%',
        position: 'relative',
        top: '-11px',
        left: '0',
        border: '1px solid #ABABAB',
        boxShadow: '1px 1px 2px -1px #999'
      },

      track: {
        width: '100px',
        height: '8px',
        backgroundColor: '#E6DFD7',
        borderRadius: '20px',
        boxShadow: 'inset 0 0 2px 0px #888'
      }
    }
  }

  onMouseMove(event) {
    event.preventDefault();
    if (this.mouseDown) {
      let difference = Math.floor(event.clientX - this.mousePosition);
      let realValue = this.state.realValue + difference;
      let discreteValue = this.calculateStops(realValue);

      this.mousePosition = event.clientX;

      this.setState({
        position: discreteValue,
        realValue: realValue
      });

      if (this.props.onChange) {
        this.props.onChange(discreteValue / 100 * this.props.max);
      }
    }
  }

  calculateStops(value) {

    if (value < this.min) {
      value = this.min - 6;
    } else if (value > this.min && value <= 25) {
      value = this.min - 6;
    } else if (value > 25 && value <= 75) {
      value = 50 - 6;
    } else {
      value = 100 - 6;
    }

    return value;
  }

  render() {

    let shaftStyle = {
      left: this.state.position,
      position: 'relative'
    };

    return (
      <div>
        <div style={this.styles.track}></div>
        <div style={shaftStyle} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
          <div style={this.styles.shaft}></div>
        </div>
      </div>
    )
  }
}

module.exports = Toggle;
