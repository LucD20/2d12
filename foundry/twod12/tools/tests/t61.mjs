// Run with: node tools/tests/run.mjs (or node tools/tests/t61.mjs)
const ROOT = decodeURIComponent(new URL("../../", import.meta.url).pathname);
const { evalExpr, hasNamed } = await import(ROOT + "module/refs.mjs");
const mk = (names, speed = 5) => ({ system: { speed, attributes: {}, level: 1 }, items: names.map(name => ({ name })), effects: [{ name: "Rimebrand (1d6)" }] });
const plain = mk([]), talented = mk(["Battering Charge"]);
const e = "speed+2*has(Battering Charge)";
console.log("without the Talent:", evalExpr(e, plain), "| with it:", evalExpr(e, talented), "| Speed 4 with it:", evalExpr(e, mk(["Battering Charge"], 4)));
console.log("spaces and case don't matter:", hasNamed(talented, "battering   CHARGE"), "| a different Talent:", hasNamed(talented, "Bloodlust"));
console.log("an effect by its base name:", hasNamed(plain, "Rimebrand"), "| the old forms still work:", evalExpr("walk/2", plain), evalExpr("3", plain), evalExpr("speed", plain));
console.log("unknown names are 0:", evalExpr("speed+3*has(Nothing)", plain));
