/** The detection modes of a token as a list (an array, a collection or a record keyed by id, whichever this Foundry gives). */
export const modeList = raw => (Array.isArray(raw) ? raw : raw?.contents ? [...raw.contents] : (raw && typeof raw === "object") ? Object.entries(raw).map(([id, m]) => ({ id: m?.id ?? id, ...(m ?? {}) })) : []);
