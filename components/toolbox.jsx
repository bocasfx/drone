'use strict';

const React           = require('react');
const Component       = React.Component;

class Toolbox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      class: 'toolbox',
      showButtons: false
    };
  }

  render() {
    return (
      <div className={this.state.class}>
        <div className="logo noselect">DRONE</div>
      </div>
    );
  }
}

module.exports = Toolbox;
