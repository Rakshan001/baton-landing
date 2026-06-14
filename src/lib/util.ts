/** Brand accent (amber baton-in-the-dark). Single source of truth. */
export const ACCENT = "#FFA028";
export const CYAN = "#62D9EC";

/** hex -> {r,g,b} (ported from baton-shared.jsx). */
export function hexRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
