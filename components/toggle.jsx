'use strict';

const React     = require('react');
const Draggable = require('./draggable');

class Toggle extends Draggable {
  constructor(props) {
    super(props);
    
    this.state = {
      position: -6,
      realValue: 0
    }

    this.values = props.values;
    this.shaftWidth = 12;
    this.selectedOption = 0;
    this.previousSelection = 0;

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
        boxShadow: '1px 1px 2px -1px #999',
        marginLeft: '15px'
      },

      track: {
        width: '100px',
        height: '8px',
        backgroundColor: '#E6DFD7',
        borderRadius: '20px',
        boxShadow: 'inset 0 0 2px 0px #888',
        marginLeft: '15px'
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

      if (this.props.onChange && this.previousSelection !== this.selectedOption) {
        console.log(this.selectedOption);
        this.props.onChange(this.values[this.selectedOption]);
        this.previousSelection = this.selectedOption;
      }
    }
  }

  calculateStops(value) {

    let halfWidth = this.shaftWidth / 2;

    let step = this.max / (this.values.length - 1);

    if (value <= this.min) {
      this.selectedOption = 0;
      return (this.min - halfWidth);
    }

    if (value >= this.max) {
      this.selectedOption = this.values.length - 1 ;
      return (this.max - halfWidth);
    }

    for (var i = 1; i <= this.values.length; i++) {
      let stop0 = (i - 1) * step;
      let stop1 = i * step;

      let leftThreshold = stop0 - (step / 2)
      leftThreshold = leftThreshold <= 0 ? 0 : leftThreshold;

      let rightThreshold = stop1 - (step / 2);

      if (value > leftThreshold && value <= rightThreshold) {
        value = stop0;
        this.selectedOption = i - 1;
        return value - halfWidth;
      }
    }

    return (this.max - halfWidth);
  }

  render() {

    let shaftStyle = {
      left: this.state.position + 'px',
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
