'use strict';

const audioContext = require('../audio-context');
const ranges       = require('../config').ranges;

class BiquadFilter {

  constructor({type='lowshelf', frequency=ranges.biquadFilter.frequency.default, gain=ranges.biquadFilter.gain.default}) {
    this.biquadFilter = audioContext.createBiquadFilter();
    this.type = type;
    this.frequency = frequency;
    this.gain = gain;
  }

  connect(destination=audioContext.destination) {
    this.biquadFilter.connect(destination);
  }

  disconnect(destination=audioContext.destination) {
    this.biquadFilter.disconnect(destination)
  }

  get node() {
    return this.biquadFilter;
  }

  set type(type) {
    this.biquadFilter.type = type;
  }

  set frequency(frequency) {
    this.biquadFilter.frequency.value = frequency;
  }

  set gain(gain) {
    this.biquadFilter.gain.value = gain;
  }
}

module.exports = BiquadFilter;
