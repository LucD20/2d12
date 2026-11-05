// The Bestiary's tables as they were before pack R-bestiary (2026-11-05): a frozen copy of foundry/twod12/module/config.mjs npcRoles
// (the Health Multipliers and the Basic attack averages by Stage and rating, E3's tables of v0.0.181). spec.mjs reads these by default
// (RULES.bestiary "today"), so report.md and the pre-R scripts don't move when the live tables change; RULES.bestiary "r" reads config.mjs
// (the tables pack R-bestiary writes: rbestiary.mjs, rclasses.mjs). Don't edit: it is history.
export const ROLES = {
  minion: { hm: [[0, 0.75, 1, 1.25], [0, 1, 1.25, 1.5], [0, 1.25, 1.75, 2.25]],
    basic: [[[1.5, 3.5], [2, 5], [3, 5.5], [3.5, 7]], [[1.5, 4], [2.5, 6], [3.5, 6.5], [4, 8.5]], [[2, 5], [3, 6.5], [4, 7.5], [5, 9.5]]] },
  grunt: { hm: [[2, 3, 4.25, 5.25, 6.25], [2.5, 3.75, 4.75, 6, 7.25], [3.25, 5, 6.75, 8.25, 10]],
    basic: [[[3, 4], [3.5, 5], [4, 6], [5.5, 7.5], [6, 9.5]], [[3.5, 5], [4, 6], [5, 7.5], [6.5, 9.5], [7.5, 12]], [[4, 6], [5, 6.5], [6, 8.5], [7.5, 10.5], [8.5, 13.5]]] },
  standard: { hm: [[3.75, 5.75, 7.75, 9.75, 11.5], [4.5, 6.75, 9, 11.25, 13.5], [6.25, 9.25, 12.5, 15.5, 18.75]],
    basic: [[[4, 6], [5, 8.5], [6, 11], [7.5, 13], [9.5, 16]], [[5, 7.5], [6, 10], [7.5, 13.5], [9.5, 16], [12, 19.5]], [[6, 8.5], [6.5, 11.5], [8.5, 15.5], [10.5, 18], [13.5, 22]]] },
  elite: { hm: [[6.5, 10, 13.25, 16.5, 19.75], [7.75, 11.5, 15.5, 19.25, 23.25], [10.75, 16, 21.25, 26.75, 32]],
    basic: [[[4, 6], [5.5, 9], [7, 11], [9, 13.5], [10.5, 15.5]], [[5, 7.5], [7, 11], [9, 13.5], [11, 16.5], [12.5, 19]], [[5.5, 8.5], [8, 12], [10, 15], [12, 18.5], [14.5, 21.5]]] }
};
const COL = { terrible: 0, low: 1, medium: 2, high: 3, extreme: 4 };
const stageOf = lv => { const l = Math.trunc(Number(lv)) || 0; return l >= 8 ? 3 : l >= 5 ? 2 : 1; };
const col = (role, rating) => Math.min(ROLES[role].hm[0].length - 1, COL[rating] ?? 2);
const r5 = x => Math.round(x * 2) / 2;
export const npcHm = (role, rating, lv) => (ROLES[role] ?? ROLES.standard).hm[stageOf(lv) - 1][col(role in ROLES ? role : "standard", rating)];
export const npcDamage = (role, rating, lv, x = 1) => (ROLES[role] ?? ROLES.standard).basic[stageOf(lv) - 1][col(role in ROLES ? role : "standard", rating)].map(v => r5(v * x));
