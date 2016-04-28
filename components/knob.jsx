'use strict';

const React     = require('react');
const Draggable = require('./draggable');
const zero      = 0.1;

class Knob extends Draggable {
  constructor(props) {
    super(props)

    let value = ((this.props.value - this.props.min) * (100 / (this.props.max - this.props.min)));
    let degree = this.valueToRadian(value);

    this.valueLabel = this.props.value;

    this.state = {
      value: value,
      degree: degree
    }

    this.knobColor = props.knobColor || 'orange';
    this.markerColor = props.markerColor || 'gray';
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  valueToRadian(value) {
    return Math.round((value / 100) * 270)
  }

  onMouseMove(event) {
    event.preventDefault();
    if (this.mouseDown) {
      let difference = Math.floor(this.mousePosition - event.clientY);
      let newValue = this.state.value + difference;
      if (newValue < this.min) {
        newValue = this.min;
      } else if (newValue > this.max) {
        newValue = this.max;
      }

      this.mousePosition = event.clientY;

      console.log(newValue);
      let normalizedValue = this.normalizeValue(newValue)
      this.valueLabel = normalizedValue;

      this.setState({
        value: newValue,
        degree: this.valueToRadian(newValue)
      });

      if (this.props.onChange) {
        this.props.onChange(normalizedValue);
      }
    }
  }

  normalizeValue(value) {
    let normalizedValue = this.props.min + ((value * (this.props.max - this.props.min)) / 100);
    return parseFloat(normalizedValue).toFixed(1);
  }

  render() {

    let spinnerStyle = {
      transform: `rotate(${-45 + this.state.degree}deg)`
    };

    return (
      <div className="knob-container">
        <div className="knob-label noselect">{this.props.label}</div>
        <div className={`knob knob-${this.knobColor}`} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
          <div className="knob-spinner" style={spinnerStyle}>
            <i className="fa fa-circle noselect"></i>
          </div>
        </div>
        <div className="knob-value-label noselect">{this.valueLabel}</div>
      </div>
    )
  }
}

module.exports = Knob;
