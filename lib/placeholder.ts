/**
 * Deterministic, on-brand gradient placeholders — used until real photos are
 * uploaded through /admin. Never generic stock imagery: each placeholder is
 * derived from the site's own ink/gold/ember palette so empty states still
 * feel intentional rather than broken.
 */

const PALETTES = [
  ["#1b1712", "#3a2c1c", "#c9a15a"],
  ["#181410", "#4a2a1f", "#b5502f"],
  ["#15120f", "#332a20", "#e4be7c"],
  ["#141110", "#2c241d", "#8a6a3f"],
  ["#17130f", "#402f1e", "#d9a86c"],
];

export function placeholderGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const [c1, c2, c3] = PALETTES[hash % PALETTES.length];
  const angle = 25 + (hash % 130);
  return `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 55%, ${c3} 130%)`;
}
