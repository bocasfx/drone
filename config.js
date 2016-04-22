'use strict';

const HTML5Backend    = require('react-dnd-html5-backend').default;

const config = {
  synthColors: {
    navy:    '#001f3f',
    blue:    '#0074D9',
    aqua:    '#7FDBFF',
    teal:    '#39CCCC',
    olive:   '#3D9970',
    green:   '#2ECC40',
    lime:    '#01FF70',
    yellow:  '#FFDC00',
    orange:  '#FF851B',
    red:     '#FF4136',
    maroon:  '#85144b',
    fuchsia: '#F012BE',
    purple:  '#B10DC9',
    black:   '#111111',
    gray:    '#AAAAAA',
    silver:  '#DDDDDD' 
  },

  backend: HTML5Backend,

  controls: {

    panner: {
      label: 'Panner',
      settings: {
        panningModel: {
          label: 'Panning Model',
          type: 'option',
          options: ['HRTF'],
          default: 'HRTF'
        },
        distanceModel: {
          label: 'Distance Model',
          type: 'option',
          options: ['inverse'],
          default: 'inverse'
        },
        refDistance: {
          label: 'Reference Distance',
          type: 'knob',
          min: 0,
          max: 20000,
          default: 10
        },
        maxDistance: {
          label: 'Max Distance',
          type: 'knob',
          min: 0,
          max: window.innerWidth/2,
          default: window.innerWidth/4
        },
        rolloffFactor: {
          label: 'Rolloff Factor',
          type: 'knob',
          min: 1,
          max: 10,
          default: 1
        },
        coneInnerAngle: {
          label: 'Cone Inner Angle',
          type: 'knob',
          min: 0,
          max: 360,
          default: 360
        },
        coneOuterAngle: {
          label: 'Cone Outer Angle',
          type: 'knob',
          min: 0,
          max: 360,
          default: 0
        },
        coneOuterGain: {
          label: 'Cone Outer Gain',
          type: 'knob',
          min: 0,
          max: 20,
          default: 0
        },
        position: {
          label: 'Position',
          type: 'knob',
          min: 0,
          max: window.innerWidth,
          default: window.innerWidth/2
        }
      }
    },
    
    envelope: {
      label: 'Amplitude Envelope',
      settings: {
        attack: {
          label: 'Attack',
          type: 'knob',
          min: 0,
          max: 500,
          default: 100
        },
        decay: {
          label: 'Decay',
          type: 'knob',
          min: 0,
          max: 500,
          default: 100
        },
        sustain: {
          label: 'Sustain',
          type: 'knob',
          min: 0,
          max: 10000,
          default: 5000
        },
        release: {
          label: 'Release',
          type: 'knob',
          min: 0,
          max: 10000,
          default: 100
        }
      }
    },

    waveshaper: {
      label: 'Waveshaper',
      settings: {
        curve: {
          label: 'Curve',
          type: 'knob',
          min: 0,
          max: 500,
          default: 0
        }
      }
    },

    biquadFilter: {
      label: 'Biquad Filter',
      settings: {
        type: {
          label: 'Type',
          type: 'option',
          options: ['lowshelf'],
          default: 'lowshelf'
        },
        gain: {
          label: 'Gain',
          type: 'knob',
          min: 0,
          max: 40,
          default: 0
        },
        frequency: {
          label: 'Frequency',
          type: 'knob',
          min: 20,
          max: 18000,
          default: 18000
        }
      }
    }
  }
};

module.exports = config;
