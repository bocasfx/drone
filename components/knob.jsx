'use strict';

const React     = require('react');

class Knob extends React.Component {
  constructor(props) {
    super(props)

    let value = this.props.value / this.props.max * 100;
    let degree = this.valueToRadian(value);

    this.state = {
      value: value,
      degree: degree
    }

    this.min = 0;
    this.max = 100;
    this.mouseDown = false;
    this.mousePosition = 0;
    this.knobColor = props.knobColor || 'orange';
    this.markerColor = props.markerColor || 'gray';
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value
  }

  valueToRadian(value) {
    return Math.round((value / 100) * 270)
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mousePosition = event.clientY;
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

      this.setState({
        value: newValue,
        degree: this.valueToRadian(newValue)
      });

      if (this.props.onChange) {
        this.props.onChange(newValue / 100 * this.props.max);
      }
    }
  }

  render() {

    let spinnerStyle = {
      transform: `rotate(${-45 + this.state.degree}deg)`
    };

    return (
      <div className="knob-container">
        <div className={`knob knob-${this.knobColor}`} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
          <div className="knob-spinner" style={spinnerStyle}>
            <i className="fa fa-circle"></i>
          </div>
        </div>
        <div>{this.props.label}</div>
      </div>
    )
  }
}

module.exports = Knob;
