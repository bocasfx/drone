'use strict';

const React             = require('react');
const AudioDevice       = require('./audio-device.jsx');
const dragSource        = require('react-dnd').DragSource;
const LooperEditor      = require('./looper-editor.jsx');

var looperSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.xPos),
      top: parseInt(component.state.yPos)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result && result.suicide) {
      component.suicide();
      return;
    }
    
    component.state.xPos = result.xPos;
    component.state.yPos = result.yPos;
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class Looper extends AudioDevice {
  constructor(props) {
    super(props);

    this.state = {
      xPos: 0,
      yPos: 0,
      isPlaying: false,
      id: props.id,
      showEditor: false,
      showControls: false
    };
    console.log('looper');
  }

  get progressBarStyle() {
    return {
      position: 'absolute',
      left: '12.5px',
      top: '6px',
      padding: '0',
      margin: '0',
      'font-size': '2em'
    }
  }

  get progressBarIcon() {
    return '\u2707';
  }

  initialize() {

    super.initialize();

    this.bufferSource = this.audioContext.createBufferSource();

    this.bufferSource.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.bufferSource.start();
  }

  startProgressBarAnimation() {
    this.timeOut = setInterval(this.animateProgressBar.bind(this), 100);
  }

  animateProgressBar() {
    this.progress = this.progress === 1 ? 0 : this.progress;
    this.progress = this.progress + 1/this.duration;
    this.progressBar.animate(this.progress, ()=> {
      this.progressBar.animate(0);
    });
  }

  stopProgressBarAnimation() {
    clearTimeout(this.timeOut);
  }

  suicide() {
    super.suicide(this);
  }

  fadeIn() {
    
    this.startProgressBarAnimation();
    this.state.isPlaying = true;
    this.gain = 1;
  }

  fadeOut() {
    this.gain = 0;
    this.state.isPlaying = false;

  }

  bufferData(data) {
    this.audioContext.decodeAudioData(data, (buffer)=> {
      this.bufferSource.buffer = buffer;
      this.bufferSource.loop = true;
    });
  }

  render() {
    let isDragging = this.props.isDragging;
    let connectDragSource = this.props.connectDragSource;
    let xPos = this.state.xPos;
    let yPos = this.state.yPos;
    let opacity = isDragging ? 0 : 1;
    let style = {
      opacity: opacity,
      left: xPos + 'px',
      top: yPos + 'px'
    };

    let controlsDisplay = this.state.showControls ? 'block' : 'none';
    let controlsStyle = {
      display: controlsDisplay
    }

    let editorDisplay = this.state.showEditor ? 'block' : 'none';
    let editorStyle = {
      display: editorDisplay
    }

    return connectDragSource(
      <div className="synth" style={style} onMouseEnter={this.showControls.bind(this)} onMouseLeave={this.showControls.bind(this)}>
        <span className="progress" draggable='true' onDrag={this.onDrag.bind(this)} onClick={this.play.bind(this)}></span>
        <div className="cog" onClick={this.showEditor.bind(this)}>
          <div style={controlsStyle}>
            <i className="fa fa-cog"></i>
          </div>
        </div>
        <audio src="media/loop.mp3"/>
        <div style={editorStyle}>
          <LooperEditor looper={this}/>
        </div>
      </div>
    );
  }
}

module.exports = dragSource('looper', looperSource, collect)(Looper);
