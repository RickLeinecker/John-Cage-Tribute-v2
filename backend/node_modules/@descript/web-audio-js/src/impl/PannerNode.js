'use strict';

import BasePannerNode from './BasePannerNode';
import PannerNodeDSP from './dsp/PannerNode';

class PannerNode extends BasePannerNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context, opts) {
    super(context, opts);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setPosition() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setOrientation() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  /* istanbul ignore next */
  setVelocity() {
    throw new TypeError('NOT YET IMPLEMENTED');
  }
}

Object.assign(PannerNode.prototype, PannerNodeDSP);

export default PannerNode;
