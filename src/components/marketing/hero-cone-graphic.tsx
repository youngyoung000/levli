"use client";

import { useEffect, useRef } from "react";
import styles from "./hero-cone-graphic.module.css";

const TAU = Math.PI * 2;
const LINE_COUNT = 9;
const PLANE_LINE_COUNT = 7;
const RING_COUNT = 3;
const RING_DURATION = 7_200;
const DOT_DURATION = 8_500;
const CONE_LINE_DURATION = 20_000;
const PLANE_LINE_DURATION = 34_000;
const APEX_Y = 539;
const CONE_TOP_Y = 68;
const TOP_ELLIPSE_CENTER_Y = 63.5;
const TOP_RADIUS_X = 272;
const ELLIPSE_RATIO = 63 / 272;
const CONE_SLOPE = TOP_RADIUS_X / (APEX_Y - CONE_TOP_Y);

type RingRefs = {
  dot: SVGCircleElement | null;
  ellipse: SVGEllipseElement | null;
};

type PlaneBounds = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function rayLimit(
  originX: number,
  originY: number,
  directionX: number,
  directionY: number,
  bounds: PlaneBounds,
): number {
  const limits: number[] = [];

  if (directionX > 0) limits.push((bounds.right - originX) / directionX);
  if (directionX < 0) limits.push((bounds.left - originX) / directionX);
  if (directionY > 0) limits.push((bounds.bottom - originY) / directionY);
  if (directionY < 0) limits.push((bounds.top - originY) / directionY);

  const validLimits = limits.filter((limit) => limit >= 0);
  return validLimits.length > 0 ? Math.max(0, Math.min(...validLimits)) : 0;
}

export function HeroConeGraphic({ className }: { className?: string | undefined }): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const planeLineRefs = useRef<Array<SVGLineElement | null>>([]);
  const ringRefs = useRef<RingRefs[]>(
    Array.from({ length: RING_COUNT }, () => ({ dot: null, ellipse: null })),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    let hovering = false;
    let lineRotation = 0.085;
    let planeRotation = 0.03;
    let previousFrameTime = performance.now();
    let planeBounds: PlaneBounds = { bottom: 650, left: -900, right: 900, top: -120 };

    const updatePlaneBounds = (): void => {
      const hero = root.parentElement;
      if (!hero) return;
      const rootRect = root.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const scaleX = rootRect.width / 545;
      const scaleY = rootRect.height / 541;
      const inset = 12;
      if (scaleX <= 0 || scaleY <= 0) return;

      planeBounds = {
        bottom: (heroRect.bottom - inset - rootRect.top) / scaleY,
        left: (heroRect.left + inset - rootRect.left) / scaleX,
        right: (heroRect.right - inset - rootRect.left) / scaleX,
        top: (heroRect.top + inset - rootRect.top) / scaleY,
      };
    };

    const render = (time: number): void => {
      const motionTime = reducedMotion.matches ? 2_650 : time;
      const frameDelta = Math.min(64, Math.max(0, time - previousFrameTime));
      previousFrameTime = time;
      if (!reducedMotion.matches) {
        lineRotation += (frameDelta / CONE_LINE_DURATION) * (hovering ? 0.6 : 1);
        planeRotation += frameDelta / PLANE_LINE_DURATION;
      }
      const lineTurn = reducedMotion.matches ? 0.085 : lineRotation;
      const planeTurn = reducedMotion.matches ? 0.03 : planeRotation;

      planeLineRefs.current.forEach((line, index) => {
        if (!line) return;
        const angle = (index / PLANE_LINE_COUNT + planeTurn) * Math.PI;
        const directionX = Math.cos(angle);
        const directionY = Math.sin(angle) * 0.22;
        const forward = rayLimit(272.433, 539, directionX, directionY, planeBounds);
        const backward = rayLimit(272.433, 539, -directionX, -directionY, planeBounds);

        line.setAttribute("x1", (272.433 - directionX * backward).toFixed(2));
        line.setAttribute("y1", (539 - directionY * backward).toFixed(2));
        line.setAttribute("x2", (272.433 + directionX * forward).toFixed(2));
        line.setAttribute("y2", (539 + directionY * forward).toFixed(2));
      });

      lineRefs.current.forEach((line, index) => {
        if (!line) return;
        const angle = (index / LINE_COUNT + lineTurn) * TAU;
        const endX = 272.433 + Math.cos(angle) * 271.5;
        const endY = 63.5 + Math.sin(angle) * 63;
        const depth = (Math.sin(angle) + 1) * 0.5;

        line.setAttribute("x2", endX.toFixed(2));
        line.setAttribute("y2", endY.toFixed(2));
        line.setAttribute("opacity", (0.12 + depth * 0.18).toFixed(3));
      });

      ringRefs.current.forEach(({ dot, ellipse }, index) => {
        if (!ellipse || !dot) return;

        const phase = index / RING_COUNT;
        const progress = reducedMotion.matches
          ? fract(phase + 0.16)
          : fract(motionTime / RING_DURATION + phase);
        const centerY = lerp(APEX_Y, TOP_ELLIPSE_CENTER_Y, progress);
        const availableWidth = Math.min(
          TOP_RADIUS_X,
          ((APEX_Y - centerY) / (APEX_Y - CONE_TOP_Y)) * TOP_RADIUS_X,
        );
        const tilt = lerp(30, 0, progress);
        const tiltRadians = tilt * (Math.PI / 180);
        const cosTilt = Math.cos(tiltRadians);
        const sinTilt = Math.sin(tiltRadians);
        const rightSupport = Math.sqrt(
          (cosTilt + CONE_SLOPE * sinTilt) ** 2
          + (ELLIPSE_RATIO * (-sinTilt + CONE_SLOPE * cosTilt)) ** 2,
        );
        const leftSupport = Math.sqrt(
          (-cosTilt + CONE_SLOPE * sinTilt) ** 2
          + (ELLIPSE_RATIO * (sinTilt + CONE_SLOPE * cosTilt)) ** 2,
        );
        const radiusX = availableWidth === 0
          ? 0
          : (2 * availableWidth) / (rightSupport + leftSupport);
        const radiusY = radiusX * ELLIPSE_RATIO;
        const centerX = 272.433 + availableWidth - radiusX * rightSupport;
        const opacity = Math.sin(Math.PI * progress) * 0.8;
        const dotAngle = motionTime / DOT_DURATION * TAU + index * (TAU / RING_COUNT);
        const localDotX = Math.cos(dotAngle) * radiusX;
        const localDotY = Math.sin(dotAngle) * radiusY;
        const dotX = centerX
          + localDotX * cosTilt
          - localDotY * sinTilt;
        const dotY = centerY
          + localDotX * sinTilt
          + localDotY * cosTilt;

        ellipse.setAttribute("cx", centerX.toFixed(2));
        ellipse.setAttribute("cy", centerY.toFixed(2));
        ellipse.setAttribute("rx", radiusX.toFixed(2));
        ellipse.setAttribute("ry", radiusY.toFixed(2));
        ellipse.setAttribute("opacity", opacity.toFixed(3));
        ellipse.setAttribute("transform", `rotate(${tilt.toFixed(2)} ${centerX.toFixed(2)} ${centerY.toFixed(2)})`);
        dot.setAttribute("cx", dotX.toFixed(2));
        dot.setAttribute("cy", dotY.toFixed(2));
        dot.setAttribute("opacity", opacity.toFixed(3));
      });

      if (!reducedMotion.matches && visible) frame = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(render);
    });

    const resizeObserver = new ResizeObserver(updatePlaneBounds);
    resizeObserver.observe(root);
    if (root.parentElement) resizeObserver.observe(root.parentElement);
    updatePlaneBounds();
    observer.observe(root);
    render(performance.now());

    const handlePointerEnter = (): void => { hovering = true; };
    const handlePointerLeave = (): void => { hovering = false; };
    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointerleave", handlePointerLeave);

    const handleMotionChange = (): void => {
      cancelAnimationFrame(frame);
      render(performance.now());
    };
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ""}`} aria-hidden="true">
      <svg
        className={styles.svg}
        fill="none"
        viewBox="0 0 545 541"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className={styles.planeLines}>
          {Array.from({ length: PLANE_LINE_COUNT }, (_, index) => (
            <line
              key={index}
              ref={(node) => { planeLineRefs.current[index] = node; }}
              x1="-1427.567"
              x2="1972.433"
              y1="539"
              y2="539"
            />
          ))}
        </g>

        <g className={styles.rotatingLines}>
          {Array.from({ length: LINE_COUNT }, (_, index) => (
            <line
              key={index}
              ref={(node) => { lineRefs.current[index] = node; }}
              x1="272.433"
              x2="272.433"
              y1="539"
              y2="0.5"
            />
          ))}
        </g>

        <path
          className={styles.outerEllipse}
          d="M272.433 0.5C347.517 0.5 415.478 7.6057 464.653 19.0859C489.244 24.8269 509.11 31.6557 522.816 39.2207C529.669 43.0033 534.959 46.9577 538.531 51.0322C542.099 55.1036 543.933 59.271 543.933 63.5C543.933 67.729 542.099 71.8964 538.531 75.9678C534.959 80.0423 529.669 83.9967 522.816 87.7793C509.11 95.3443 489.244 102.173 464.653 107.914C415.478 119.394 347.517 126.5 272.433 126.5C197.349 126.5 129.388 119.394 80.2133 107.914C55.6221 102.173 35.7562 95.3443 22.0502 87.7793C15.197 83.9967 9.90678 80.0423 6.33533 75.9678C2.7667 71.8964 0.932983 67.729 0.932983 63.5C0.932983 59.271 2.7667 55.1036 6.33533 51.0322C9.90678 46.9577 15.197 43.0033 22.0502 39.2207C35.7562 31.6557 55.6221 24.8269 80.2133 19.0859C129.388 7.6057 197.349 0.5 272.433 0.5Z"
        />
        <path className={styles.outerCone} d="M1.127 68L272.433 539L543.739 68" />

        <g className={styles.rings}>
          {Array.from({ length: RING_COUNT }, (_, index) => (
            <g key={index}>
              <ellipse
                ref={(node) => { ringRefs.current[index]!.ellipse = node; }}
                cx="272.433"
                cy="434"
                rx="45"
                ry="10.5"
              />
              <circle
                ref={(node) => { ringRefs.current[index]!.dot = node; }}
                cx="317.433"
                cy="434"
                r="2.25"
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
