export type Encoder = {
  encode(
    channelData: Float32Array[],
    offset?: number,
    len?: number,
  ): ArrayBuffer;
};
