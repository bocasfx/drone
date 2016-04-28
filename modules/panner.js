'use strict';

const audioContext = require('../audio-context');
const settings     = require('../config').controls.panner.settings;

class Panner {

  constructor({
    panningModel     = settings.panningModel.default,
    distanceModel    = settings.distanceModel.default,
    refDistance      = settings.refDistance.default,
    maxDistance      = settings.maxDistance.default,
    rolloffFactor    = settings.rolloffFactor.default,
    coneInnerAngle   = settings.coneInnerAngle.default,
    coneOuterAngle   = settings.coneOuterAngle.default,
    coneOuterGain    = settings.coneOuterGain.default,
    pannerPosition   = [window.innerWidth/2, window.innerHeight/2 , 0],
    listenerPosition = [window.innerWidth/2, window.innerHeight/2 , 50]
  }) {
    
    this.pannerNode = audioContext.createPanner();
    this.panningModel = panningModel;
    this.distanceModel = distanceModel;
    this.refDistance = refDistance;
    this.maxDistance = maxDistance;
    this.rolloffFactor = rolloffFactor;
    this.coneInnerAngle = coneInnerAngle;
    this.coneOuterAngle = coneOuterAngle;
    this.coneOuterGain = coneOuterGain;
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

  set position(xPos) {
    this.pannerNode.setPosition(xPos, window.innerHeight/2, 0);
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
