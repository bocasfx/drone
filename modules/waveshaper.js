'use strict';

const audioContext = require('../audio-context');
const settings     = require('../config').controls.waveshaper.settings;

class Waveshaper {

  constructor({curve=settings.curve.default}) {
    this.waveshaperNode = audioContext.createWaveShaper();
    this.curve = curve;
    this.curveLevel = 0;
  }

  set curve(curve) {
    this.curveLevel = curve;
    this.waveshaperNode.curve = this.makeWaveShaperCurve(curve);
  }

  get curve() {
    return this.curveLevel;
  }

  connect(destination=audioContext.destination) {
    this.waveshaperNode.connect(destination);
  }

  disconnect(destination=audioContext.destination) {
    this.waveshaperNode.disconnect(destination);
  }

  get node() {
    return this.waveshaperNode;
  }

  makeWaveShaperCurve(level) {
    let samples = 44100;
    let curve = new Float32Array(samples);
    let deg = Math.PI / 180;
    let x = null;

    for (var i=0 ; i < samples; i++ ) {
      x = i * 2 / samples - 1;
      curve[i] = ( 3 + level ) * x * 20 * deg / ( Math.PI + level * Math.abs(x) );
    }

    return curve;
  }
}

module.exports = Waveshaper;
