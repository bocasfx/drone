'use strict';

const audioContext = require('../audio-context');

class BiquadFilter {

  constructor({type='lowshelf', frequency=18000, gain=0}) {
    this.biquadFilter = audioContext.createBiquadFilter();
    this.type = type;
    this.frequency = frequency;
    this.gain = gain;
  }

  connect(destination) {
    this.biquadFilter.connect(destination);
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
