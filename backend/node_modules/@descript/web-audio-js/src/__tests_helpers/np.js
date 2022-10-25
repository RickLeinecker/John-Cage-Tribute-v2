'use strict';

function zeros(size, constructor = Float32Array) {
  return new constructor(size);
}

function full(size, value, constructor = Float32Array) {
  return new constructor(size).fill(value);
}

function random_sample(size, constructor = Float32Array) {
  return new constructor(size).map(Math.random);
}

export { zeros, full, random_sample };
