export function nmap<T>(
  n: number,
  map: (i: number, i2: number, arr: T[]) => T,
) {
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = map(i, i, result);
  }
  return result;
}
