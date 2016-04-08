'use strict';

const React     = require('react');
const Component = React.Component;

class SynthEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideEditor: props.hideEditor
    }
  }

  close() {
    console.log('closing');
    this.state.hideEditor();
  }

  render() {
    return (
      <div className="synth-editor">
        <div className="close-synth-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>
        Synth Editor
      </div>
    )
  }
}

module.exports = SynthEditor;
