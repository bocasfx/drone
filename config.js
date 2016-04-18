'use strict';

const HTML5Backend    = require('react-dnd-html5-backend').default;

const config = {
  synthColors: [
    '#001f3f',
    '#0074D9',
    '#7FDBFF',
    '#39CCCC',
    '#3D9970',
    '#2ECC40',
    '#01FF70',
    '#FFDC00',
    '#FF851B',
    '#FF4136',
    '#85144b',
    '#F012BE',
    '#B10DC9',
    '#AAAAAA',
    '#DDDDDD'
  ],

  backend: HTML5Backend,

  ranges: {
    waveshaper: {
      curve: {
        min: 0,
        max: 500,
        default: 0
      }
    },

    biquadFilter: {
      gain: {
        min: 0,
        max: 40,
        default: 0
      },
      frequency: {
        min: 20,
        max: 18000,
        default: 18000
      }
    }
  }
};

module.exports = config;
