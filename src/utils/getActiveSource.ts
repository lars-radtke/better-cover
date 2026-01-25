import { SourceElement } from "../components/Source";

export const getActiveSource = (sources: SourceElement[]) => {
  if (typeof window === "undefined") {
    return sources[0];
  }

  for (const source of sources) {
    const media = source.props.media;
    if (!media || window.matchMedia(media).matches) {
      return source;
    }
  }

  // Fallback
  return sources[0];
};
