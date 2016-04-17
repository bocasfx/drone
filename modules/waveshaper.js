'use strict';

const audioContext = require('../audio-context');

class Waveshaper {

  constructor({curve=0}) {
    this.waveshaperNode = audioContext.createWaveShaper();
    this.curve = curve;
  }

  set curve(curve) {
    this.waveshaperNode.curve = this.makeWaveShaperCurve(curve);
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
