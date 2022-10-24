'use strict';

import audioType from 'audio-type';
import WavDecoder from 'wav-decoder';
import * as DecoderUtils from './utils/DecoderUtils';
import * as AudioDataUtils from './utils/AudioDataUtils';
import AudioBuffer from './api/AudioBuffer';

const decoders = {};

/**
 * @param {string}    type
 * @return {function}
 */
function get(type) {
  return decoders[type] || null;
}

/**
 * @param {string}   type
 * @param {function} fn
 */
function set(type, fn) {
  /* istanbul ignore else */
  if (typeof fn === 'function') {
    decoders[type] = fn;
  }
}

/**
 * @param {ArrayBuffer} AudioBuffer
 * @param {object}      opts
 * @return {Promise<AudioData>}
 */
function decode(audioData, opts) {
  const type = toAudioType(audioData);
  const decodeFn = decoders[type];

  if (typeof decodeFn !== 'function') {
    return Promise.reject(
      new TypeError(
        `Decoder does not support the audio format: ${type || 'unknown'}`,
      ),
    );
  }

  return DecoderUtils.decode(decodeFn, audioData, opts).then((audioData) => {
    return AudioDataUtils.toAudioBuffer(audioData, AudioBuffer);
  });
}

function toAudioType(audioData) {
  if (!(audioData instanceof Uint8Array)) {
    audioData = new Uint8Array(audioData, 0, 16);
  }
  return audioType(audioData) || '';
}

set('wav', WavDecoder.decode);

export { get, set, decode };
