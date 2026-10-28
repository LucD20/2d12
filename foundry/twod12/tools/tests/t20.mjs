// Run with: node tools/tests/run.mjs (or node tools/tests/t20.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
class FakeCombat { setupTurns() { this.turns = this._c.slice().sort((a, b) => b.initiative - a.initiative); this.current = {}; return this.turns; } }
globalThis.Combat = FakeCombat;
globalThis.CONST = { TOKEN_DISPOSITIONS: { FRIENDLY: 1 } };
globalThis.foundry = { applications: { api: { DialogV2: {} } } };
globalThis.Hooks = { on() {} };
globalThis.game = { combat: null, user: {} };
const { zipper, TwoD12Combat } = await import(ROOT + "module/combat.mjs");
const mk = (name, init, disp) => ({ id: name, name, initiative: init, token: { disposition: disp }, actor: { type: disp === 1 ? "character" : "npc" } });
const pcs = [mk("PC1", 14, 1), mk("PC2", 13, 1), mk("PC3", 10, 1)], npcs = [mk("NPC1", 12, -1), mk("NPC2", 10, -1)];
const sorted = a => a.slice().sort((x, y) => y.initiative - x.initiative);
console.log("example:", zipper(sorted([...pcs, ...npcs])).map(c => c.name).join(", "), "(expected PC1, NPC1, PC2, NPC2, PC3)");
const n2 = [mk("NPC1", 20, -1), mk("NPC2", 9, -1)];
console.log("NPC highest:", zipper(sorted([...pcs, ...n2])).map(c => c.name).join(", "));
console.log("one side only:", zipper(sorted(n2)).map(c => c.name).join(", "), "| uneven:", zipper(sorted([mk("PC1", 5, 1), mk("A", 9, -1), mk("B", 8, -1), mk("C", 7, -1)])).map(c => c.name).join(", "));
console.log("tie goes to the party:", zipper(sorted([mk("PC1", 12, 1), mk("N1", 12, -1)])).map(c => c.name).join(", "));
const c = new TwoD12Combat(); c._c = [...pcs, ...npcs]; c.turn = 1;
c.setupTurns(); console.log("setupTurns order:", c.turns.map(x => x.name).join(","), "| current:", c.current.combatantId);
