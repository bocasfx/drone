'use strict';

const q            = require('q');
const audioContext = require('../audio-context');
const settings     = require('../config').controls.envelope.settings;
const zero          = 0.0001;

class Gain {

  constructor({
    attack  = settings.attack.default,
    sustain = settings.sustain.default,
    decay   = settings.decay.default,
    release = settings.release.default,
    level   = zero
  }) {

    this.attack = attack;
    this.sustain = sustain;
    this.decay = decay;
    this.release = release;
    this.gainNode = audioContext.createGain();
    this.gainNode.gain.value = zero;
    this.initialGain = level;

    this.fadeInTimeout = null;
    this.fadeOutTimeout = null;
    this.noteOffTimeout = null;
    this.noteOnTimeout = null;

    this.gainNode.gain.setValueAtTime(zero, audioContext.currentTime);
  }

  get level() {
    return this.gainNode.gain.value || 0;
  }

  set level(level) {
    this.gainNode.gain.setValueAtTime(level, audioContext.currentTime);
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

    let deferred = q.defer();
    let time = audioContext.currentTime + parseFloat(this.attack);

    this.gainNode.gain.exponentialRampToValueAtTime(this.initialGain, time);

    clearTimeout(this.fadeInTimeout);
    this.fadeInTimeout = setTimeout(()=> {
      this.level = this.initialGain;
      deferred.resolve();
    }, this.attack * 1000);

    return deferred.promise;
  }

  fadeOut(decay) {

    decay = decay || this.decay;

    let deferred = q.defer();
    let time = audioContext.currentTime + parseFloat(decay);

    this.gainNode.gain.setValueAtTime(this.level, audioContext.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(zero, time);

    clearTimeout(this.fadeOutTimeout);
    this.fadeOutTimeout = setTimeout(()=> {
      deferred.resolve();
    }, decay * 1000);

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
    this.clearTimeouts();
    this.fadeOut(10).then(()=> {
      this.disconnect();
    });
  }

  noteOn() {
    this.fadeIn()
      .then(this.scheduleNoteOff.bind(this))
      .then(this.fadeOut.bind(this))
      .then(this.scheduleNoteOn.bind(this));
  }

  scheduleNoteOff() {
    let deferred = q.defer();
    this.noteOffTimeout = setTimeout(()=> {
      deferred.resolve();
    }, this.sustain * 1000);
    return deferred.promise;
  }

  scheduleNoteOn() {
    let deferred = q.defer();
    this.noteOnTimeout = setTimeout(()=> {
      this.noteOn();
      deferred.resolve();
    }, this.release * 1000);
    return deferred.promise;
  }

  clearTimeouts() {
    clearTimeout(this.fadeInTimeout);
    clearTimeout(this.fadeOutTimeout);
    clearTimeout(this.noteOffTimeout);
    clearTimeout(this.noteOnTimeout);
  }
}

module.exports = Gain;
