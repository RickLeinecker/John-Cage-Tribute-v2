'use strict';

import * as api from '../../api';
import AudioContext from '../../api/BaseAudioContext';

describe('api/AudioBuffer', () => {
  it('context.createBuffer(numberOfChannels, length, sampleRate)', () => {
    const context = new AudioContext();
    const target = context.createBuffer(1, 16, 8000);

    expect(target instanceof api.AudioBuffer).toBeTruthy();
  });

  describe('attributes', () => {
    it('.sampleRate', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const sampleRate = 8000;

      target._impl.getSampleRate = jest.fn(() => sampleRate);

      expect(target.sampleRate).toBe(sampleRate);
      expect(target._impl.getSampleRate).toHaveBeenCalledTimes(1);
    });

    it('.length', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const length = 16;

      target._impl.getLength = jest.fn(() => length);

      expect(target.length).toBe(length);
      expect(target._impl.getLength).toHaveBeenCalledTimes(1);
    });

    it('.duration', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const duration = 16 / 8000;

      target._impl.getDuration = jest.fn(() => duration);

      expect(target.duration).toBe(duration);
      expect(target._impl.getDuration).toHaveBeenCalledTimes(1);
    });

    it('.numberOfChannels', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const numberOfChannels = 1;

      target._impl.getNumberOfChannels = jest.fn(() => numberOfChannels);

      expect(target.numberOfChannels).toBe(numberOfChannels);
      expect(target._impl.getNumberOfChannels).toHaveBeenCalledTimes(1);
    });
  });

  describe('methods', () => {
    it('.getChannelData(channel)', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const channel = 0;

      target._impl.getChannelData = jest.fn();

      target.getChannelData(channel);
      expect(target._impl.getChannelData).toHaveBeenCalledTimes(1);
      expect(target._impl.getChannelData.mock.calls[0][0]).toBe(channel);
    });

    it('.copyFromChannel(destination, channelNumber, startInChannel)', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const destination = new Float32Array(128);
      const channelNumber = 0;
      const startInChannel = 2;

      target._impl.copyFromChannel = jest.fn();

      target.copyFromChannel(destination, channelNumber, startInChannel);
      expect(target._impl.copyFromChannel).toHaveBeenCalledTimes(1);
      expect(target._impl.copyFromChannel.mock.calls[0][0]).toBe(destination);
      expect(target._impl.copyFromChannel.mock.calls[0][1]).toBe(channelNumber);
      expect(target._impl.copyFromChannel.mock.calls[0][2]).toBe(
        startInChannel,
      );
    });

    it('.copyToChannel(source, channelNumber, startInChannel)', () => {
      const context = new AudioContext();
      const target = context.createBuffer(1, 16, 8000);
      const source = new Float32Array(128);
      const channelNumber = 0;
      const startInChannel = 2;

      target._impl.copyToChannel = jest.fn();

      target.copyToChannel(source, channelNumber, startInChannel);
      expect(target._impl.copyToChannel).toHaveBeenCalledTimes(1);
      expect(target._impl.copyToChannel.mock.calls[0][0]).toBe(source);
      expect(target._impl.copyToChannel.mock.calls[0][1]).toBe(channelNumber);
      expect(target._impl.copyToChannel.mock.calls[0][2]).toBe(startInChannel);
    });
  });
});
