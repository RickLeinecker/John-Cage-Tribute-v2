'use strict';

import * as impl from '../impl';
import { defineProp } from '../utils';

class PeriodicWave {
  constructor(context, opts) {
    defineProp(this, '_impl', new impl.PeriodicWave(context._impl, opts));
  }
}

export default PeriodicWave;
