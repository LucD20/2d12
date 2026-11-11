/** The detection modes of a token as a list (an array, a collection or a record keyed by id, whichever this Foundry gives). */
export const modeList = raw => (Array.isArray(raw) ? raw : raw?.contents ? [...raw.contents] : (raw && typeof raw === "object") ? Object.entries(raw).map(([id, m]) => ({ id: m?.id ?? id, ...(m ?? {}) })) : []);

/**
 * v0.0.319 (Lucas: a Blinded Grave Wisp still had no Hearing): a token's detection modes with Hearing added, in the shape this Foundry stores
 * (a list, or a record keyed by id). Returns { changed, value }: value is what to write to `detectionModes` (or to set in memory).
 */
export function withMode(raw, id, entry = { enabled: true, range: null }) {
  if (modeList(raw).some(m => m.id === id)) return { changed: false, value: raw };
  if (Array.isArray(raw) || raw?.contents || raw == null) return { changed: true, value: [...modeList(raw), { id, ...entry }] };
  return { changed: true, value: { ...raw, [id]: { id, ...entry } } };
}
