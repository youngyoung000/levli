"use client";

import { useCallback, useState } from "react";
import { BAYER_2, BAYER_4, BAYER_8 } from "./halftone-pattern";
import styles from "./hero-ambient-field.module.css";

const TILE_COUNT = 34;
const TILE_SIZE = 22;
const TILE_DURATION = "1s";
const MIN_HORIZONTAL_DISTANCE = 6;
const MIN_VERTICAL_DISTANCE = 4;
const GRIDS = [2, 4, 8] as const;
const DENSITIES = [0.28, 0.42, 0.56, 0.68] as const;
const CLUSTERS = [
  { x: 14, y: 20, radiusX: 7, radiusY: 8 },
  { x: 45, y: 16, radiusX: 11, radiusY: 6 },
  { x: 82, y: 30, radiusX: 8, radiusY: 12 },
  { x: 28, y: 74, radiusX: 11, radiusY: 14 },
  { x: 72, y: 80, radiusX: 15, radiusY: 9 },
] as const;

type Cell = { diamond: boolean; filled: boolean };
type Tile = {
  cells: Cell[];
  delay: string;
  duration: string;
  grid: 2 | 4 | 8;
  left: number;
  top: number;
};

type RandomSource = () => number;

const clamp = (value: number, min: number, max: number): number => (
  Math.max(min, Math.min(max, value))
);

const pixelNoise = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

function seededRandom(seed: number): RandomSource {
  let cursor = seed;
  return () => {
    cursor += 1;
    return pixelNoise(cursor * 17.17 + seed * 31.31);
  };
}

function createCells(grid: 2 | 4 | 8, density: number, random: RandomSource): Cell[] {
  const thresholds = grid === 2 ? BAYER_2 : grid === 8 ? BAYER_8 : BAYER_4;
  const tilePhase = Math.floor(random() * grid);
  const cells = thresholds.map((threshold, cellIndex) => {
    const row = Math.floor(cellIndex / grid);
    const col = cellIndex % grid;
    const cellNoise = (random() - 0.5) * 0.18;
    const filled = threshold <= density + cellNoise;
    const diamond = filled
      && grid >= 4
      && density <= 0.72
      && random() > 0.34
      && (row + col + tilePhase) % 3 !== 0;

    return { diamond, filled };
  });
  const lowestThresholdIndex = thresholds.indexOf(Math.min(...thresholds));
  const highestThresholdIndex = thresholds.indexOf(Math.max(...thresholds));
  cells[lowestThresholdIndex] = { diamond: false, filled: true };
  cells[highestThresholdIndex] = { diamond: false, filled: false };
  return cells;
}

function positionOverlaps(left: number, top: number, occupied: Tile[]): boolean {
  return occupied.some((tile) => (
    Math.abs(left - tile.left) < MIN_HORIZONTAL_DISTANCE
    && Math.abs(top - tile.top) < MIN_VERTICAL_DISTANCE
  ));
}

function createPosition(
  random: RandomSource,
  occupied: Tile[],
  previous?: Tile,
): { left: number; top: number } {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const cluster = CLUSTERS[Math.floor(random() * CLUSTERS.length)] ?? CLUSTERS[0];
    const clustered = random() < 0.68;
    const left = clustered
      ? clamp(cluster.x + (random() + random() - 1) * cluster.radiusX, 1, 99)
      : 1 + random() * 98;
    const top = clustered
      ? clamp(cluster.y + (random() + random() - 1) * cluster.radiusY, 2, 98)
      : 2 + random() * 96;
    const movedEnough = !previous || Math.hypot(left - previous.left, top - previous.top) >= 12;

    if (movedEnough && !positionOverlaps(left, top, occupied)) return { left, top };
  }

  for (let top = 4; top <= 96; top += MIN_VERTICAL_DISTANCE) {
    for (let left = 3; left <= 97; left += MIN_HORIZONTAL_DISTANCE) {
      const movedEnough = !previous || Math.hypot(left - previous.left, top - previous.top) >= 12;
      if (movedEnough && !positionOverlaps(left, top, occupied)) return { left, top };
    }
  }

  return previous ? { left: previous.left, top: previous.top } : { left: 50, top: 50 };
}

function createTile(
  random: RandomSource,
  previous?: Tile,
  initial = false,
  occupied: Tile[] = [],
): Tile {
  const grid = GRIDS[Math.floor(random() * GRIDS.length)] ?? 4;
  const density = DENSITIES[Math.floor(random() * DENSITIES.length)] ?? 0.42;
  const position = createPosition(random, occupied, previous);

  return {
    cells: createCells(grid, density, random),
    delay: previous?.delay ?? (initial ? `${-random()}s` : "0s"),
    duration: TILE_DURATION,
    grid,
    left: position.left,
    top: position.top,
  };
}

function createInitialTiles(): Tile[] {
  const tiles: Tile[] = [];
  for (let index = 0; index < TILE_COUNT; index += 1) {
    tiles.push(createTile(seededRandom(index * 97 + 13), undefined, true, tiles));
  }
  return tiles;
}

const INITIAL_TILES = createInitialTiles();

export function HeroAmbientField(): React.JSX.Element {
  const [tiles, setTiles] = useState<Tile[]>(INITIAL_TILES);
  const rerollTile = useCallback((index: number): void => {
    setTiles((current) => {
      const previous = current[index];
      if (!previous) return current;
      const occupied = current.filter((_, tileIndex) => tileIndex !== index);
      const next = [...current];
      next[index] = createTile(Math.random, previous, false, occupied);
      return next;
    });
  }, []);

  return (
    <div className={styles.field} aria-hidden="true">
      {tiles.map((tile, index) => (
        <i
          className={styles.tile}
          key={index}
          onAnimationIteration={() => rerollTile(index)}
          style={{
            animationDelay: tile.delay,
            animationDuration: tile.duration,
            gridTemplateColumns: `repeat(${tile.grid}, 1fr)`,
            height: TILE_SIZE,
            left: `${tile.left}%`,
            top: `${tile.top}%`,
            width: TILE_SIZE,
          }}
        >
          {tile.cells.map((cell, cellIndex) => (
            <b
              className={cell.filled
                ? `${styles.cellFilled} ${cell.diamond ? styles.cellDiamond : ""}`
                : undefined}
              key={cellIndex}
            />
          ))}
        </i>
      ))}
    </div>
  );
}
