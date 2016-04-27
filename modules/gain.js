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

    this.gainNode.gain.setValueAtTime(zero, audioContext.currentTime);
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

    let deferred = q.defer();
    let time = audioContext.currentTime + this.attack / 1000.0;

    this.gainNode.gain.exponentialRampToValueAtTime(this.initialGain, time);

    setTimeout(()=> {
      this.level = this.initialGain;
      deferred.resolve();
    }, this.attack);

    return deferred.promise;
  }

  fadeOut(decay) {

    decay = decay || this.decay;

    let deferred = q.defer();
    let time = audioContext.currentTime + decay / 1000.0;

    this.gainNode.gain.setValueAtTime(this.level, audioContext.currentTime);

    this.gainNode.gain.exponentialRampToValueAtTime(zero, time);
    setTimeout(()=> {
      deferred.resolve();
    }, decay);

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
      .then(this.fadeOut.bind(this))
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
