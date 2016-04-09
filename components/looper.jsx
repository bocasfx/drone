'use strict';

const React             = require('react');
const Component         = React.Component;
const ReactDOM          = require('react-dom');
const ProgressBar       = require('progressbar.js');
const dragSource        = require('react-dnd').DragSource;
const PropTypes         = React.PropTypes;
const colors            = require('../config').synthColors;
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

class Looper extends Component {
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

  static get propTypes() {
    return {
      xPos: PropTypes.number.isRequired,
      yPos: PropTypes.number.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  componentDidMount() {

    let domNode = ReactDOM.findDOMNode(this);

    this.state.xPos = this.props.xPos;
    this.state.yPos = this.props.yPos;

    this.isPlaying = false;
    this.progress = 0;
    this.duration = 100;
    this.maxVol = 1;

    let colorIdx = Math.floor(Math.random() * colors.length);

    this.progressBar = new ProgressBar.Circle(domNode.children[0], {
      color: colors[colorIdx],
      fill: '#CAC234',
      strokeWidth: 10,
      fill: '#333',
      trailWidth: 5,
      trailColor: '#999',
      duration: 100,
      text: {
        value: '\u2707',
        style: {
          position: 'absolute',
          left: '12.5px',
          top: '6px',
          padding: '0',
          margin: '0',
          'font-size': '2em'
        }
      }
    });

    this.audioNode = domNode.children[2];

    this.initialize();

    this.timeOut = null;

    this.forceUpdate();
  }

  initialize() {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.audioContext = this.props.audioContext;
    this.bufferSource = this.audioContext.createBufferSource();

    let initialVol = 0;

    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = initialVol;

    this.waveShaper = this.audioContext.createWaveShaper();
    this.waveShaper.curve = this.makeWaveShaperCurve(0);

    this.biquadFilter = this.audioContext.createBiquadFilter();
    this.biquadFilter.type = 'lowshelf';
    this.biquadFilter.frequency.value = 18000;
    this.biquadFilter.gain.value = 20;
    this.biquadFilter.gain.detune = 0;

    this.bufferSource.connect(this.waveShaper);
    this.waveShaper.connect(this.biquadFilter);
    this.biquadFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.bufferSource.start();
  }

  makeWaveShaperCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50;
    let samples = 44100;
    let curve = new Float32Array(samples);
    let deg = Math.PI / 180;
    let i = 0;
    let x;
    for ( ; i < samples; ++i ) {
      x = i * 2 / samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }

  play(event) {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();

    if (this.state.isPlaying) {
      this.stopProgressBarAnimation();
      this.fadeOut();
    } else {
      this.fadeIn();
    }
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

  onDrag(event) {
  }

  suicide() {
    // TODO: Shutdown looper
    this.props.killLooper(this);
  }

  showControls() {
    this.state.showControls = !this.state.showControls;
    this.forceUpdate();
  }

  showEditor(event) {
    this.state.showEditor = true;
    this.forceUpdate();
  }

  hideEditor() {
    this.state.showEditor = false;
    this.forceUpdate();
  }

  fadeIn() {
    
    this.startProgressBarAnimation();
    this.state.isPlaying = true;
    this.gainNode.gain.value = 1;

    // let fadeInInterval = setInterval(function() {
    //   let originalVol = (this.windowHeight - this.state.yPos) / this.windowHeight * this.maxVol;
    //   let newVol = this.audioNode.volume + 0.01;
    //   if (newVol > originalVol) {
    //     this.audioNode.volume = originalVol; 
    //     clearInterval(fadeInInterval);
    //   }
    //   this.audioNode.volume = newVol;
    // }.bind(this), 10);
  }

  fadeOut() {
    this.gainNode.gain.value = 0;
    this.state.isPlaying = false;
    // let fadeOutInterval = setInterval(function() {
    //   let newVol = this.audioNode.volume - 0.01;
    //   if (newVol < 0.1) {
    //     this.audioNode.volume = 0;
    //     this.state.isPlaying = false;
    //     this.audioNode.pause();
    //     clearInterval(fadeOutInterval);
    //   }
    //   this.audioNode.volume = newVol;

    // }.bind(this), 10);
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
