'use strict';

/**
 * @param {*} value
 * @return {Array}
 */
function toArrayIfNeeded(value) {
  return Array.isArray(value) ? value : [value];
}

export default toArrayIfNeeded;
