'use strict';

const React     = require('react');
const ReactDOM  = require('react-dom');

class Knob extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value,
      degree: this.valueToRadian(this.props.value)
    }

    this.min = 0;
    this.max = 100;
    this.mouseDown = false;
    this.mousePosition = 0;
  }

  componentDidMount() {
    this.input = ReactDOM.findDOMNode(this.refs.number)
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
    console.log('up');
    this.mouseDown = false;
    window.onmousemove = null;
    window.onmouseup = null;
  }

  onMouseMove(event) {
    event.preventDefault();
    if (this.mouseDown) {
      let difference = Math.floor((this.mousePosition - event.clientY) / 50);
      let newValue = this.state.value + difference;
      if (newValue < this.min) {
        newValue = this.min;
        this.mousePosition = event.clientY;
      } else if (newValue > this.max) {
        newValue = this.max;
        this.mousePosition = event.clientY;
      }
      this.setState({
        value: newValue,
        degree: this.valueToRadian(newValue)
      });

      if (this.props.onChange) {
        this.props.onChange(newValue);
      }
    }
  }

  render() {
    return (
      <div>
        <div className="Knob" onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
          <div className="Knob-spinner" style={{transform: `rotate(${-45 + this.state.degree}deg)`}}><i className="fa fa-circle"></i></div>
        </div>
        <div>{this.props.label}</div>
      </div>
    )
  }
}

module.exports = Knob;
