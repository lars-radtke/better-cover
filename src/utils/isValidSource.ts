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
  if (!React.isValidElement(child) || child.type !== Source) return false;

  const { size, focusZone } = child.props as SourceProps;

  // Check for required props
  if (!size || !focusZone) return false;

  // Check for non-positive values in size
  if (size.width <= 0 || size.height <= 0) return false;

  // Check for negative values in focusZone position and non-positive values in focusZone size
  if (focusZone.x < 0 || focusZone.y < 0 || focusZone.width <= 0 || focusZone.height <= 0)
    return false;

  // Check that focusZone does not exceed size boundaries
  if (focusZone.x + focusZone.width > size.width || focusZone.y + focusZone.height > size.height)
    return false;

  return true;
}
