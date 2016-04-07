'use strict';

const React     = require('react');
const Component = React.Component;

class SynthEditor extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="synth-editor">
        Synth Editor
      </div>
    )
  }
}

module.exports = SynthEditor;
