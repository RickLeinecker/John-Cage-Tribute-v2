'use strict';

import * as impl from '../impl';
import AudioNode from './AudioNode';

class IIRFilterNode extends AudioNode {
  constructor(context, opts) {
    super(context);

    this._impl = new impl.IIRFilterNode(context._impl, opts);
  }

  getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
    this._impl.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
  }
}

export default IIRFilterNode;
