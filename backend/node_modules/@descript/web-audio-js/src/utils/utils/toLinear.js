'use strict';

/**
 * @param {*} decibels
 * @return {number}
 */
function toLinear(decibels) {
  return Math.pow(10, 0.05 * decibels);
}

export default toLinear;
