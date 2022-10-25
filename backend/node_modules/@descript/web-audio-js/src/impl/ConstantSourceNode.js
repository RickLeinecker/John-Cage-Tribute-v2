'use strict';

import AudioScheduledSourceNode from './AudioScheduledSourceNode';
import ConstantSourceNodeDSP from './dsp/ConstantSourceNode';
import { defaults } from '../utils';

import { MAX } from '../constants/ChannelCountMode';

import { AUDIO_RATE } from '../constants/AudioParamRate';

const DEFAULT_OFFSET = 1;

class ConstantSourceNode extends AudioScheduledSourceNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.offset
   */
  constructor(context, opts = {}) {
    const offset = defaults(opts.offset, DEFAULT_OFFSET);

    super(context, opts, {
      inputs: [1],
      outputs: [1],
      channelCount: 2,
      channelCountMode: MAX,
    });

    this._offset = this.addParam(AUDIO_RATE, offset);
  }

  /**
   * @return {AudioParam}
   */
  getOffset() {
    return this._offset;
  }
}

Object.assign(ConstantSourceNode.prototype, ConstantSourceNodeDSP);

export default ConstantSourceNode;
