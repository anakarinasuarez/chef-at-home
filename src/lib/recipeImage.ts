// Deterministic, coherent stock photo for a recipe when no real photo is set.
// Builds a free loremflickr URL keyed by the dish name + cuisine so there is
// ALWAYS a food photo to show (the branded placeholder is only a last resort
// when even this fails to load). Pexels photos (when a key is set) are used
// first; this is the keyless fallback.

const STOP_WORDS = new Set([
  'with', 'and', 'the', 'for', 'a', 'an', 'of', 'in', 'on', 'to',
  'style', 'recipe', 'homemade', 'fresh', 'easy',
]);

export function recipeStockPhoto(
  title?: string,
  cuisine?: string,
  opts?: { w?: number; h?: number; seed?: string | number }
): string {
  const words = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .slice(0, 3);

  const terms = [...words, (cuisine || '').toLowerCase(), 'food'].filter(Boolean);
  const keyword = encodeURIComponent([...new Set(terms)].join(',')) || 'food';

  const seedStr = String(opts?.seed ?? title ?? 'recipe');
  const lock = Math.abs(
    Array.from(seedStr).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)
  );

  const w = opts?.w ?? 640;
  const h = opts?.h ?? 480;
  return `https://loremflickr.com/${w}/${h}/${keyword}?lock=${lock}`;
}
