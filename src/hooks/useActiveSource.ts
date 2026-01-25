import * as React from "react";
import { SourceElement } from "../components/Source";

/**
 * React hook to get the currently active Source based on media queries.
 */
export const useActiveSource = (sources: SourceElement[]): SourceElement | undefined => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const getActive = () => {
      for (let i = 0; i < sources.length; i++) {
        const media = sources[i].props.media;
        if (!media || window.matchMedia(media).matches) {
          return i;
        }
      }
      return 0;
    };

    const update = () => setActiveIndex(getActive());

    // Set up listeners for all media queries
    const mqls = sources
      .map(source => source.props.media)
      .filter(Boolean)
      .map(media => window.matchMedia(media as string));

    mqls.forEach(mql => mql.addEventListener("change", update));

    // Initial check
    update();

    return () => {
      mqls.forEach(mql => mql.removeEventListener("change", update));
    };
  }, [sources]);

  return sources[activeIndex];
};
