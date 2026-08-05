function createBayerThresholds(size: number): number[] {
  let matrix = [0];
  let currentSize = 1;

  while (currentSize < size) {
    const nextSize = currentSize * 2;
    const next = new Array<number>(nextSize * nextSize);

    for (let row = 0; row < currentSize; row += 1) {
      for (let col = 0; col < currentSize; col += 1) {
        const value = matrix[row * currentSize + col] ?? 0;
        next[row * nextSize + col] = value * 4;
        next[row * nextSize + col + currentSize] = value * 4 + 2;
        next[(row + currentSize) * nextSize + col] = value * 4 + 3;
        next[(row + currentSize) * nextSize + col + currentSize] = value * 4 + 1;
      }
    }

    matrix = next;
    currentSize = nextSize;
  }

  return matrix.map((value) => value / (size * size));
}

export const BAYER_2 = createBayerThresholds(2);
export const BAYER_4 = createBayerThresholds(4);
export const BAYER_8 = createBayerThresholds(8);
