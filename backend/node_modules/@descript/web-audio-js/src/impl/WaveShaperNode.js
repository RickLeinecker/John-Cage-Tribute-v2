'use strict';

import AudioNode from './AudioNode';
import WaveShaperNodeDSP from './dsp/WaveShaperNode';
import { defaults } from '../utils';

import { MAX } from '../constants/ChannelCountMode';

const OverSampleTypes = ['none', '2x', '4x'];

const DEFAULT_CURVE = null;
const DEFAULT_OVERSAMPLE = 'none';

class WaveShaperNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {Float32Arrat} opts.curve
   * @param {string}       opts.overSample
   */
  constructor(context, opts = {}) {
    const curve = defaults(opts.curve, DEFAULT_CURVE);
    const overSample = defaults(opts.overSample, DEFAULT_OVERSAMPLE);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._curve = curve;
    this._overSample = overSample;

    this.dspInit();
    this.dspUpdateKernel(null, 1);
  }

  /**
   * @return {Float32Array}
   */
  getCurve() {
    return this._curve;
  }

  /**
   * @param {Float32Array} value
   */
  setCurve(value) {
    /* istanbul ignore else */
    if (value === null || value instanceof Float32Array) {
      this._curve = value;
      this.dspUpdateKernel(this._curve, this.outputs[0].getNumberOfChannels());
    }
  }

  /**
   * @return {boolean}
   */
  getOversample() {
    return this._overSample;
  }

  /**
   * @param {boolean} value
   */
  setOversample(value) {
    /* istanbul ignore else */
    if (OverSampleTypes.indexOf(value) !== -1) {
      this._overSample = value;
    }
  }

  /**
   * @param {number} numberOfChannels
   */
  channelDidUpdate(numberOfChannels) {
    this.dspUpdateKernel(this._curve, numberOfChannels);
    this.outputs[0].setNumberOfChannels(numberOfChannels);
  }
}

Object.assign(WaveShaperNode.prototype, WaveShaperNodeDSP);

export default WaveShaperNode;
