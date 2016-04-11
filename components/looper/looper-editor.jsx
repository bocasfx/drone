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

  loadFile(event) {
    var fileReader  = new FileReader;
    let self = this;
    fileReader.onload = function() {
      self.state.looper.bufferData(this.result);
    }
    fileReader.readAsArrayBuffer(event.target.files[0]);
  }

  render() {
    return (
      <div className="looper-editor">
        <div className="close-editor" onClick={this.close.bind(this)}>
          <i className="fa fa-close"></i>
        </div>
        <input className="open-file-input" type="file" onChange={this.loadFile.bind(this)}/>
      </div>
    )
  }
}

module.exports = LooperEditor;
