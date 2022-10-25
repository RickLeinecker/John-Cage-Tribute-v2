'use strict';

import AudioNode from './AudioNode';
import ChannelSplitterNodeDSP from './dsp/ChannelSplitterNode';
import { defaults, fill, toValidNumberOfChannels } from '../utils';

import { MAX } from '../constants/ChannelCountMode';

const DEFAULT_NUMBER_OF_OUTPUTS = 6;

class ChannelSplitterNode extends AudioNode {
  /**
   * @param {AudioContext} context
   * @param {object}       opts
   * @param {number}       opts.numberOfOutputs
   */
  constructor(context, opts = {}) {
    let numberOfOutputs = defaults(
      opts.numberOfOutputs,
      DEFAULT_NUMBER_OF_OUTPUTS,
    );

    numberOfOutputs = toValidNumberOfChannels(numberOfOutputs);

    super(context, opts, {
      inputs: [1],
      outputs: fill(new Array(numberOfOutputs), 1),
      channelCount: 2,
      channelCountMode: MAX,
    });
  }
}

Object.assign(ChannelSplitterNode.prototype, ChannelSplitterNodeDSP);

export default ChannelSplitterNode;
