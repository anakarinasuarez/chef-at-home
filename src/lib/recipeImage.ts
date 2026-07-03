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
  // Pick ONE food-ish keyword. loremflickr ANDs comma-separated tags and
  // returns a junk default image when the combo matches nothing, so we use a
  // single tag: the first meaningful dish word, else "food" (always resolves).
  const word =
    (title || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .find(w => w.length > 3 && !STOP_WORDS.has(w)) || 'food';
  const keyword = encodeURIComponent(word);

  const seedStr = String(opts?.seed ?? title ?? 'recipe');
  const lock = Math.abs(
    Array.from(seedStr).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)
  );

  const w = opts?.w ?? 640;
  const h = opts?.h ?? 480;
  return `https://loremflickr.com/${w}/${h}/${keyword}?lock=${lock}`;
}
