'use strict';

import * as impl from '../impl';
import AudioScheduledSourceNode from './AudioScheduledSourceNode';
import AudioParam from './AudioParam';

class ConstantSourceNode extends AudioScheduledSourceNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.ConstantSourceNode(context._impl, opts);
    this._impl.$offset = new AudioParam(context, this._impl.getOffset());
    this._impl.$onended = null;
  }

  get offset() {
    return this._impl.$offset;
  }
}

export default ConstantSourceNode;
