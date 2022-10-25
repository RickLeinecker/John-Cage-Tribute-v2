'use strict';

import toNumber from './toNumber';
import clamp from './clamp';
import { MAX_NUMBER_OF_CHANNELS } from '../../constants';

/**
 * @param {number} value
 * @return {number}
 */
function toValidNumberOfChannels(value) {
  return clamp(toNumber(value), 1, MAX_NUMBER_OF_CHANNELS) | 0;
}

export default toValidNumberOfChannels;
