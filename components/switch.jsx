'use strict';

const React     = require('react');
const Knob      = require('./knob.jsx');
const zero      = 0.1;

class Switch extends Knob {
  constructor(props) {
    super(props)
    this.values = props.values;
    this.labels = props.labels;
    this.selectedOption = props.value;
    this.previousSelection = 0;
    this.valueLabel = this.labels[this.selectedOption];
  }

  componentDidMount() {
    let step = this.max / (this.values.length - 1);
    let value = step * this.selectedOption;
    let discreteValue = this.calculateStops(value);
    this.setState({
      value: value,
      position: discreteValue,
      degree: this.valueToRadian(discreteValue)
    })
  }

  componentWillReceiveProps() {
  }

  onMouseMove(event) {
    event.preventDefault();
    if (this.mouseDown) {
      let difference = Math.floor(this.mousePosition - event.clientY);
      let value = this.state.value + difference;
      let discreteValue = this.calculateStops(value);

      this.mousePosition = event.clientY;

      this.setState({
        position: discreteValue,
        value: value,
        degree: this.valueToRadian(discreteValue)
      });

      this.valueLabel = this.labels[this.selectedOption];

      if (this.props.onChange && this.previousSelection !== this.selectedOption) {
        this.props.onChange(this.values[this.selectedOption]);
        this.previousSelection = this.selectedOption;
      }
    }
  }

  calculateStops(value) {

    let step = this.max / (this.values.length - 1);

    if (value <= this.min) {
      this.selectedOption = 0;
      return this.min;
    }

    if (value >= this.max) {
      this.selectedOption = this.values.length - 1 ;
      return this.max;
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
        return value;
      }
    }

    return (this.max);
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

module.exports = Switch;
