'use strict';

import AudioNode from './AudioNode';
import BiquadFilterNodeDSP from './dsp/BiquadFilterNode';
import { defaults } from '../utils';

import { MAX } from '../constants/ChannelCountMode';

import { CONTROL_RATE } from '../constants/AudioParamRate';

import {
  ALLPASS,
  BANDPASS,
  HIGHPASS,
  HIGHSHELF,
  LOWPASS,
  LOWSHELF,
  NOTCH,
  PEAKING,
} from '../constants/BiquadFilterType';

const allowedBiquadFilterTypes = [
  LOWPASS,
  HIGHPASS,
  BANDPASS,
  LOWSHELF,
  HIGHSHELF,
  PEAKING,
  NOTCH,
  ALLPASS,
];

const DEFAULT_TYPE = LOWPASS;
const DEFAULT_FREQUENCY = 350;
const DEFAULT_DETUNE = 0;
const DEFAULT_Q = 1;
const DEFAULT_GAIN = 0;

class BiquadFilterNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {string}       opts.type
   * @param {number}       opts.frequency
   * @param {number}       opts.detune
   * @param {number}       opts.Q
   * @param {number}       opts.gain
   */
  constructor(context, opts = {}) {
    const type = defaults(opts.type, DEFAULT_TYPE);
    const frequency = defaults(opts.frequency, DEFAULT_FREQUENCY);
    const detune = defaults(opts.detune, DEFAULT_DETUNE);
    const Q = defaults(opts.Q, DEFAULT_Q);
    const gain = defaults(opts.gain, DEFAULT_GAIN);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._type = type;
    this._frequency = this.addParam(CONTROL_RATE, frequency);
    this._detune = this.addParam(CONTROL_RATE, detune);
    this._Q = this.addParam(CONTROL_RATE, Q);
    this._gain = this.addParam(CONTROL_RATE, gain);

    this.dspInit();
    this.dspUpdateKernel(1);
  }

  /**
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * @param {string} value
   */
  setType(value) {
    /* istanbul ignore else */
    if (allowedBiquadFilterTypes.indexOf(value) !== -1) {
      this._type = value;
    }
  }

  /**
   * @return {AudioParam}
   */
  getFrequency() {
    return this._frequency;
  }

  /**
   * @return {AudioParam}
   */
  getDetune() {
    return this._detune;
  }

  /**
   * @return {AudioParam}
   */
  getQ() {
    return this._Q;
  }

  /**
   * @return {AudioParam}
   */
  getGain() {
    return this._gain;
  }

  /**
   * @param {Float32Array} frequencyHz
   * @param {Float32Array} magResponse
   * @param {Float32Array} phaseResponse
   */
  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this.dspGetFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }

  /**
   * @return {number}
   */
  getTailTime() {
    return 0.2;
  }
}

Object.assign(BiquadFilterNode.prototype, BiquadFilterNodeDSP);

export default BiquadFilterNode;
