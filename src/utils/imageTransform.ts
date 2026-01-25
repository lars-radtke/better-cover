import type { Rectangle, Transform } from "../types";

/**
 * Clamp a number between a minimum and maximum value.
 *
 * @param value - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 *
 * @returns The clamped value.
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * This helper is used to pick a “best” translation of a set of valid
 * translations on an axis (e.g. translations that keep the image covering the coverZone
 * and/or keep the focusZone inside the targetZone).
 *
 * - If `preferred` is inside the interval, it is returned unchanged.
 * - If `preferred` is left of the interval, `min` is returned.
 * - If `preferred` is right of the interval, `max` is returned.
 * - If the interval is empty (`min > max`), no valid value exists. Returns `null`.
 *
 * @param min - Inclusive lower bound of the valid interval.
 * @param max - Inclusive upper bound of the valid interval.
 * @param preferred - The desired value (e.g. “center like object-position: 50%”).
 *
 * @returns A value within [min, max] closest to `preferred`, or `null` if [min, max] is empty.
 */
const pickClosestInInterval = (min: number, max: number, preferred: number): number | null => {
  if (min > max) return null;
  return clamp(preferred, min, max);
};

/**
 * Compute the scale and translation for an image so that:
 *
 * 1) The image always fully covers the coverZone (equal to CSS `object-fit: cover`).
 *    That means after transform:
 *      - imageLeft <= coverLeft
 *      - imageTop  <= coverTop
 *      - imageRight  >= coverRight
 *      - imageBottom >= coverBottom
 *
 * 2) The image is repositioned so that it's correlating (scaled) focusZone is contained within the targetZone
 *    if possible.
 *
 * 3) If the focusZone is too large to fit into the targetZone on an axis, containment is impossible
 *    on that axis for any larger scale. In that case:
 *      - align the focusZone midpoint with the targetZone midpoint on that axis
 *      - keep scaling/positioning such that the image still covers the coverZone
 *
 * @param coverZone - Rect describing the container that must be fully covered by the image.
 * @param targetZone - Rect inside the cover where the focusZone should be placed (cover-local).
 * @param imageWidth - Intrinsic/rendered base width used for math (must match the element before scaling).
 * @param imageHeight - Intrinsic/rendered base height used for math (must match the element before scaling).
 * @param focusZone - Rect inside the image that should land inside the targetZone (image coordinates).
 *
 * @returns Transform containing:
 *   - `scale`: scale factor to apply uniformly (preserves aspect ratio)
 *   - `x`, `y`: translation to apply before scale (top-left origin)
 */
export const transform = (
  coverZone: Rectangle,
  targetZone: Rectangle,
  imageWidth: number,
  imageHeight: number,
  focusZone: Rectangle,
): Transform => {
  const coverW = coverZone.width;
  const coverH = coverZone.height;

  const targetX = targetZone.x;
  const targetY = targetZone.y;
  const targetW = targetZone.width;
  const targetH = targetZone.height;

  const focusX = focusZone.x;
  const focusY = focusZone.y;
  const focusW = focusZone.width;
  const focusH = focusZone.height;

  const targetMidX = targetX + targetW / 2;
  const targetMidY = targetY + targetH / 2;

  const focusMidX = focusX + focusW / 2;
  const focusMidY = focusY + focusH / 2;

  /**
   * Calculate minimum scale to cover the targetZone.
   * Equals the base calculation for CSS `object-fit: cover`.
   */
  const minCoverScale = Math.max(coverW / imageWidth, coverH / imageHeight);

  /**
   * For a given scale:
   * - image spans from x to x + imageWidth * scale
   * - To cover the coverZone horizontally:
   *     - image's left edge must be at or left of cover's left edge
   *     - image's right edge must be at or right of cover's right edge
   *
   * Therefore:
   * xMin = coverWidth - imageWidth * scale
   * xMax = 0
   *
   * Same for y.
   */
  const coverXMin = (s: number) => coverW - imageWidth * s;
  const coverXMax = (_s: number) => 0;
  const coverYMin = (s: number) => coverH - imageHeight * s;
  const coverYMax = (_s: number) => 0;

  /**
   * Preferred "default" translation: Mimic `object-position: 50% 50%`.
   */
  const defaultX = (s: number) => (coverW - imageWidth * s) / 2;
  const defaultY = (s: number) => (coverH - imageHeight * s) / 2;

  /**
   * To keep a vlid sized focusZone within the targetZone:
   * - focus's left edge must be at or right of target's left edge
   * - focus's right edge must be at or left of target's right edge
   *
   * Therefore:
   * xMin = targetX - focusX * scale
   * xMax = targetX + targetWidth - (focusX + focusWidth) * scale
   *
   * Same for y.
   */
  const focusXMin = (s: number) => targetX - focusX * s;
  const focusXMax = (s: number) => targetX + targetW - (focusX + focusW) * s;
  const focusYMin = (s: number) => targetY - focusY * s;
  const focusYMax = (s: number) => targetY + targetH - (focusY + focusH) * s;

  /**
   * Solve placement at scale s.
   * - If focus fits on an axis: it MUST be fully inside target on that axis (no fallback).
   * - If focus does NOT fit on an axis: align midpoints on that axis (rule #3), and DO NOT clamp;
   *   if that alignment breaks cover bounds -> infeasible -> scale up.
   */
  const solveAtScale = (s: number): { x: number; y: number } | null => {
    const xMinC = coverXMin(s);
    const xMaxC = coverXMax(s);
    const yMinC = coverYMin(s);
    const yMaxC = coverYMax(s);

    // ---- X axis
    let x: number | null = null;
    const focusFitsX = focusW * s <= targetW;

    if (focusFitsX) {
      const xMin = Math.max(xMinC, focusXMin(s));
      const xMax = Math.min(xMaxC, focusXMax(s));
      x = pickClosestInInterval(xMin, xMax, defaultX(s));
      if (x === null) return null;
    } else {
      // center-align (symmetric overflow)
      const desired = targetMidX - focusMidX * s;
      if (desired < xMinC || desired > xMaxC) return null; // no clamping here!
      x = desired;
    }

    // ---- Y axis
    let y: number | null = null;
    const focusFitsY = focusH * s <= targetH;

    if (focusFitsY) {
      const yMin = Math.max(yMinC, focusYMin(s));
      const yMax = Math.min(yMaxC, focusYMax(s));
      y = pickClosestInInterval(yMin, yMax, defaultY(s));
      if (y === null) return null;
    } else {
      const desired = targetMidY - focusMidY * s;
      if (desired < yMinC || desired > yMaxC) return null;
      y = desired;
    }

    return { x, y };
  };

  /**
   * If there are conflicting constraints at minCoverScale, find a feasible scale by growing.
   */
  let low = minCoverScale;
  let high = low;
  let sol = solveAtScale(high);

  let growIter = 0;
  const MAX_GROW = 80;
  while (sol === null && growIter < MAX_GROW) {
    high *= 1.25;
    sol = solveAtScale(high);
    growIter++;
  }

  // Fallback
  if (sol === null) {
    const s = minCoverScale;
    return {
      scale: s,
      x: clamp(defaultX(s), coverXMin(s), coverXMax(s)),
      y: clamp(defaultY(s), coverYMin(s), coverYMax(s)),
    };
  }
  /**
   * Binary search between minimumCoverScale and maximumScaleThatStillFitsTarget to find the smallest feasable scale.
   * Precision threshold: 0.0000001 => '1e-7'
   */
  const EPSILON = 1e-7;
  for (let i = 0; i < 90 && high - low > EPSILON; i++) {
    const mid = (low + high) / 2;
    if (solveAtScale(mid) !== null) high = mid;
    else low = mid;
  }

  const scale = high;
  const final = solveAtScale(scale)!;

  return {
    scale,
    x: final.x,
    y: final.y,
  };
};
