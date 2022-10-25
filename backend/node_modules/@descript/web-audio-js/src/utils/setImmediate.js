'use strict';

export default global.setImmediate /* istanbul ignore next */ ||
  ((fn) => setTimeout(fn, 0));
