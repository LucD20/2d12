# Level 1 rating tables for the Bestiary draft (v3): one table per stat per role, LEVELS as rows, RATINGS as columns (level 1 filled, the rest empty).
# The Defense table has ONE value per rating (you pick a rating for Armor Defense and one for Ward Defense, independently). Never below 11.
STEP = {"Terrible": .6, "Low": .8, "Medium": 1, "High": 1.2, "Extreme": 1.4}
HSTEP = {"Terrible": .5, "Low": .75, "Medium": 1, "High": 1.25, "Extreme": 1.5}
OFF = {"Terrible": -2, "Low": -1, "Medium": 0, "High": 1, "Extreme": 2}
r5 = lambda x: round(x * 2) / 2
roles = {
  "Minions":   dict(basic=(2, 4),     hm=1,  hb=1, attr=0, defense=12, extreme=False),
  "Grunts":    dict(basic=(3, 4.5),   hm=5,  hb=3, attr=0, defense=13, extreme=True),
  "Standards": dict(basic=(4.5, 7.5), hm=7,  hb=4, attr=1, defense=13, extreme=True),
  "Elites":    dict(basic=(6.5, 10),  hm=12, hb=6, attr=2, defense=14, extreme=True),
}
LEVELS = [1, 2, 3, 4]
# Level scaling (2026-10-24, from ruler/levels.mjs): NPC Health follows the PCs' sustained damage (so a fight takes as many rounds),
# NPC damage follows the PCs' Health Pool (so a PC goes Down after as many hits). Level 4 has no PC level yet: its row stays empty.
MEASURED_H = {1: 1.0, 2: 1.14, 3: 1.14}          # the PCs' best sustained damage, level 1 = 1 (AD 13, Paladin and Archer): ruler/levels.mjs
MEASURED_D = {1: 1.0, 2: 12 / 11, 3: 13 / 11}    # the PCs' Health factor (Level / 10 + 1), level 1 = 1
BUMP = {"Terrible": .05, "Low": .075, "Medium": .10, "High": .125, "Extreme": .15}   # Lucas: "an increase of 5-15% depending on the rating"
HEALTH_GROWTH = MEASURED_H                         # the levels that have rows
# Centered on Medium (Lucas, 2026-10-24): level 1 damage is raised by half of the rating's bump (a margin stays: the PCs are a little ahead); from level 2
# a Medium NPC grows exactly like the PCs (its fight stays as hard as at level 1), and the other ratings differ from Medium by their own gap:
# rel is the growth of a rating a level relative to Medium, shared by Health and damage (so the fight changes by (1 + bump) / (1 + Medium's bump) a level).
rel = lambda k: ((1 + BUMP[k]) / (1 + BUMP["Medium"])) ** 0.5
dfac = lambda k, lv: (1 + BUMP[k] / 2) * MEASURED_D[lv] * rel(k) ** (lv - 1)
hfac = lambda k, lv: MEASURED_H[lv] * rel(k) ** (lv - 1)
r25 = lambda x: round(x * 4) / 4
def table(title, ratings, cell):
    o = [f"**{title}**\n", "| Level | " + " | ".join(f"**{k}**" for k in ratings) + " |", "|---|" + "---|" * len(ratings)]
    for lv in LEVELS:
        o.append(f"| **Level {lv}** | " + " | ".join(cell(k, lv) if lv in HEALTH_GROWTH else "—" for k in ratings) + " |")
    return "\n".join(o) + "\n"
def build():
    out = []
    for name, r in roles.items():
        ratings = list(STEP) if r["extreme"] else list(STEP)[:-1]
        def hm(k, lv):
            g = hfac(k, lv)
            if name == "Minions":
                v = {'Terrible': 0, 'Low': .75, 'Medium': 1, 'High': 1.25}[k] * g
                return f"×{(v if lv == 1 else r25(v)):g}"
            v = r['hm'] * HSTEP[k] * g
            return f"×{(v if lv == 1 else r5(v)):g}"   # level 1 exactly as written; later levels rounded to 0.5
        out.append(f"### {name}\n")
        out.append(table("Attributes", ratings, lambda k, lv: f"{r['attr'] + OFF[k]:+d}"))
        out.append(table(f"Health Multiplier (Health Base +{r['hb']})", ratings, hm))
        out.append(table("Defense (Armor Defense or Ward Defense)", ratings, lambda k, lv: f"{max(11, r['defense'] + OFF[k])}"))
        out.append(table("Basic attack, average damage: Tier 2 / Tier 3", ratings, lambda k, lv: f"{r5(r['basic'][0] * STEP[k] * dfac(k, lv)):g} / {r5(r['basic'][1] * STEP[k] * dfac(k, lv)):g}"))
        out.append(f"With every rating Medium, a level 1 {name[:-1].lower()} has **{2 * ((r['attr'] + 2) * r['hm'] + r['hb']):g} Health**.\n")
    return "\n".join(out)
if __name__ == "__main__": print(build())
