'use strict';

const audioContext = require('../audio-context');
const settings     = require('../config').controls.panner.settings;

class Panner {

  constructor(
    panningModel     = 'HRTF',
    distanceModel    = 'inverse',
    refDistance      = settings.refDistance.default,
    maxDistance      = settings.maxDistance.default,
    rolloffFactor    = settings.rolloffFactor.default,
    coneInnerAngle   = settings.coneInnerAngle.default,
    coneOuterAngle   = settings.coneOuterAngle.default,
    coneOuterGain    = settings.coneOuterGain.default,
    pannerPosition   = [window.innerWidth/2,window.innerHeight,0],
    listenerPosition = [window.innerWidth/2,window.innerHeight,5]
  ) {
    
    this.pannerNode = audioContext.createPanner();
    this.panningModel = 'HRTF';
    this.distanceModel = 'inverse';
    this.refDistance = 10;
    this.maxDistance = 10000;
    this.rolloffFactor = 1;
    this.coneInnerAngle = 360;
    this.coneOuterAngle = 0;
    this.coneOuterGain = 0;
    this.pannerNode.setOrientation(1,0,0);
    let [px, py, pz] = pannerPosition;
    this.pannerNode.setPosition(px, py, pz);

    this.listener = audioContext.listener;
    this.listener.setOrientation(0,0,-1,0,1,0);
    let [lx, ly, lz] = listenerPosition;
    this.listener.setPosition(lx, ly, lz);
  }

  set panningModel(level) {
    this.pannerNode.panningModel = level;
  }

  set distanceModel(level) {
    this.pannerNode.distanceModel = level;
  }

  set refDistance(level) {
    this.pannerNode.refDistance = level;
  }

  set maxDistance(level) {
    this.pannerNode.maxDistance = level;
  }

  set rolloffFactor(level) {
    this.pannerNode.rolloffFactor = level;
  }

  set coneInnerAngle(level) {
    this.pannerNode.coneInnerAngle = level;
  }

  set coneOuterAngle(level) {
    this.pannerNode.coneOuterAngle = level;
  }

  set coneOuterGain(level) {
    this.pannerNode.coneOuterGain = level;
  }

  get node() {
    return this.pannerNode;
  }

  connect(destination=audioContext.destination) {
    this.pannerNode.connect(destination);
  }

  disconnect(destination=audioContext.destination) {
    this.pannerNode.disconnect(destination);
  }

}

module.exports = Panner;
