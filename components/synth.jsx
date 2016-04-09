'use strict';

const React             = require('react');
const AudioDevice       = require('./audio-device.jsx');
const dragSource        = require('react-dnd').DragSource;
const SynthEditor       = require('./synth-editor.jsx');

var synthSource = {
  beginDrag: function (props, monitor, component) {
    let item = {
      left: parseInt(component.state.xPos),
      top: parseInt(component.state.yPos)
    };
    return item;
  },

  endDrag: function(props, monitor, component) {
    let result = monitor.getDropResult();
    if (result.suicide) {
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

class Synth extends AudioDevice {
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
  }

  get progressBarStyle() {
    return {
      position: 'absolute',
      left: '16px',
      top: '1px',
      padding: '0',
      margin: '0',
      'font-size': '2em'
    }
  }

  get progressBarIcon() {
    return '\u223F';
  }

  initialize() {

    super.initialize();

    this.maxFreq = 100;
    
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'triangle';
    this.oscillator.frequency.value = 0;

    this.oscillator.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);

    this.oscillatorFrequency = this.normalizeFrequency(this.state.xPos);
    this.gain = this.normalizeGain(this.state.yPos);

    this.oscillator.start();
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

  set oscillatorFrequency(level) {
    this.oscillator.frequency.value = level;
  }

  normalizeFrequency(value) {
    return value / this.windowWidth * this.maxFreq;
  }

  onDrag(event) {
    this.oscillatorFrequency = this.normalizeFrequency(event.clientX);
    this.gain = this.normalizeGain(event.clientY);
  }

  setWaveToSine() {
    console.log(this.state.id);
    this.oscillator.type = 'sine';
  }

  setWaveToSquare() {
    console.log(this.state.id);
    this.oscillator.type = 'square';
  }

  setWaveToSaw() {
    console.log(this.state.id);
    this.oscillator.type = 'triangle';
  }

  fadeIn() {

    this.startProgressBarAnimation();
    this.state.isPlaying = true;
    this.gainNode.connect(this.audioContext.destination);
    this.gain = 0;

    let fadeInInterval = setInterval(function() {
      let originalGain = (this.windowHeight - this.state.yPos) / this.windowHeight * this.maxVol;
      if (this.gain > originalGain) {
        this.gain = originalGain; 
        clearInterval(fadeInInterval);
      }
      this.gain = this.gain + 0.01;

    }.bind(this), 10);
  }

  fadeOut() {
    let fadeOutInterval = setInterval(function() {
      if (this.gain < 0.0001) {
        this.gain = 0;
        this.state.isPlaying = false;
        this.gainNode.disconnect(this.audioContext.destination);
        clearInterval(fadeOutInterval);
      }
      this.gain = this.gain - 0.01;

    }.bind(this), 10);
  }

  suicide() {
    this.oscillator.stop();

    this.gainNode.disconnect();
    this.biquadFilter.disconnect();
    this.waveShaper.disconnect();
    this.oscillator.disconnect();

    this.gainNode = null;
    this.biquadFilter = null;
    this.waveShaper = null;
    this.oscillator = null;

    super.suicide(this);
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
        <div style={editorStyle}>
          <SynthEditor synth={this}/>
        </div>
      </div>
    );
  }
}

module.exports = dragSource('synth', synthSource, collect)(Synth);
