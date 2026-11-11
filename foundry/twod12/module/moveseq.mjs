// v0.0.274 (Lucas: Opportunity Attack fired once a turn): which Move Action a creature's movement belongs to. The book (Chapter 2, Reactions):
// "You can react only once to the same Action"; an Advance can be split into several drags, but a new Advance is a new Action. move.mjs counts
// a new one when a Move Action grants movement (Advance, Charge, Crawl: not an Evade) and when a drag spends AP (a drag with no Advance first);
// the Reactions (moment.mjs) offer a movement moment once per Reaction for each Move Action. Kept on the client that moves the token.
const seq = new Map();
/** A new Move Action starts for this combatant. */
export const newMoveAction = id => { if (id) seq.set(id, (seq.get(id) ?? 0) + 1); };
/** The Move Action the combatant's movement belongs to now. */
export const moveActionOf = id => seq.get(id) ?? 0;
