'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';
import AudioParam from './AudioParam';

class StereoPannerNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.StereoPannerNode(context._impl, opts);
    this._impl.$pan = new AudioParam(context, this._impl.getPan());
  }

  get pan() {
    return this._impl.$pan;
  }
}

export default StereoPannerNode;
