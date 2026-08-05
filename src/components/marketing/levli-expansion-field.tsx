"use client";

import { useEffect, useRef } from "react";
import { BAYER_2, BAYER_4, BAYER_8 } from "./halftone-pattern";
import styles from "./levli-expansion-field.module.css";

const TAU = Math.PI * 2;
const BAND_COUNT = 3;

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function noise(seed: number): number {
  return fract(Math.sin(seed * 91.721 + 17.31) * 43758.5453);
}

function smoothstep(min: number, max: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

export function LevliExpansionField(
  {
    activeOpacity = 0.9,
    animated = true,
    centerXRatio,
    className,
    colorMode = "brand",
    idleOpacity = 0.7,
    interactive = true,
    scale = 1,
  }: {
    activeOpacity?: number | undefined;
    animated?: boolean | undefined;
    centerXRatio?: number | undefined;
    className?: string | undefined;
    colorMode?: "brand" | "black" | undefined;
    idleOpacity?: number | undefined;
    interactive?: boolean | undefined;
    scale?: number | undefined;
  } = {},
): React.JSX.Element {
  const graphicScale = Math.max(0.5, Math.min(1.5, scale));
  const graphicCenterXRatio = centerXRatio === undefined
    ? undefined
    : Math.max(0.1, Math.min(0.9, centerXRatio));
  const restingOpacity = Math.max(0, Math.min(1, idleOpacity));
  const engagedOpacity = Math.max(restingOpacity, Math.min(1, activeOpacity));
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const motionEnabled = animated && !reducedMotion.matches;

    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let frame = 0;
    let running = true;
    let elapsed = 0;
    let lastTime = performance.now();
    let pointerX = -1000;
    let pointerY = -1000;
    let pointerActive = false;
    let lastTrailX = -1000;
    let lastTrailY = -1000;
    let lastTrailTime = -1;
    let trail: Array<{ x: number; y: number; born: number }> = [];

    const mint = [0, 237, 213] as const;
    const white = [255, 255, 255] as const;
    const black = [0, 0, 0] as const;

    const pixelColor = (edgeAmount: number, seed: number, alpha: number): string => {
      if (colorMode === "black") {
        return `rgba(${black[0]},${black[1]},${black[2]},${alpha})`;
      }
      const accentChance = edgeAmount * 0.94;
      if (seed > accentChance) return `rgba(${mint[0]},${mint[1]},${mint[2]},${alpha})`;
      return `rgba(${white[0]},${white[1]},${white[2]},${alpha})`;
    };

    const wakeInfluenceAt = (x: number, y: number): number => {
      let strongest = 0;

      for (const point of trail) {
        const age = elapsed - point.born;
        if (age < 0 || age > 0.9) continue;

        const distance = Math.hypot(x - point.x, y - point.y);
        if (distance >= 82 * graphicScale) continue;

        const spatial = 1 - smoothstep(8 * graphicScale, 82 * graphicScale, distance);
        const temporal = 1 - smoothstep(0.04, 0.9, age);
        strongest = Math.max(strongest, spatial * temporal);
      }

      return strongest;
    };

    const drawHalftoneTile = (
      centerX: number,
      centerY: number,
      tileSize: number,
      density: number,
      alpha: number,
      tileSeed: number,
      edgeAmount: number,
    ): void => {
      const left = centerX - tileSize * 0.5;
      const top = centerY - tileSize * 0.5;
      const snap = (value: number): number => Math.round(value * pixelRatio) / pixelRatio;

      // Dense tiles become uninterrupted planes. Every other state is still drawn
      // inside the complete square tile instead of being clipped by the band curve.
      if (density > 0.88 && tileSeed > 0.82) {
        ctx.fillStyle = pixelColor(edgeAmount, noise(tileSeed * 79.7 + 4.1), alpha);
        const right = snap(left + tileSize);
        const bottom = snap(top + tileSize);
        const snappedLeft = snap(left);
        const snappedTop = snap(top);
        ctx.fillRect(snappedLeft, snappedTop, right - snappedLeft, bottom - snappedTop);
        return;
      }

      const patternSeed = noise(tileSeed * 173.9 + 23.7);
      const detailScore = edgeAmount * 0.58
        + (1 - density) * 0.22
        + patternSeed * 0.32;
      const cells = detailScore < 0.34 ? 2 : detailScore > 0.72 ? 8 : 4;
      const thresholds = cells === 2 ? BAYER_2 : cells === 8 ? BAYER_8 : BAYER_4;
      const cellSize = tileSize / cells;

      for (let row = 0; row < cells; row += 1) {
        for (let col = 0; col < cells; col += 1) {
          const threshold = thresholds[row * cells + col] ?? 0;
          const cellNoise = (noise(tileSeed * 101 + row * 13.7 + col * 29.3) - 0.5) * 0.18;
          if (threshold > density + cellNoise) continue;

          const colorSeed = noise(tileSeed * 151.3 + row * 19.7 + col * 43.1);
          ctx.fillStyle = pixelColor(edgeAmount, colorSeed, alpha);
          const tilePhase = Math.floor(tileSeed * cells);
          const diamondSeed = noise(tileSeed * 229.3 + row * 31.1 + col * 47.7);
          const useDiamond = cells >= 4
            && density <= 0.72
            && diamondSeed > 0.34
            && (row + col + tilePhase) % 3 !== 0;

          if (useDiamond) {
            const centerX = snap(left + col * cellSize + cellSize * 0.5);
            const centerY = snap(top + row * cellSize + cellSize * 0.5);
            const half = cellSize * 0.5;
            ctx.beginPath();
            ctx.moveTo(centerX, snap(centerY - half));
            ctx.lineTo(snap(centerX + half), centerY);
            ctx.lineTo(centerX, snap(centerY + half));
            ctx.lineTo(snap(centerX - half), centerY);
            ctx.closePath();
            ctx.fill();
          } else {
            const cellLeft = snap(left + col * cellSize);
            const cellTop = snap(top + row * cellSize);
            const cellRight = snap(left + (col + 1) * cellSize);
            const cellBottom = snap(top + (row + 1) * cellSize);
            ctx.fillRect(
              cellLeft,
              cellTop,
              cellRight - cellLeft,
              cellBottom - cellTop,
            );
          }
        }
      }
    };

    const drawBand = (bandIndex: number, progress: number): void => {
      const mobile = width <= 900;
      const centerX = width * (graphicCenterXRatio ?? (mobile ? 0.54 : 0.735));
      const baseTop = mobile ? height * 0.24 : height * 0.27;
      const baseBottom = mobile ? height * 0.78 : height * 0.75;
      const fieldCenterY = (baseTop + baseBottom) * 0.5;
      const top = fieldCenterY + (baseTop - fieldCenterY) * graphicScale;
      const bottom = fieldCenterY + (baseBottom - fieldCenterY) * graphicScale;
      const maxHalfWidth = (mobile
        ? Math.min(width * 0.42, 175)
        : Math.min(width * 0.225, 350)) * graphicScale;
      const halfWidth = mix(24 * graphicScale, maxHalfWidth, Math.pow(progress, 0.84));
      const thickness = mix(13 * graphicScale, (mobile ? 34 : 52) * graphicScale, Math.pow(progress, 0.72));
      const centerY = mix(bottom, top, progress);
      const tileSize = (mobile ? 16 : 18) * graphicScale;
      const tileStep = tileSize;
      const life = smoothstep(0.01, 0.065, progress) * (1 - smoothstep(0.935, 0.995, progress));
      const startCol = Math.floor((centerX - halfWidth - tileStep) / tileStep);
      const endCol = Math.ceil((centerX + halfWidth + tileStep) / tileStep);
      const verticalReach = thickness * 1.55 + tileStep;
      const startRow = Math.floor((centerY - verticalReach) / tileStep);
      const endRow = Math.ceil((centerY + verticalReach) / tileStep);

      for (let col = startCol; col <= endCol; col += 1) {
        const tileX = col * tileStep;
        const normalizedX = (tileX - centerX) / halfWidth;
        if (Math.abs(normalizedX) > 1) continue;

        // The symbol's negative cut drops quickly from the left and levels out
        // toward the right; this cubic follows that asymmetrical curvature.
        const curveT = (normalizedX + 1) * 0.5;
        const curveInverse = 1 - curveT;
        const symbolCurve = 3 * curveInverse * curveInverse * curveT * 0.58
          + 3 * curveInverse * curveT * curveT * 0.94
          + curveT * curveT * curveT;
        const leftLift = Math.pow(curveInverse, 2.6) * mix(7, 20, progress) * graphicScale;
        const curveY = centerY
          + (symbolCurve - 0.5) * mix(12, 44, progress) * graphicScale
          - leftLift;
        const taper = Math.pow(Math.max(0, 1 - Math.abs(normalizedX)), 0.42);
        const symbolWidthBias = 0.82 + curveT * 0.32;
        const localThickness = thickness * taper * symbolWidthBias;

        for (let row = startRow; row <= endRow; row += 1) {
          const tileY = row * tileStep;
          const distance = Math.abs(tileY - curveY);
          const radialX = Math.abs(normalizedX);
          const radialY = localThickness > 0 ? distance / localThickness : 1;
          const edgeDistance = Math.max(radialX, radialY);
          const tileSeed = noise(col * 17.17 + row * 31.31 + bandIndex * 73.7);
          const outside = edgeDistance > 1;
          const edgeAmount = smoothstep(0.55, 1.12, edgeDistance);
          const wakeInfluence = wakeInfluenceAt(tileX, tileY);

          if (outside) {
            if (edgeDistance >= 1.2) continue;
            const haloFalloff = smoothstep(1, 1.2, edgeDistance);
            const placementChance = Math.max(
              mix(0.68, 0.06, haloFalloff),
              wakeInfluence * 0.78,
            );
            if (tileSeed > placementChance) continue;
          }

          const densityFalloff = smoothstep(0.12, 1.08, edgeDistance);
          const randomOffset = (tileSeed - 0.5) * 0.42;
          const clusterNoise = (noise(Math.floor(col / 2) * 41.3 + Math.floor(row / 2) * 67.9) - 0.5) * 0.18;
          const baseDensity = outside
            ? 0.06 + tileSeed * 0.12
            : Math.max(
                0.12,
                Math.min(1, mix(0.96, 0.18, densityFalloff) + randomOffset + clusterNoise),
              );
          const wakeMask = 0.35 + edgeAmount * 0.65;
          const density = Math.min(1, baseDensity + wakeInfluence * wakeMask * 0.24);

          const transparencyFalloff = smoothstep(0.18, 1.08, edgeDistance);
          const alphaVariation = (tileSeed - 0.5) * 0.04;
          const edgeAlpha = Math.max(
            0.26,
            Math.min(0.94, mix(0.94, 0.28, transparencyFalloff) + alphaVariation),
          );
          const pulse = motionEnabled
            ? 0.86 + Math.sin(elapsed * 0.8 + progress * TAU) * 0.08
            : 1;
          const wakeAlpha = Math.min(0.94, edgeAlpha + wakeInfluence * wakeMask * 0.2);
          const baseAlpha = life * wakeAlpha * (reducedMotion.matches ? 0.9 : pulse);

          const drawX = tileX;
          let drawY = tileY;
          let pointerInfluence = 0;
          let scatterX: number | null = null;
          let scatterY = 0;
          let scatterDensity = 0;
          let scatterOpacity = 0;
          if (interactive && pointerActive && edgeAmount > 0.05) {
            const pointerDeltaX = tileX - pointerX;
            const pointerDeltaY = tileY - pointerY;
            const pointerDistance = Math.hypot(pointerDeltaX, pointerDeltaY);

            if (pointerDistance < 120 * graphicScale) {
              const proximity = 1 - smoothstep(
                10 * graphicScale,
                120 * graphicScale,
                pointerDistance,
              );
              const edgeMask = smoothstep(0.05, 0.78, edgeAmount);
              const influence = proximity * edgeMask;
              pointerInfluence = influence;
              const verticalDirection = Math.abs(pointerDeltaY) > 0.001
                ? Math.sign(pointerDeltaY)
                : tileSeed > 0.5 ? 1 : -1;
              const displacement = mix(6, 14, tileSeed) * influence * graphicScale;

              drawY += verticalDirection * displacement;

              if (baseDensity < 0.58 && tileSeed > 0.24 && influence > 0.06) {
                const scatterSeed = noise(tileSeed * 211.9 + bandIndex * 37.1);
                const scatterDistance = mix(24, 52, scatterSeed)
                  * Math.sqrt(influence)
                  * graphicScale;

                scatterX = tileX;
                scatterY = tileY + verticalDirection * scatterDistance;
                scatterDensity = mix(0.045, 0.13, scatterSeed);
                scatterOpacity = mix(0.42, 0.62, scatterSeed) * influence;
              }
            }
          }

          const interactionInfluence = Math.min(1, Math.max(pointerInfluence, wakeInfluence));
          const graphicOpacity = mix(restingOpacity, engagedOpacity, interactionInfluence);
          const alpha = baseAlpha * graphicOpacity;
          const scatterAlpha = alpha * scatterOpacity;

          drawHalftoneTile(drawX, drawY, tileSize, density, alpha, tileSeed, edgeAmount);
          if (scatterX !== null) {
            drawHalftoneTile(
              scatterX,
              scatterY,
              tileSize,
              scatterDensity,
              scatterAlpha,
              noise(tileSeed * 419.3 + 7.7),
              Math.max(0.72, edgeAmount),
            );
          }
        }
      }
    };

    function draw(now: number, forced = false): void {
      if (!running && !forced) return;
      const delta = Math.min(32, Math.max(0, now - lastTime));
      lastTime = now;
      if (motionEnabled) elapsed += delta / 1000;
      if (trail.length > 0) {
        trail = trail.filter((point) => elapsed - point.born <= 0.9);
      }

      ctx.clearRect(0, 0, width, height);
      for (let index = 0; index < BAND_COUNT; index += 1) {
        const progress = reducedMotion.matches
          || !animated
            ? (index + 0.5) / BAND_COUNT
            : fract(elapsed * 0.068 + index / BAND_COUNT);
        drawBand(index, progress);
      }

      if (!forced && motionEnabled && running) frame = requestAnimationFrame(draw);
    }

    const resize = (): void => {
      const rect = root.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingEnabled = false;
      draw(performance.now(), true);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!motionEnabled) return;
      const visible = entry?.isIntersecting ?? true;
      if (visible && !running) {
        running = true;
        lastTime = performance.now();
        frame = requestAnimationFrame(draw);
      } else if (!visible) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    const handlePointerMove = (event: PointerEvent): void => {
      if (!interactive || reducedMotion.matches || !finePointer.matches) return;

      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      pointerActive = inside;
      if (!inside) return;

      pointerX = x;
      pointerY = y;

      const distanceFromLast = Math.hypot(x - lastTrailX, y - lastTrailY);
      if (distanceFromLast >= 12 || elapsed - lastTrailTime >= 0.055) {
        trail.push({ x, y, born: elapsed });
        if (trail.length > 28) trail.shift();
        lastTrailX = x;
        lastTrailY = y;
        lastTrailTime = elapsed;
      }
    };
    const handlePointerExit = (): void => {
      pointerActive = false;
    };

    observer.observe(root);
    resizeObserver.observe(root);
    if (interactive) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("blur", handlePointerExit);
    }
    resize();
    if (motionEnabled) frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerExit);
    };
  }, [
    animated,
    colorMode,
    engagedOpacity,
    graphicCenterXRatio,
    graphicScale,
    interactive,
    restingOpacity,
  ]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      aria-label="Rising Levli pixel cuts"
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
