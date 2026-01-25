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
 * Measure an element's {@link Rectangle} relative to another element.
 *
 * @param element - The HTML element to measure.
 * @param relativeTo - The DOMRect to measure relative to.
 *
 * @returns The measured {@link Rectangle}.
 */
export const rectFromElement = (element: HTMLElement, relativeTo: DOMRect): Rectangle => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left - relativeTo.left,
    y: rect.top - relativeTo.top,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Compute an overlap between two ranges.
 * Return the intersected value nearest to the preferred value or null if no intersection exists.
 *
 * @param min1 - Minimum of the first range.
 * @param max1 - Maximum of the first range.
 * @param min2 - Minimum of the second range.
 * @param max2 - Maximum of the second range.
 * @param preferred - Preferred value within the intersection.
 *
 * @returns The intersected value nearest to the preferred value or null if no intersection exists.
 */
export const intersect = (
  min1: number,
  max1: number,
  min2: number,
  max2: number,
  preferred: number,
): number | null => {
  const min = Math.max(min1, min2);
  const max = Math.min(max1, max2);
  if (min <= max) {
    return clamp(preferred, min, max);
  }
  return null;
};

/** */
export const transform = (
  coverZone: Rectangle,
  targetZone: Rectangle,
  imageWidth: number,
  imageHeight: number,
  focusZone: Rectangle,
): Transform => {
  const coverWidth = coverZone.width;
  const coverHeight = coverZone.height;

  const targetX = targetZone.x;
  const targetY = targetZone.y;
  const targetHeight = targetZone.height;
  const targetWidth = targetZone.width;

  const focusX = focusZone.x;
  const focusY = focusZone.y;
  const focusHeight = focusZone.height;
  const focusWidth = focusZone.width;

  /**
   * Calculate minimum scale to cover the targetZone.
   * Equals the base calculation for CSS `object-fit: cover`.
   */

  const minimumCoverScale = Math.max(coverWidth / imageWidth, coverHeight / imageHeight);

  /**
   * Calculate focusZone size after applying minimumCoverScale.
   */

  const focusWidthBase = focusWidth * minimumCoverScale;
  const focusHeightBase = focusHeight * minimumCoverScale;

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

  const coverXMin = (scale: number) => coverWidth - imageWidth * scale;
  const coverXMax = (_scale: number) => 0;
  const coverYMin = (scale: number) => coverHeight - imageHeight * scale;
  const coverYMax = (_scale: number) => 0;

  /**
   * Preferred "default" translation: Mimic `object-position: 50% 50%`.
   */

  const defaultX = (scale: number) => (coverWidth - imageWidth * scale) / 2;
  const defaultY = (scale: number) => (coverHeight - imageHeight * scale) / 2;

  /**
   * The focusZone lives within the image.
   * For a given scale and translation (x, y):
   * - focusLeft = x + focusZoneX * scale
   * - focusRight = x + (focusZoneX + focusZoneWidth) * scale
   *
   * To keep the focusZone within the targetZone:
   * - focus's left edge must be at or right of target's left edge
   * - focus's right edge must be at or left of target's right edge
   *
   * Therefore:
   * xMin = targetX - focusX * scale
   * xMax = targetX + targetWidth - (focusX + focusWidth) * scale
   *
   * Same for y.
   */

  const focusXMin = (scale: number) => targetX - focusX * scale;
  const focusXMax = (scale: number) => targetX + targetWidth - (focusX + focusWidth) * scale;
  const focusYMin = (scale: number) => targetY - focusY * scale;
  const focusYMax = (scale: number) => targetY + targetHeight - (focusY + focusHeight) * scale;

  /**
   * If the focusZone is larger than the targetZone on an axis at the MINIMUM cover scale,
   * then it can NEVER fully fit inside the targetZone on that axis, because scaling UP would only
   * make the focusZone bigger.
   *
   * In such case:
   * - keep scale at minimumCoverScale (minimal)
   * - align both the focusZone and targetZone directional midpoints for symmetric overflow on both sides
   */

  const impossibleX = focusWidthBase > targetWidth;
  const impossibleY = focusHeightBase > targetHeight;

  if (impossibleX || impossibleY) {
    const scale = minimumCoverScale;

    // Default center positioning as starting point
    let translateX = defaultX(scale);
    let translateY = defaultY(scale);

    // Horizontal placement
    if (impossibleX) {
      // Midpoint alignment
      const focusMidX = (focusX + focusWidth / 2) * scale;
      const targetMidX = targetX + targetWidth / 2;
      translateX = targetMidX - focusMidX;
    } else {
      // Constrained placement, closest to default
      const intersectX = intersect(
        coverXMin(scale),
        coverXMax(scale),
        focusXMin(scale),
        focusXMax(scale),
        translateX,
      );

      if (intersectX !== null) {
        translateX = intersectX;
      } else {
        // Fallback to minimum cover placement
        translateX = clamp(translateX, coverXMin(scale), coverXMax(scale));
      }
    }

    // Vertical placement
    if (impossibleY) {
      // Midpoint alignment
      const focusMidY = (focusY + focusHeight / 2) * scale;
      const targetMidY = targetY + targetHeight / 2;
      translateY = targetMidY - focusMidY;
    } else {
      // Constrained placement, closest to default
      const intersectY = intersect(
        coverYMin(scale),
        coverYMax(scale),
        focusYMin(scale),
        focusYMax(scale),
        translateY,
      );

      if (intersectY !== null) {
        translateY = intersectY;
      } else {
        // Fallback to minimum cover placement
        translateY = clamp(translateY, coverYMin(scale), coverYMax(scale));
      }
    }

    // Safety clamp to ensure the image always covers the coverZone.
    translateX = clamp(translateX, coverXMin(scale), coverXMax(scale));
    translateY = clamp(translateY, coverYMin(scale), coverYMax(scale));

    return {
      scale,
      x: translateX,
      y: translateY,
    };
  }

  /**
   * For edge cases where translateX/translateY cannot satisfy both cover and containment simultaneously,
   * e. g. when the focusZone top left corner aligns with it's image top left corner while the
   * targetZone bottom right corner aligns with at the coverZones bottom right corner.
   *
   * In such cases, increase scale beyond minimumCoverScale.
   */

  /**
   * Maximum scale that still allows focusZone to fit by size:
   * - focusWidth * scale <= targetWidth  => scale <= targetWidth / focusWidth
   * - focusHeight * scale <= targetHeight  => scale <= targetHeight / focusHeight
   * => focusMaxFit is the smaller of the two.
   */
  const maximumScaleThatStillFitsTarget = Math.min(
    targetWidth / focusWidth,
    targetHeight / focusHeight,
  );

  /**
   * If the minimumCoverScale is already larger than the maximumScaleThatStillFitsTarget,
   * treat translation as impossible.
   */
  if (minimumCoverScale > maximumScaleThatStillFitsTarget) {
    const scale = minimumCoverScale;
    const safeCenterX = (focusX + focusWidth / 2) * scale;
    const safeCenterY = (focusY + focusHeight / 2) * scale;

    let translateX = targetX + targetWidth / 2 - safeCenterX;
    let translateY = targetY + targetHeight / 2 - safeCenterY;

    translateX = clamp(translateX, coverXMin(scale), coverXMax(scale));
    translateY = clamp(translateY, coverYMin(scale), coverYMax(scale));

    return { scale, x: translateX, y: translateY };
  }

  /**
   * For a given scale, check if:
   * - if the image covers the coverZone
   * - if the focusZone can be placed entirely within the targetZone
   *
   * If both checks pass, the given scale is feasable.
   */
  const feasableAtScale = (scale: number): boolean => {
    const intersectX = intersect(
      coverXMin(scale),
      coverXMax(scale),
      focusXMin(scale),
      focusXMax(scale),
      defaultX(scale),
    );
    const intersectY = intersect(
      coverYMin(scale),
      coverYMax(scale),
      focusYMin(scale),
      focusYMax(scale),
      defaultY(scale),
    );
    return intersectX !== null && intersectY !== null;
  };

  let scale = minimumCoverScale;

  /**
   * Binary search between minimumCoverScale and maximumScaleThatStillFitsTarget to find the smallest feasable scale.
   */
  if (!feasableAtScale(scale)) {
    let minimum = minimumCoverScale;
    let maximum = maximumScaleThatStillFitsTarget;
    let feasable = false;

    /**
     * Precision threshold: 0.0000001 => '1e-7'
     */
    const EPSILON = 1e-7;
    const MAX_ITERATIONS = 100;
    let iteration = 0;

    while (maximum - minimum > EPSILON && iteration < MAX_ITERATIONS) {
      const candidateScale = (minimum + maximum) / 2;

      if (feasableAtScale(candidateScale)) {
        // If candidateScale is feasable, search for smaller feasable scales
        feasable = true;
        maximum = candidateScale;
      } else {
        // If candidateScale is not feasable, search for larger scales
        minimum = candidateScale;
      }
      iteration++;
    }

    if (feasable) {
      scale = maximum;
    }
  }

  /**
   * Final selection (and failsafe) of translateX and translateY from the intersection closest to default.
   */

  const translateX =
    intersect(
      coverXMin(scale),
      coverXMax(scale),
      focusXMin(scale),
      focusXMax(scale),
      defaultX(scale),
    ) ?? clamp(defaultX(scale), coverXMin(scale), coverXMax(scale));

  const translateY =
    intersect(
      coverYMin(scale),
      coverYMax(scale),
      focusYMin(scale),
      focusYMax(scale),
      defaultY(scale),
    ) ?? clamp(defaultY(scale), coverYMin(scale), coverYMax(scale));

  return {
    scale,
    x: translateX,
    y: translateY,
  };
};
