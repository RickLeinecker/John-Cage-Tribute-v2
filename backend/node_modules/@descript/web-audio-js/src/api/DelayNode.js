'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';
import AudioParam from './AudioParam';

class DelayNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.DelayNode(context._impl, opts);
    this._impl.$delayTime = new AudioParam(context, this._impl.getDelayTime());
  }

  get delayTime() {
    return this._impl.$delayTime;
  }
}

export default DelayNode;
