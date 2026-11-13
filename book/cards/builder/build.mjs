// Builds the Action Builder page: node book/cards/builder/build.mjs
// It reads the data again (builder-data.mjs: the budgets' reports, the Bestiary's tables, the cards), pastes the system's calc.mjs and the ruler's price
// functions into the page, and writes data.json and action-builder.html (the file published as the Artifact). test.mjs checks the numbers.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collect } from "../builder-data.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.join(HERE, "..", "..", "..");
const rd = f => fs.readFileSync(path.join(HERE, f), "utf8");

/** The pieces of the page: the data block, the system's calc.mjs as a plain script (CALC), and the engine with the ruler's price functions pasted in. */
export async function assemble() {
  const data = await collect();
  data.audit = JSON.parse(rd("audit.json"));   // the class audit shown in its own tab (2026-11-13: the Paladin)
  const calc = fs.readFileSync(path.join(ROOT, "foundry", "twod12", "module", "calc.mjs"), "utf8");
  if (/^\s*import /m.test(calc)) throw new Error("calc.mjs now imports something: the page can't paste it as it is");
  const calcSrc = `const CALC = (function () {\n${calc.replace(/^export /gm, "")}\nreturn { tierProbs, critProb, tierOf, bbFive, keepThree };\n})();`;
  const fn = Object.entries(data.npc.fn).map(([k, src]) => (/^function /.test(src) ? src : `const ${k} = ${src};`)).join("\n  ");
  const engineSrc = rd("engine.js").replace("/*@@NPC_FN@@*/", () => fn);
  const { fn: _, ...npc } = data.npc;
  return { data: { ...data, npc }, full: data, calcSrc, engineSrc };
}
/** The engine as a live object, for Node (test.mjs). */
export async function engine() {
  const a = await assemble();
  return { ...a, E: new Function(`${a.calcSrc}\n${a.engineSrc}\nreturn makeEngine(${JSON.stringify(a.data)}, CALC);`)() };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = await assemble(), json = JSON.stringify(a.data).replace(/<\//g, "<\\/");
  fs.writeFileSync(path.join(HERE, "data.json"), JSON.stringify(a.full, null, 1) + "\n");
  const page = rd("template.html").replace("/*@@DATA@@*/", () => `const DATA = ${json};`).replace("/*@@CALC@@*/", () => a.calcSrc).replace("/*@@ENGINE@@*/", () => a.engineSrc).replace("/*@@UI@@*/", () => rd("ui.js"));
  fs.writeFileSync(path.join(HERE, "action-builder.html"), page);
  console.log(`action-builder.html: ${Math.round(page.length / 1024)} KB (data of ${a.data.generated}; ${a.data.cards.length} cards)`);
}
