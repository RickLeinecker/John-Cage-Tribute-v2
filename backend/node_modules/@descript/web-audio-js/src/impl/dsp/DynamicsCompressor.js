'use strict';

// Port from Chromium
// https://chromium.googlesource.com/chromium/blink/+/master/Source/platform/audio/DynamicsCompressor.cpp

import assert from 'assert';
import { nmap } from '../../utils/nmap';
import DynamicsCompressorKernel from './DynamicsCompressorKernel';

const THRESHOLD = 0;
const KNEE = 1;
const RATIO = 2;
const ATTACK = 3;
const RELEASE = 4;
const PRE_DELAY = 5;
const RELEASE_ZONE_1 = 6;
const RELEASE_ZONE_2 = 7;
const RELEASE_ZONE_3 = 8;
const RELEASE_ZONE_4 = 9;
const POST_GAIN = 10;
const FILTER_STAGE_GAIN = 11;
const FILTER_STAGE_RATIO = 12;
const FILTER_ANCHOR = 13;
const EFFECT_BLEND = 14;
const REDUCTION = 15;
const PARAM_LAST = 16;

const CompressorParameters = {
  THRESHOLD,
  KNEE,
  RATIO,
  ATTACK,
  RELEASE,
  REDUCTION,
};

class DynamicsCompressor {
  constructor(sampleRate, numberOfChannels) {
    this.numberOfChannels = numberOfChannels;
    this.sampleRate = sampleRate;
    this.nyquist = sampleRate / 2;
    this.compressor = new DynamicsCompressorKernel(
      sampleRate,
      numberOfChannels,
    );

    this.lastFilterStageRatio = -1;
    this.lastAnchor = -1;
    this.lastFilterStageGain = -1;

    this.parameters = new Array(PARAM_LAST);

    this.setNumberOfChannels(numberOfChannels);
    this.initializeParameters();
  }

  setParameterValue(parameterId, value) {
    if (parameterId < PARAM_LAST) {
      this.parameters[parameterId] = value;
    }
  }

  initializeParameters() {
    // Initializes compressor to default values.

    this.parameters[THRESHOLD] = -24; // dB
    this.parameters[KNEE] = 30; // dB
    this.parameters[RATIO] = 12; // unit-less
    this.parameters[ATTACK] = 0.003; // seconds
    this.parameters[RELEASE] = 0.25; // seconds
    this.parameters[PRE_DELAY] = 0.006; // seconds

    // Release zone values 0 -> 1.
    this.parameters[RELEASE_ZONE_1] = 0.09;
    this.parameters[RELEASE_ZONE_2] = 0.16;
    this.parameters[RELEASE_ZONE_3] = 0.42;
    this.parameters[RELEASE_ZONE_4] = 0.98;
    this.parameters[FILTER_STAGE_GAIN] = 4.4; // dB
    this.parameters[FILTER_STAGE_RATIO] = 2;
    this.parameters[FILTER_ANCHOR] = 15000 / this.nyquist;
    this.parameters[POST_GAIN] = 0; // dB
    this.parameters[REDUCTION] = 0; // dB

    // Linear crossfade (0 -> 1).
    this.parameters[EFFECT_BLEND] = 1;
  }

  parameterValue(parameterId) {
    return this.parameters[parameterId];
  }

  process(sourceBus, destinatonBus, framesToProcess) {
    // Though numberOfChannels is retrived from destinationBus, we still name it numberOfChannels instead of numberOfDestinationChannels.
    // It's because we internally match sourceChannels's size to destinationBus by channel up/down mix. Thus we need numberOfChannels
    // to do the loop work for both m_sourceChannels and m_destinationChannels.

    const numberOfChannels = destinatonBus.getNumberOfChannels();
    const numberOfSourceChannels = sourceBus.getNumberOfChannels();

    assert(numberOfChannels === this.numberOfChannels && numberOfChannels > 0);

    if (
      numberOfChannels !== this.numberOfChannels ||
      numberOfSourceChannels === 0
    ) {
      destinatonBus.zeros();
      return;
    }

    switch (numberOfChannels) {
      case 2: {
        // stereo
        this.sourceChannels[0] = sourceBus.getChannelData()[0];

        if (numberOfSourceChannels > 1) {
          this.sourceChannels[1] = sourceBus.getChannelData()[1];
        } else {
          // Simply duplicate mono channel input data to right channel for stereo processing.
          this.sourceChannels[1] = sourceBus.getChannelData()[0];
        }
        break;
      }
      default: {
        // FIXME : support other number of channels.
        assert(false);
        destinatonBus.zeros();
        return;
      }
    }

    for (let i = 0; i < numberOfChannels; i++) {
      this.destinationChannels[i] = destinatonBus.getMutableData()[i];
    }

    const filterStageGain = this.parameterValue(FILTER_STAGE_GAIN);
    const filterStageRatio = this.parameterValue(FILTER_STAGE_RATIO);
    const anchor = this.parameterValue(FILTER_ANCHOR);

    if (
      filterStageGain !== this.lastFilterStageGain ||
      filterStageRatio !== this.lastFilterStageRatio ||
      anchor !== this.lastAnchor
    ) {
      this.lastFilterStageGain = filterStageGain;
      this.lastFilterStageRatio = filterStageRatio;
      this.lastAnchor = anchor;
    }

    const dbThreshold = this.parameterValue(THRESHOLD);
    const dbKnee = this.parameterValue(KNEE);
    const ratio = this.parameterValue(RATIO);
    const attackTime = this.parameterValue(ATTACK);
    const releaseTime = this.parameterValue(RELEASE);
    const preDelayTime = this.parameterValue(PRE_DELAY);

    // This is effectively a master volume on the compressed signal (pre-blending).
    const dbPostGain = this.parameterValue(POST_GAIN);

    // Linear blending value from dry to completely processed (0 -> 1)
    // 0 means the signal is completely unprocessed.
    // 1 mixes in only the compressed signal.
    const effectBlend = this.parameterValue(EFFECT_BLEND);

    const releaseZone1 = this.parameterValue(RELEASE_ZONE_1);
    const releaseZone2 = this.parameterValue(RELEASE_ZONE_2);
    const releaseZone3 = this.parameterValue(RELEASE_ZONE_3);
    const releaseZone4 = this.parameterValue(RELEASE_ZONE_4);

    this.compressor.process(
      this.sourceChannels,
      this.destinationChannels,
      numberOfChannels,
      framesToProcess,

      dbThreshold,
      dbKnee,
      ratio,
      attackTime,
      releaseTime,
      preDelayTime,
      dbPostGain,
      effectBlend,

      releaseZone1,
      releaseZone2,
      releaseZone3,
      releaseZone4,
    );

    // Update the compression amount.
    this.setParameterValue(REDUCTION, this.compressor.meteringGain);
  }

  reset() {
    this.lastFilterStageRatio = -1; // for recalc
    this.lastAnchor = -1;
    this.lastFilterStageGain = -1;

    this.compressor.reset();
  }

  setNumberOfChannels(numberOfChannels) {
    this.sourceChannels = nmap(numberOfChannels, () => new Float32Array());
    this.destinationChannels = nmap(numberOfChannels, () => new Float32Array());

    this.compressor.setNumberOfChannels(numberOfChannels);
    this.numberOfChannels = numberOfChannels;
  }

  dspProcess(inputs, outputs, blockSize) {
    this.process(inputs[0].bus, outputs[0].bus, blockSize);
  }
}

export { DynamicsCompressor, CompressorParameters };
