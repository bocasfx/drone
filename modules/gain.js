'use strict';

const q            = require('q');
const audioContext = require('../audio-context');

class Gain {

  constructor({attack=1, sustain=500, decay=100, release=5000, level=0}) {
    this.attack = attack;
    this.sustain = sustain;
    this.decay = decay;
    this.release = release;
    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = level;
    this.initialGain = level;
  }

  get level() {
    return this.gainNode.gain.value || 0;
  }

  set level(level) {
    this.gainNode.gain.value = level;
  }

  get node() {
    return this.gainNode;
  }

  connect(destination=audioContext.destination) {
    this.gainNode.connect(destination);
  }

  disconnect(destination=audioContext.destination) {
    this.gainNode.disconnect(destination);
  }

  fadeIn() {

    // Get the current date to calculate time drifting.
    // Especially needed for longer fade-ins.
    let start = new Date().getTime();
    let time = 0;

    let deferred = q.defer(); 
    let initialGain = this.initialGain || 1;

    let step = initialGain / 50;

    let fadeInStep = ()=> {

      if (this.level > initialGain) {
        this.level = initialGain; 
        deferred.resolve();
      } else {
        time += this.attack;
        this.level = this.level + step;
        let diff = new Date().getTime() - start - time;
        setTimeout(fadeInStep.bind(this), this.attack - diff);
      }
    }

    setTimeout(fadeInStep.bind(this), this.attack)
    return deferred.promise;
  }

  fadeOut(decay) {

    let start = new Date().getTime();
    let time = 0;

    let deferred = q.defer();
    let step = this.level / 50;

    let fadeOutStep = ()=> {
      if (this.level < 0.0001) {
        this.level = 0;
        deferred.resolve();
      } else {
        time += decay;
        this.level = this.level - step;
        let diff = new Date().getTime() - start - time;
        setTimeout(fadeOutStep, decay - diff);
      }
    }

    setTimeout(fadeOutStep, decay);
    return deferred.promise;
  }

  on() {
    this.connect();
    this.fadeIn();
  }

  off() {
    this.fadeOut(10).then(()=> {
      this.disconnect();
    })
  }

  startAutomation() {
    this.connect();
    this.noteOn();
  }

  endAutomation() {
    clearTimeout(this.noteOffTimeout);
    clearTimeout(this.noteOnTimeout);
    this.fadeOut(10).then(()=> {
      this.disconnect();
    });
  }

  noteOn() {
    this.fadeIn()
      .then(this.scheduleNoteOff.bind(this))
      .then(this.fadeOut.bind(this, this.decay))
      .then(this.scheduleNoteOn.bind(this));
  }

  scheduleNoteOff() {
    let deferred = q.defer();
    this.noteOffTimeout = setTimeout(()=> {
      deferred.resolve();
    }, this.sustain);
    return deferred.promise;
  }

  scheduleNoteOn() {
    let deferred = q.defer();
    this.noteOnTimeout = setTimeout(()=> {
      this.noteOn();
      deferred.resolve();
    }, this.release);
    return deferred.promise;
  }
}

module.exports = Gain;
