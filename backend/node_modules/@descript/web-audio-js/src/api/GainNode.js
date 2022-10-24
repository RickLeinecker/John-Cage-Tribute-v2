'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';
import AudioParam from './AudioParam';

class GainNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.GainNode(context._impl, opts);
    this._impl.$gain = new AudioParam(context, this._impl.getGain());
  }

  get gain() {
    return this._impl.$gain;
  }
}

export default GainNode;
