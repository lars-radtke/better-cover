"use client";

import * as React from "react";
import { Screen } from "../types";

/**
 * Get the current screen information including size, device pixel ratio and orientation.
 */
function getScreen(): Screen {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const height = typeof window !== "undefined" ? window.innerHeight : 0;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const orientation = height >= width ? "portrait" : "landscape";

  return {
    width,
    height,
    dpr,
    orientation,
  };
}

/**
 * React hook to get the current screen information including size, device pixel ratio and orientation.
 *
 * A square screen returns 'portrait' orientation.
 */
export function useScreen(): Screen {
  const [screen, setScreen] = React.useState<Screen>(getScreen());

  React.useEffect(() => {
    const onChange = () => setScreen(getScreen());

    window.addEventListener("resize", onChange, { passive: true });
    window.addEventListener("orientationchange", onChange);

    /**
     * Viewport can change without having focus (e.g. monitor switch, zooming, mobile UI),
     * thus not triggering 'resize' ororientationchange' events.
     *
     * Trigger a screen update once the window regains focus.
     */
    const onFocus = () => onChange();
    window.addEventListener("focus", onFocus);

    /**
     * Viewport can change while the tab is not visible, thus not triggering 'resize' or
     * orientationchange' events.
     *
     * Trigger a screen update once the tab becomes active.
     */
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        onChange();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return screen;
}
