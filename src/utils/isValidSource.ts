import * as React from "react";
import { Source, SourceProps } from "../components/Source";

/**
 * Validates if the provided child is a viable {@link Source} element.
 *
 * Additional checks:
 * - No non-positive values in size and focusZone Size _(<= 0)_.
 * - No negative values in focusZone Position (< 0).
 * - focusZone must not exceed size boundaries.
 */
export function isValidSource(
  child: React.ReactNode,
): child is React.ReactElement<SourceProps, typeof Source> {
  const isDev =
    typeof process.env.NODE_ENV === "undefined" || process.env.NODE_ENV !== "production";

  if (!React.isValidElement(child) || child.type !== Source) {
    if (isDev) console.warn("isValidSource: Child is not a valid Source element.");
    return false;
  }

  const { size, focusZone, srcSet } = child.props as SourceProps;

  if (!size || !focusZone) {
    if (isDev)
      console.warn(
        "isValidSource: Missing required props:",
        !size && `'size'${!focusZone ? "," : ""}`,
        !focusZone && "'focusZone'",
        [].join(" "),
      );
    return false;
  }

  if (size.width <= 0 || size.height <= 0) {
    if (isDev) console.warn("isValidSource: 'size' must have positive width and height.", size);
    return false;
  }

  if (focusZone.x < 0 || focusZone.y < 0) {
    if (isDev)
      console.warn("isValidSource: 'focusZone' position (x, y) must not be negative.", focusZone);
    return false;
  }

  if (focusZone.width <= 0 || focusZone.height <= 0) {
    if (isDev)
      console.warn("isValidSource: 'focusZone' width and height must be positive.", focusZone);
    return false;
  }

  if (focusZone.x + focusZone.width > size.width || focusZone.y + focusZone.height > size.height) {
    if (isDev)
      console.warn("isValidSource: 'focusZone' exceeds 'size' boundaries.", { size, focusZone });
    return false;
  }

  if (typeof srcSet === "string" && /\s\d+w(,|\s|$)/.test(srcSet)) {
    if (isDev)
      console.warn(
        "isValidSource: 'srcSet' contains width descriptors (e.g., '100w'), which are not allowed.",
        srcSet,
      );
    return false;
  }

  return true;
}
