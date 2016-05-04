'use strict';

const React     = require('react');
const Component = React.Component;
const colors    = require('../config').synthColors;
const _         = require('lodash');

class Toolbox extends Component {

  constructor(props) {
    super(props);

    let color = _.sample(colors);
    let backgroundColor = null;
    while ((backgroundColor = _.sample(colors)) === color) {}
    let borderBottom = '2px solid ' + color;

    this.style = {
      backgroundColor: backgroundColor,
      color: color,
      borderBottom: borderBottom
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={this.style} className="toolbox">
        <div className="logo noselect">DRONE</div>
      </div>
    );
  }
}

module.exports = Toolbox;
