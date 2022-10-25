'use strict';

import clamp from './clamp';
import toPowerOfTwo from './toPowerOfTwo';
import { MAX_BLOCK_SIZE, MIN_BLOCK_SIZE } from '../../constants';

/**
 * @param {number} value
 * @return {number}
 */
function toValidBlockSize(value) {
  return clamp(toPowerOfTwo(value), MIN_BLOCK_SIZE, MAX_BLOCK_SIZE);
}

export default toValidBlockSize;
