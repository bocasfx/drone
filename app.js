'use strict';

const React     = require('react');
const Component = React.Component;
const ReactDOM  = require('react-dom');
const Mixer     = require('./components/Mixer.jsx');

class LooperApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Mixer/>
    );
  }
}

ReactDOM.render(
  <LooperApp/>,
  document.getElementById('container')
);

module.exports = LooperApp;
