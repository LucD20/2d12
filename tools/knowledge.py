"""Builds the claude.ai Project's knowledge files ("2d12 design") into knowledge/ (emptied first).

Run from anywhere: python tools/knowledge.py            (the core set: rules, open items, the current design documents)
                   python tools/knowledge.py weapons    (the core set + the weapon design documents, for weapon chats)
                   python tools/knowledge.py --out DIR  (into another folder; Update Foundry.cmd builds knowledge-upload/ this way)
knowledge/ is committed (2026-11-07, Lucas: "do both"): every pack runs this at its end, in a cloud session too, and commits knowledge/.
The Project reads that folder from GitHub: press its sync button after a pack. By hand instead: delete every old knowledge file in the
Project and upload everything in knowledge-upload/ (Update Foundry.cmd rebuilds it; since 2026-11-11 it no longer opens the folder), replacing, not adding copies.

The set is for DESIGN conversations and is kept small on purpose, so the Project can hold all of it at once instead of
searching it (a large set is only searched in pieces, and the chat then misses rules):
- the current rules (rules-src chapters, with the HTML markup turned into plain text; the glossary is left out: it repeats them);
- what is open and decided but not applied (only the open items of rules-backlog.md, not the applied history);
- the state and the plan (HANDOFF, MASTER-PLAN) and the design documents still in progress (DESIGN_DOCS below).
Left out: Foundry code and backlog, the ruler's scripts and README, the book's writing conventions, applied design documents.
Those are for Claude Code.

When a design document is finished (applied to rules-src), remove it from DESIGN_DOCS; add new ones while they are in progress.
"""
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "knowledge"

# Design documents still in progress (decided or proposed, not fully in rules-src yet). Keep this list short.
DESIGN_DOCS = [
    "foundry/mockups/style-audit.md",   # what in the system is not on par with the settled look; a proposed order (2026-11-12)
    "foundry/mockups/npc-hud-brief.md",  # the one-page NPC sheet and the HUD: decisions, mockups to make (2026-11-12)
    "book/sim-brief.md",        # the automated playtest environment (SIM): the brief, the order, what the ruler lacks (2026-11-11)
    "book/cards/paladin-analyses.md",  # the Card Workbench drafts analysed card by card (Lucas's format, 2026-11-14): priced lines with their source, then the analysis
    "book/ruler/pc-budget.md",  # the PC budget: what a PC's Actions, riders, Reactions and helps are worth, for the card sessions (2026-11-13)
    "book/ruler/stage0.md",     # Stage 0 (levels 1 to 3) in the ruler: the fights by level, the Bestiary's Stage 0 table and its fit (2026-11-12)
    "book/expedition-loop.md",  # Momentum, Alert, the decided fight and the Parting Beat: a candidate (2026-11-09)
    "book/playtest-2.md",       # playtest 2 and the rework it decided (pack R)
    "book/playtest-3.md",       # playtest 3, the baseline (no NPC Weapon Attack); its questions
    "book/playtest-4.md",       # playtest 4 (Foundry, v0.0.342, not finished): the log; its fixes in foundry-backlog "PLAYTEST 4 FIXES"
    "book/rework-r.md",         # pack R: the numbers and the decided sheet (section 14); R-core, R-classes and R-bestiary applied, R-Foundry to go
    "book/progression-lv.md",   # progression, Overcast and Momentum (pack R changes Overcast)
    "book/class-charter.md",    # what every class must have
    "book/decisions-s1.md",  # decision sheet S1: the core is in the book (2026-11-12); the classes' Stage 0 level lists (item 5) wait for the card sessions
    "book/base-building.md",    # base building: proposals for much later (2026-11-07)
    "book/roleplay-skills.md",  # roleplay and skills: proposals (2026-11-07), Lucas reviews later
    "book/items-economy.md",    # items, loot, money, carrying (designed 2026-11-06, logged part by part)
    "foundry/mockups/action-effects-audit.md",  # PACK ACTION-SHEET session 1: the Effects audit, 40 numbered defaults (2026-11-11); remove when the build is done
    "foundry/mockups/action-sheet-compare.md",  # the three Action sheet mockups compared (2026-11-11)
    "foundry/mockups/action-props-review.md",  # the Mithril cards' options before ACTION-SHEET: what to merge, what is obsolete (2026-11-10)
]
# Topic sets: added only when named on the command line (they are big; the core set stays small).
TOPICS = {
    "weapons": [
        "book/weapon-trees.md",     # the Bow group (designed), the Sword group next
        "book/gear-d2.md",          # D2: in the book with defaults, Lucas's answers pending
        "book/line-area-prompt.md", # the Line area (pack L)
    ],
}
SKIP_CHAPTERS = {"09-glossary.md"}


def plain(md: str) -> str:
    """The book's markdown with its HTML (cards, stat blocks, level lists) turned into plain text."""
    md = re.sub(r"<!--.*?-->", "", md, flags=re.S)
    md = re.sub(r"^@@DIAGRAM:.*$", "", md, flags=re.M)
    # A card's head: <div class="action-head"><span>Name</span><span>1 AP</span><span class="cat">Category</span></div>
    def head(m):
        parts = [re.sub(r"<[^>]+>", "", p).strip() for p in re.findall(r"<span[^>]*>(.*?)</span>", m.group(1))]
        return "\n#### " + " | ".join(p for p in parts if p) + "\n"
    md = re.sub(r'<div class="action-head">(.*?)</div>', head, md)
    # Label + value rows (stat blocks, level lists): "<span class="lbl">X</span> Y" -> "X: Y"
    md = re.sub(r'<span class="lbl">(.*?)</span>\s*(<span>)?', r"\1: ", md)
    md = re.sub(r'<div class="lvn"><b>(\d+)</b><span>Level</span></div>', r"\nLevel \1:\n", md)
    md = re.sub(r'<div class="sbt">(.*?)</div>', r"\n**\1**\n", md)
    md = re.sub(r"</?(div|span|p|b|i|br)[^>]*>", "\n", md)
    md = re.sub(r"<[^>]+>", "", md)
    lines = [l.rstrip() for l in md.splitlines()]
    out, blank = [], 0
    for l in lines:
        blank = blank + 1 if not l.strip() else 0
        if blank <= 1:
            out.append(l)
    return "\n".join(out).strip() + "\n"


def open_backlog() -> str:
    """rules-backlog.md: its intro and only the open items ("- [ ]") of "Open for the book"."""
    text = (ROOT / "book/rules-backlog.md").read_text(encoding="utf-8")
    sec = text.split("## Open for the book", 1)[1].split("\n## ", 1)[0]
    items = [l for l in sec.splitlines() if l.startswith("- [ ]")]
    return ("# Open design items (from book/rules-backlog.md: only what is open; the applied history is left out)\n\n"
            "Each item is a decision or proposal not (fully) in the rules yet. The rules files are the current book.\n\n"
            + "\n".join(items) + "\n")


def commit() -> str:
    try:
        return subprocess.run(["git", "-C", str(ROOT), "log", "-1", "--format=%h %cs %s"], capture_output=True, text=True).stdout.strip()
    except OSError:
        return "unknown"


args = sys.argv[1:]
if "--out" in args:   # 2026-11-07: Update Foundry.cmd builds an untracked copy, so the committed knowledge/ never changes locally
    k = args.index("--out")
    OUT = Path(args[k + 1]).resolve() if k + 1 < len(args) else OUT
    del args[k:k + 2]
topics = args
for t in topics:
    if t not in TOPICS:
        raise SystemExit(f"unknown topic {t!r}; known: {', '.join(TOPICS)}")
    DESIGN_DOCS += TOPICS[t]

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()

files = {}  # name in knowledge/ -> text
files["HANDOFF.md"] = (ROOT / "HANDOFF.md").read_text(encoding="utf-8")
files["MASTER-PLAN.md"] = (ROOT / "MASTER-PLAN.md").read_text(encoding="utf-8")
files["open-design-items.md"] = open_backlog()
for chapter in sorted((ROOT / "book/rules-src").glob("[0-9]*.md")):
    if chapter.name not in SKIP_CHAPTERS:
        files["rules-" + chapter.name] = plain(chapter.read_text(encoding="utf-8"))
for note in sorted((ROOT / "book/research").glob("*.md")):   # research notes (2026-11-13): other games' ideas, read before searching again
    files["research-" + ("index.md" if note.name == "README.md" else note.name)] = note.read_text(encoding="utf-8")
for doc in DESIGN_DOCS:
    p = ROOT / doc
    if p.exists():
        files["design-" + p.name] = p.read_text(encoding="utf-8")
    else:
        print(f"missing design document (remove it from DESIGN_DOCS?): {doc}")

listing = "\n".join(f"- {n} ({len(t.encode('utf-8')) // 1000} KB)" for n, t in files.items())
files["00-about-these-files.md"] = f"""# About these knowledge files

Built by tools/knowledge.py on {date.today().isoformat()} from the repository at: {commit()}
Topic sets included: {", ".join(topics) or "none (core set only)"}. Topic sets not loaded: {", ".join(t for t in TOPICS if t not in topics) or "none"}
(if the chat needs one, ask Lucas to re-run tools/knowledge.py with that topic and re-upload).
If a rule here disagrees with what Lucas says was changed later, the files are stale: ask him to re-run tools/knowledge.py.

- rules-*.md: the current rulebook (Core Rules 01-08, Species 11, Paladin 12, Archer 13, Bestiary 14, Gear 15, Talents 16),
  turned into plain text. This is what is in the book today. The glossary is left out (it repeats these chapters).
- open-design-items.md: decisions and proposals not applied yet (newest first).
- research-*.md: research notes (other games, design essays, forums): opinions, not 2d12's rules; read before searching again.
- design-*.md: design documents in progress (playtests, prep documents, designs not in the book yet).
- HANDOFF.md and MASTER-PLAN.md: where the project is and the order of the work.
- Not here (they live in the repository, for Claude Code): the Foundry system and its backlog, the ruler (the numbers model and its
  scripts), the book's writing conventions, the applied design documents and the change history.

Files:
{listing}
"""

for name, text in files.items():
    (OUT / name).write_text(text, encoding="utf-8")
total = sum(len(t.encode("utf-8")) for t in files.values())
print(f"{len(files)} files in {OUT}, {total // 1000} KB (about {total // 4000}k tokens)")
