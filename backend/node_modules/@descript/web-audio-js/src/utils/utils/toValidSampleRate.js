'use strict';

import toNumber from './toNumber';
import clamp from './clamp';
import { MAX_SAMPLERATE, MIN_SAMPLERATE } from '../../constants';

/**
 * @param {number} value
 * @return {number}
 */
function toValidSampleRate(value) {
  return clamp(toNumber(value), MIN_SAMPLERATE, MAX_SAMPLERATE) | 0;
}

export default toValidSampleRate;
