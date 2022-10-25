'use strict';

import BasePannerNode from './BasePannerNode';
import StereoPannerNodeDSP from './dsp/StereoPannerNode';
import { defaults } from '../utils';

import { AUDIO_RATE } from '../constants/AudioParamRate';

const DEFAULT_PAN = 0;

class StereoPannerNode extends BasePannerNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.pan
   */
  constructor(context, opts = {}) {
    const pan = defaults(opts.pan, DEFAULT_PAN);

    super(context, opts);

    this._pan = this.addParam(AUDIO_RATE, pan);
  }

  /**
   * @param {AudioParam}
   */
  getPan() {
    return this._pan;
  }
}

Object.assign(StereoPannerNode.prototype, StereoPannerNodeDSP);

export default StereoPannerNode;
