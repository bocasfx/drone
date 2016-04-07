'use strict';

const React = require('react');
const Component = React.Component;
const ReactContextMenu = require('react-contextmenu');
const RContextMenu = ReactContextMenu.ContextMenu;
const RMenuItem = ReactContextMenu.MenuItem;

class ContextMenu extends Component {

  constructor(props) {
    super(props)
  }

  handleClick(e) {
    console.log(e.target);
  }

  render() {

    let synth = this.props.synth;

    return (
      <RContextMenu identifier="some_unique_identifier" currentItem={this.currentItem}>
        <RMenuItem onClick={synth.setWaveToSine.bind(synth)}>Sine</RMenuItem>
        <RMenuItem onClick={synth.setWaveToSquare.bind(synth)}>Square</RMenuItem>
        <RMenuItem onClick={synth.setWaveToSaw.bind(synth)}>Saw</RMenuItem>
      </RContextMenu>
    );
  }
}

module.exports = ContextMenu;
