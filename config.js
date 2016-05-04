'use strict';

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

  controls: {

    panner: {
      label: 'Panner',
      settings: {
        panningModel: {
          label: 'Panning Model',
          options: ['HRTF'],
          default: 'HRTF'
        },
        distanceModel: {
          label: 'Distance Model',
          options: ['inverse'],
          default: 'inverse'
        },
        refDistance: {
          label: 'Reference Distance',
          min: 0,
          max: 10,
          default: 10
        },
        maxDistance: {
          label: 'Max Distance',
          min: 0,
          max: window.innerWidth/2,
          default: window.innerWidth/4
        },
        rolloffFactor: {
          label: 'Rolloff Factor',
          min: 1,
          max: 10,
          default: 1
        },
        coneInnerAngle: {
          label: 'Cone Inner Angle',
          min: 0,
          max: 360,
          default: 360
        },
        coneOuterAngle: {
          label: 'Cone Outer Angle',
          min: 0,
          max: 360,
          default: 0
        },
        coneOuterGain: {
          label: 'Cone Outer Gain',
          min: 0,
          max: 20,
          default: 0
        },
        position: {
          label: 'Pan',
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
          min: 0,
          max: 10,
          default: 2
        },
        decay: {
          label: 'Decay',
          min: 0,
          max: 10,
          default: 2
        },
        sustain: {
          label: 'Sustain',
          min: 0,
          max: 10,
          default: 2
        },
        release: {
          label: 'Release',
          min: 0,
          max: 10,
          default: 2
        }
      }
    },

    waveshaper: {
      label: 'Waveshaper',
      settings: {
        curve: {
          label: 'Curve',
          min: 0,
          max: 50,
          default: 0
        }
      }
    },

    biquadFilter: {
      label: 'Biquad Filter',
      settings: {
        type: {
          label: 'Type',
          options: ['lowshelf'],
          default: 'lowshelf'
        },
        gain: {
          label: 'Gain',
          min: -20,
          max: 20,
          default: 0
        },
        frequency: {
          label: 'Frequency',
          min: 20,
          max: 20000,
          default: 20000
        }
      }
    },

    oscillator: {
      label: 'Oscillator',
      settings: {
        wave: {
          label: 'Wave',
          labels: ['Sine', 'Triangle', 'Square', 'Sawtooth'],
          default: 0,
          values: ['sine', 'triangle', 'square', 'sawtooth']
        },
        toggleEnvelope: {
          label: 'Envelope',
          labels: ['Off', 'On'],
          default: 1,
          values: [false, true]
        }
      }
    }
  }
};

module.exports = config;
