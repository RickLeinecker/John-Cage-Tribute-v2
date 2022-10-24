'use strict';

/**
 * @param {object} value
 * @return {object}
 */
function toImpl(value) {
  return value._impl || value;
}

export default toImpl;
