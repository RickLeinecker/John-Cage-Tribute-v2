'use strict';

import { nmap } from '../../utils/nmap';

/**
 * AudioData is struct like AudioBuffer.
 * This instance has no methods.
 * The channel data of this instance are taken via property accessor.
 * @prop {number}         numberOfChannels
 * @prop {number}         length
 * @prop {number}         sampleRate
 * @prop {Float32Array[]} channelData
 */
class AudioData {
  /**
   * @param {number} numberOfChannels
   * @param {number} length
   * @param {number} sampleRate
   * @param {Float32Array[]} [channelData]
   */
  constructor(numberOfChannels, length, sampleRate, channelData) {
    this.numberOfChannels = numberOfChannels | 0;
    this.length = length | 0;
    this.sampleRate = sampleRate | 0;
    this.channelData =
      channelData ||
      nmap(this.numberOfChannels, () => new Float32Array(this.length));
  }
}

export default AudioData;
