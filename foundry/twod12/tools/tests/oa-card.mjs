// v0.0.407 (Stage 0 in Foundry): Opportunity Attack is no longer a Basic Action (book/cards/set-aside.txt); its card stays in
// book/cards/basic-actions.json (book/cards/set-aside/talents.json since the cleanup audit, 2026-11-26: it comes back as a Talent). The tests that check its moment and its granted Weapon Attack read it from the card, as gen-basic.mjs would.
globalThis.foundry ??= {}; globalThis.foundry.applications ??= { api: { DialogV2: {}, ApplicationV2: class {} } };   // gen.mjs reads it at load
const { loadCards, basicEntry } = await import(new URL("../cardgen.mjs", import.meta.url).href);
export const OA = basicEntry(loadCards(undefined, { setAside: true }).find(c => c.foundry?.basic === "opportunityAttack"));
export const OA_IS_BASIC = "opportunityAttack" in (await import(new URL("../../module/basic-data.mjs", import.meta.url).href)).BASIC_ACTIONS;
