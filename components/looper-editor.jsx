'use strict';

require('rc-slider/assets/index.css');

const React     = require('react');
const Component = React.Component;
const Slider    = require('rc-slider');

class LooperEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      looper: props.looper
    }
  }

  close() {
    console.log('closing');
    this.state.looper.hideEditor();
  }

  setFileSource(event) {
    console.log(event.target.files);
  }

  render() {
    return (
      <div className="looper-editor">
        <div className="close-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>
        <input className="open-file-input" type="file" onChange={this.setFileSource.bind(this)}/>
      </div>
    )
  }
}

module.exports = LooperEditor;
