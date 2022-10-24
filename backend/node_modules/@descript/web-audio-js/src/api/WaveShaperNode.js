'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';

class WaveShaperNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.WaveShaperNode(context._impl, opts);
  }

  get curve() {
    return this._impl.getCurve();
  }

  set curve(value) {
    this._impl.setCurve(value);
  }

  get oversample() {
    return this._impl.getOversample();
  }

  set oversample(value) {
    this._impl.setOversample(value);
  }
}

export default WaveShaperNode;
