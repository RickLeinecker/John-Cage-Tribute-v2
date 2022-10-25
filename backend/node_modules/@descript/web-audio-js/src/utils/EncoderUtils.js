'use strict';

import * as AudioDataUtils from './AudioDataUtils';

/**
 * @param {function}  encodeFn
 * @param {AudioData} audioData
 * @param {object}    opts
 */
function encode(encodeFn, audioData, /* istanbul ignore next */ opts = {}) {
  if (!AudioDataUtils.isAudioData(audioData)) {
    audioData = AudioDataUtils.toAudioData(audioData);
  }
  return encodeFn(audioData, opts);
}

export { encode };
