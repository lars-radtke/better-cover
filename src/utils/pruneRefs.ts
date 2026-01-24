import { REF_KEYS, type Refs } from "../types";

const warned = new Set<string>();

const isDev =
  typeof process !== "undefined" &&
  typeof process.env !== "undefined" &&
  process.env.NODE_ENV !== "production";

export function pruneRefs(refs: unknown): Refs {
  if (!refs || typeof refs !== "object") return {};

  const obj = refs as Record<string, unknown>;
  const pruned: Partial<Refs> = {};

  for (const k of REF_KEYS) {
    if (k in obj) {
      if (k === "image") {
        pruned[k] = obj[k] as React.RefObject<HTMLImageElement>;
      } else {
        pruned[k] = obj[k] as React.RefObject<HTMLDivElement>;
      }
    }
  }

  // Warn once per unknown key in dev
  if (isDev) {
    for (const key of Object.keys(obj)) {
      if (!(REF_KEYS as readonly string[]).includes(key) && !warned.has(key)) {
        warned.add(key);
        console.warn(
          `[Better Cover] Unknown refs key "${key}" passed.\n` +
            `Allowed keys are: ${REF_KEYS.join(", ")}.\n\n` +
            "Ref omitted.",
        );
      }
    }
  }

  return pruned as Refs;
}
