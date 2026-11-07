"""Builds the claude.ai Project's knowledge files ("2d12 design") into knowledge/ (emptied first).

Run from anywhere: python tools/knowledge.py            (the core set: rules, open items, the current design documents)
                   python tools/knowledge.py weapons    (the core set + the weapon design documents, for weapon chats)
Then, in the Project: delete every old knowledge file and upload everything in knowledge/ (replace, don't add copies).

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
    "book/playtest-2.md",       # playtest 2 and the rework it decided (pack R)
    "book/playtest-3.md",       # playtest 3, the baseline (no NPC Weapon Attack); its questions
    "book/rework-r.md",         # pack R: the numbers and the decided sheet (section 14); R-core, R-classes and R-bestiary applied, R-Foundry to go
    "book/progression-lv.md",   # progression, Overcast and Momentum (pack R changes Overcast)
    "book/class-charter.md",    # what every class must have
    "book/roleplay-skills.md",  # roleplay and skills: proposals (2026-11-07), Lucas reviews later
    "book/items-economy.md",    # items, loot, money, carrying (designed 2026-11-06, logged part by part)
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


topics = sys.argv[1:]
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
