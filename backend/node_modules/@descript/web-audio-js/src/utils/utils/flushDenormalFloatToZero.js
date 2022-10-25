'use strict';

/**
 * @param {number} f
 * @returns {number}
 */
function flushDenormalFloatToZero(f) {
  return Math.abs(f) < 1.175494e-38 ? 0.0 : f;
}

export default flushDenormalFloatToZero;
