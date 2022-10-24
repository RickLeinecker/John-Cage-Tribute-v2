'use strict';

// Port from Chromium
// https://chromium.googlesource.com/chromium/blink/+/master/Source/platform/audio/DynamicsCompressorKernel.cpp

import assert from 'assert';
import { flushDenormalFloatToZero, toDecibel, toLinear } from '../../utils';

const DEFAULT_PRE_DELAY_FRAMES = 256;
const MAX_PRE_DELAY_FRAMES = 1024;
const MAX_PRE_DELAY_FRAMES_MASK = MAX_PRE_DELAY_FRAMES - 1;
const PI_OVER_2 = Math.PI / 2;
// Metering hits peaks instantly, but releases this fast (in seconds).
const METERING_RELEASE_TIME_CONSTANT = 0.325;

function discreteTimeConstantForSampleRate(timeConstant, sampleRate) {
  // From the WebAudio spec, the formula for setTargetAtTime is
  //
  //   v(t) = V1 + (V0 - V1)*exp(-t/tau)
  //
  // where tau is the time constant, V1 is the target value and V0 is
  // the starting value.
  //
  // Rewrite this as
  //
  //   v(t) = V0 + (V1 - V0)*(1-exp(-t/tau))
  //
  // The implementation of setTargetAtTime uses this form.  So at the
  // sample points, we have
  //
  //   v(n/Fs) = V0 + (V1 - V0)*(1-exp(-n/(Fs*tau)))
  //
  // where Fs is the sample rate of the sampled systme.  Thus, the
  // discrete time constant is
  //
  //   1 - exp(-1/(Fs*tau)
  return 1 - Math.exp(-1 / (sampleRate * timeConstant));
}

class DynamicsCompressorKernel {
  constructor(sampleRate, numberOfChannels) {
    this.sampleRate = sampleRate;
    this.lastPreDelayFrames = DEFAULT_PRE_DELAY_FRAMES;
    this.preDelayReadIndex = 0;
    this.preDelayWriteIndex = DEFAULT_PRE_DELAY_FRAMES;
    this.ratio = undefined;
    this.slope = undefined;
    this.linearThreshold = undefined;
    this.dbThreshold = undefined;
    this.dbKnee = undefined;
    this.kneeThreshold = undefined;
    this.kneeThresholdDb = undefined;
    this.ykneeThresholdDb = undefined;
    this.K = undefined;
    this.preDelayBuffers = [];

    this.setNumberOfChannels(numberOfChannels);

    // Initializes most member variables;
    this.reset();

    this.meteringReleaseK = discreteTimeConstantForSampleRate(
      METERING_RELEASE_TIME_CONSTANT,
      sampleRate,
    );
  }

  setNumberOfChannels(numberOfChannels) {
    if (this.preDelayBuffers.length === numberOfChannels) {
      return;
    }

    this.preDelayBuffers = [];
    for (let i = 0; i < numberOfChannels; i++) {
      this.preDelayBuffers.push(new Float32Array(MAX_PRE_DELAY_FRAMES));
    }
  }

  setPreDelayTime(preDelayTime) {
    let preDelayFrames = preDelayTime * this.sampleRate;
    if (preDelayFrames > MAX_PRE_DELAY_FRAMES - 1) {
      preDelayFrames = MAX_PRE_DELAY_FRAMES - 1;
    }

    if (this.lastPreDelayFrames !== preDelayFrames) {
      this.lastPreDelayFrames = preDelayFrames;
      for (let i = 0; i < this.preDelayBuffers.length; i++) {
        this.preDelayBuffers[i].fill(0);
      }

      this.preDelayReadIndex = 0;
      this.preDelayWriteIndex = preDelayFrames;
    }
  }

  // Exponential curve for the knee.
  // It is 1st derivative matched at m_linearThreshold and asymptotically
  // approaches the value m_linearThreshold + 1 / k.
  kneeCurve(x, k) {
    // Linear up to threshold.
    if (x < this.linearThreshold) {
      return x;
    }
    return (
      this.linearThreshold + (1 - Math.exp(-k * (x - this.linearThreshold))) / k
    );
  }

  // Full compression curve with constant ratio after knee.
  saturate(x, k) {
    if (x < this.kneeThreshold) {
      return this.kneeCurve(x, k);
    }

    // Constant ratio after knee
    const xDb = toDecibel(x);
    const yDb =
      this.ykneeThresholdDb + this.slope * (xDb - this.kneeThresholdDb);
    return toLinear(yDb);
  }

  // Approximate 1st derivative with input and output expressed in dB.
  // This slope is equal to the inverse of the compression "ratio".
  // In other words, a compression ratio of 20 would be a slope of 1/20.
  slopeAt(x, k) {
    if (x < this.linearThreshold) {
      return 1;
    }

    const x2 = x * 1.001;

    const xDb = toDecibel(x);
    const x2Db = toDecibel(x2);

    const yDb = toDecibel(this.kneeCurve(x, k));
    const y2Db = toDecibel(this.kneeCurve(x2, k));

    return (y2Db - yDb) / (x2Db - xDb);
  }

  kAtSlope(desiredSlope) {
    const xDb = this.dbThreshold + this.dbKnee;
    const x = toLinear(xDb);

    // Approximate k given initial values.
    let minK = 0.1;
    let maxK = 10000;
    let k = 5;

    for (let i = 0; i < 15; i++) {
      // A high value for k will more quickly asymptotically approach a slope of 0.
      const slope = this.slopeAt(x, k);

      if (slope < desiredSlope) {
        // k is too high
        maxK = k;
      } else {
        // k is too low
        minK = k;
      }

      // Re-calculate based on geometric mean
      k = Math.sqrt(minK * maxK);
    }

    return k;
  }

  updateStaticCurveParameters(dbThreshold, dbKnee, ratio) {
    if (
      dbThreshold !== this.dbThreshold ||
      dbKnee !== this.dbKnee ||
      ratio !== this.ratio
    ) {
      // Threshold and knee
      this.dbThreshold = dbThreshold;
      this.linearThreshold = toLinear(dbThreshold);
      this.dbKnee = dbKnee;

      // Compute knee parameters
      this.ratio = ratio;
      this.slope = 1 / ratio;

      const k = this.kAtSlope(this.slope);

      this.kneeThresholdDb = dbThreshold + dbKnee;
      this.kneeThreshold = toLinear(this.kneeThresholdDb);

      this.ykneeThresholdDb = toDecibel(this.kneeCurve(this.kneeThreshold, k));

      this.K = k;
    }
    return this.K;
  }

  process(
    sourceChannels,
    destinationChannels,
    numberOfChannels,
    framesToProcess,
    dbThreshold,
    dbKnee,
    ratio,
    attackTime,
    releaseTime,
    preDelayTime,
    dbPostGain,
    effectBlend, // equal power crossfade
    releaseZone1,
    releaseZone2,
    releaseZone3,
    releaseZone4,
  ) {
    assert(this.preDelayBuffers.length === numberOfChannels);

    const sampleRate = this.sampleRate;

    const dryMix = 1 - effectBlend;
    const wetMix = effectBlend;

    const k = this.updateStaticCurveParameters(dbThreshold, dbKnee, ratio);

    // Makeup gain.
    const fullRangeGain = this.saturate(1, k);
    let fullRangeMakeupGain = 1 / fullRangeGain;

    // Empirical/perceptual tuning.
    fullRangeMakeupGain = Math.pow(fullRangeMakeupGain, 0.6);

    const masterLinearGain = toLinear(dbPostGain) * fullRangeMakeupGain;

    // Attack parameters.
    attackTime = Math.max(0.001, attackTime);
    const attackFrames = attackTime * sampleRate;

    // Release parameters.
    const releaseFrames = releaseTime * sampleRate;

    // Detector release time
    const satReleaseTime = 0.0025;
    const satReleaseFrames = satReleaseTime * sampleRate;

    // Create a smooth function which passes through four points

    // Polynomial of the form
    // y = a + b*x + c*x^2 + d*x^3 + e*x^4;

    const y1 = releaseFrames * releaseZone1;
    const y2 = releaseFrames * releaseZone2;
    const y3 = releaseFrames * releaseZone3;
    const y4 = releaseFrames * releaseZone4;

    // All of these coefficients were derived for 4th order polynomial curve fitting where the y values
    // match the evenly spaced x values as follows: (y1 : x == 0, y2 : x == 1, y3 : x == 2, y4 : x == 3)
    const kA =
      0.9999999999999998 * y1 +
      1.8432219684323923e-16 * y2 -
      1.9373394351676423e-16 * y3 +
      8.824516011816245e-18 * y4;
    const kB =
      -1.5788320352845888 * y1 +
      2.3305837032074286 * y2 -
      0.9141194204840429 * y3 +
      0.1623677525612032 * y4;
    const kC =
      0.5334142869106424 * y1 -
      1.272736789213631 * y2 +
      0.9258856042207512 * y3 -
      0.18656310191776226 * y4;
    const kD =
      0.08783463138207234 * y1 -
      0.1694162967925622 * y2 +
      0.08588057951595272 * y3 -
      0.00429891410546283 * y4;
    const kE =
      -0.042416883008123074 * y1 +
      0.1115693827987602 * y2 -
      0.09764676325265872 * y3 +
      0.028494263462021576 * y4;

    // x ranges from 0 -> 3       0    1    2   3
    //                           -15  -10  -5   0db

    // y calculates adaptive release frames depending on the amount of compression.

    this.setPreDelayTime(preDelayTime);

    const nDivisionFrames = 32;
    const nDivisions = framesToProcess / nDivisionFrames;

    let frameIndex = 0;
    for (let i = 0; i < nDivisions; i++) {
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Calculate desired gain
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // Fix gremlins.
      if (isNaN(this.detectorAverage)) {
        this.detectorAverage = 1;
      }
      if (
        this.detectorAverage === Infinity ||
        this.detectorAverage === -Infinity
      ) {
        this.detectorAverage = 1;
      }

      const desiredGain = this.detectorAverage;

      // Pre-warp so we get desiredGain after sin() warp below.
      const scaledDesiredGain = Math.asin(desiredGain) / PI_OVER_2;

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Deal with envelopes
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // envelopeRate is the rate we slew from current compressor level to the desired level.
      // The exact rate depends on if we're attacking or releasing and by how much.
      let envelopeRate = 0;

      const isReleasing = scaledDesiredGain > this.compressorGain;

      // compressionDiffDb is the difference between current compression level and the desired level.
      let compressionDiffDb = toDecibel(
        this.compressorGain / scaledDesiredGain,
      );

      if (isReleasing) {
        // Release mode - compressionDiffDb should be negative dB
        this.maxAttackCompressionDiffDb = -1;

        // Fix gremlins.
        if (isNaN(compressionDiffDb)) {
          compressionDiffDb = -1;
        }
        if (compressionDiffDb === Infinity || compressionDiffDb === -Infinity) {
          compressionDiffDb = -1;
        }

        // Adaptive release - higher compression (lower compressionDiffDb)  releases faster.

        // Contain within range: -12 -> 0 then scale to go from 0 -> 3
        let x = compressionDiffDb;
        x = Math.max(-12, x);
        x = Math.min(0, x);
        x = 0.25 * (x + 12);

        // Compute adaptive release curve using 4th order polynomial.
        // Normal values for the polynomial coefficients would create a monotonically increasing function.
        const x2 = x * x;
        const x3 = x2 * x;
        const x4 = x2 * x2;
        const releaseFrames = kA + kB * x + kC * x2 + kD * x3 + kE * x4;

        const kSpacingDb = 5;
        const dbPerFrame = kSpacingDb / releaseFrames;

        envelopeRate = toLinear(dbPerFrame);
      } else {
        // Attack mode - compressionDiffDb should be positive dB

        // Fix gremlins.
        if (isNaN(compressionDiffDb)) {
          compressionDiffDb = 1;
        }
        if (compressionDiffDb === Infinity || compressionDiffDb === -Infinity) {
          compressionDiffDb = 1;
        }

        // As long as we're still in attack mode, use a rate based off
        // the largest compressionDiffDb we've encountered so far.
        if (
          this.maxAttackCompressionDiffDb === -1 ||
          this.maxAttackCompressionDiffDb < compressionDiffDb
        ) {
          this.maxAttackCompressionDiffDb = compressionDiffDb;
        }

        const effAttenDiffDb = Math.max(0.5, this.maxAttackCompressionDiffDb);

        const x = 0.25 / effAttenDiffDb;
        envelopeRate = 1 - Math.pow(x, 1 / attackFrames);
      }

      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Inner loop - calculate shaped power average - apply compression.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      {
        let preDelayReadIndex = this.preDelayReadIndex;
        let preDelayWriteIndex = this.preDelayWriteIndex;
        let detectorAverage = this.detectorAverage;
        let compressorGain = this.compressorGain;

        let loopFrames = nDivisionFrames;
        while (loopFrames--) {
          let compressorInput = 0;

          // Predelay signal, computing compression amount from un-delayed version.
          for (let i = 0; i < numberOfChannels; i++) {
            const delayBuffer = this.preDelayBuffers[i];
            const undelayedSource = sourceChannels[i][frameIndex];
            delayBuffer[preDelayWriteIndex] = undelayedSource;

            const absUndelayedSource =
              undelayedSource > 0 ? undelayedSource : -undelayedSource;
            if (compressorInput < absUndelayedSource) {
              compressorInput = absUndelayedSource;
            }
          }

          // Calculate shaped power on undelayed input.

          const scaledInput = compressorInput;
          const absInput = scaledInput > 0 ? scaledInput : -scaledInput;

          // Put through shaping curve.
          // This is linear up to the threshold, then enters a "knee" portion followed by the "ratio" portion.
          // The transition from the threshold to the knee is smooth (1st derivative matched).
          // The transition from the knee to the ratio portion is smooth (1st derivative matched).
          const shapedInput = this.saturate(absInput, k);

          const attenuation = absInput <= 0.0001 ? 1 : shapedInput / absInput;

          let attenuationDb = -toDecibel(attenuation);
          attenuationDb = Math.max(2, attenuationDb);

          const dbPerFrame = attenuationDb / satReleaseFrames;

          const satReleaseRate = toLinear(dbPerFrame) - 1;

          const isRelease = attenuation > detectorAverage;
          const rate = isRelease ? satReleaseRate : 1;

          detectorAverage += (attenuation - detectorAverage) * rate;
          detectorAverage = Math.min(1, detectorAverage);

          // Fix gremlins.
          if (isNaN(detectorAverage)) {
            detectorAverage = 1;
          }
          if (detectorAverage === Infinity || detectorAverage === -Infinity) {
            detectorAverage = 1;
          }

          // Exponential approach to desired gain
          if (envelopeRate < 1) {
            // Attack - reduce gain to desired
            compressorGain +=
              (scaledDesiredGain - compressorGain) * envelopeRate;
          } else {
            // Release - exponentially increase gain to 1.0
            compressorGain *= envelopeRate;
            compressorGain = Math.min(1, compressorGain);
          }

          // Warp pre-compression gain to smooth out sharp exponential transition points.
          const postWarpCompressorGain = Math.sin(PI_OVER_2 * compressorGain);

          // Calculate total gain using master gain and effect blend.
          const totalGain =
            dryMix + wetMix * masterLinearGain * postWarpCompressorGain;

          // Calculte metering.
          const dbRealGain = 20 * Math.log10(postWarpCompressorGain);
          if (dbRealGain < this.meteringGain) {
            this.meteringGain = dbRealGain;
          } else {
            this.meteringGain +=
              (dbRealGain - this.meteringGain) * this.meteringReleaseK;
          }

          // Apply final gain
          for (let i = 0; i < numberOfChannels; i++) {
            const delayBuffer = this.preDelayBuffers[i];
            destinationChannels[i][frameIndex] =
              delayBuffer[preDelayReadIndex] * totalGain;
          }

          frameIndex++;
          preDelayReadIndex =
            (preDelayReadIndex + 1) & MAX_PRE_DELAY_FRAMES_MASK;
          preDelayWriteIndex =
            (preDelayWriteIndex + 1) & MAX_PRE_DELAY_FRAMES_MASK;
        }

        // Locals back to member variables
        this.preDelayReadIndex = preDelayReadIndex;
        this.preDelayWriteIndex = preDelayWriteIndex;
        this.detectorAverage = flushDenormalFloatToZero(detectorAverage);
        this.compressorGain = flushDenormalFloatToZero(compressorGain);
      }
    }
  }

  reset() {
    this.detectorAverage = 0;
    this.compressorGain = 1;
    this.meteringGain = 1;

    // Predelay section.
    for (const buffer of this.preDelayBuffers) {
      buffer.fill(0);
    }

    this.preDelayReadIndex = 0;
    this.preDelayWriteIndex = DEFAULT_PRE_DELAY_FRAMES;

    this.maxAttackCompressionDiffDb = -1; // uninitialized state
  }
}

export default DynamicsCompressorKernel;
