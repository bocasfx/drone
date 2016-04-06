'use strict';

const React       = require('react');
const Component   = React.Component;
const ReactDOM    = require('react-dom');
const ProgressBar = require('progressbar.js');
const dragSource  = require('react-dnd').DragSource;
const PropTypes   = React.PropTypes;

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
    console.log(`Props: ${JSON.stringify(props)}`);
    component.state.xPos = result.xPos;
    component.state.yPos = result.yPos;
    console.log(`endDrag result: ${JSON.stringify(result)}`);
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    something: 'else'
  };
}

class Looper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      loop: true,
      progress: 0,
      audioNode: null,
      progressBar: null,
      xPos: 0,
      yPos: 0
    };
  }

  static get propTypes() {
    return {
      xPos: PropTypes.string.isRequired,
      yPos: PropTypes.string.isRequired,
      // Injected by React DnD:
      isDragging: PropTypes.bool.isRequired,
      connectDragSource: PropTypes.func.isRequired
    }
  }

  componentDidMount() {
    let domNode = ReactDOM.findDOMNode(this)
    let audioNode = domNode.children[0];

    this.state.xPos = this.props.xPos;
    this.state.yPos = this.props.yPos;

    audioNode.addEventListener('timeupdate', this.updateProgress.bind(this), false);
    this.state.audioNode = audioNode;

    let progressNode = domNode.children[1];

    this.state.progressBar = new ProgressBar.Circle(progressNode, {
      color: '#FF3692',
      strokeWidth: 5,
      fill: '#333',
      trailWidth: 1,
      trailColor: '#999'
    });
    this.forceUpdate();
  }

  handleClick() {

    let text = this.state.isPlaying ? 'play' : 'pause';
    this.state.progressBar.setText(`<i class="fa fa-${text}"></i>`);
    
    if (this.state.isPlaying) {
      this.state.audioNode.pause();
      this.state.isPlaying = false;
    } else {
      this.state.audioNode.loop = this.state.loop;
      this.state.audioNode.play();
      this.state.isPlaying = true;
    }
  }

  updateProgress() {
    let audioNode = this.state.audioNode;
    let value = 0;

    if (audioNode.currentTime > 0) {
      value = audioNode.currentTime / audioNode.duration;
    }

    this.state.progressBar.animate(value);
  }

  render() {
    let isDragging = this.props.isDragging;
    let connectDragSource = this.props.connectDragSource;
    let xPos = this.state.xPos;
    let yPos = this.state.yPos;
    let opacity = isDragging ? 0.5 : 1;
    let style = {
      opacity: opacity,
      left: xPos + 'px',
      top: yPos + 'px'
    };

    console.log(JSON.stringify(style));

    return connectDragSource(
      <div className="looper" style={style}>
        <audio src={this.props.src}>
          <div>Sorry :(</div>
        </audio>
        <span className="progress" onClick={this.handleClick.bind(this)}></span>
      </div>
    );
  }
}

module.exports = dragSource('looper', looperSource, collect)(Looper);
