"use client";

import * as React from "react";
import { Rectangle } from "../types";

/**
 * React hook to get the current size of a passed HTML element.
 *
 * @param ref - React ref object pointing to the HTML element.
 */
export function useElementRect<T extends HTMLElement | null>(ref: React.RefObject<T>) {
  const [rect, setRect] = React.useState<Rectangle | null>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getElementRect = () => {
      const { x, y, width, height } = element.getBoundingClientRect();
      setRect({ x, y, width, height });
    };

    getElementRect();

    const resizeObserver = new ResizeObserver(() => getElementRect());
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return rect;
}
