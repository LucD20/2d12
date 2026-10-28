"""Copies the claude.ai Project's knowledge files into knowledge/ (emptied first), with flat unique names.

Run from anywhere: python tools/knowledge.py
"""
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "knowledge"

# source (relative to the repo root) -> name in knowledge/
FILES = {
    "HANDOFF.md": "HANDOFF.md",
    "MASTER-PLAN.md": "MASTER-PLAN.md",
    "CLAUDE.md": "CLAUDE.md",
    "book/rules-src/README.md": "rules-README.md",
    "book/rules-backlog.md": "rules-backlog.md",
    "foundry/foundry-backlog.md": "foundry-backlog.md",
    "book/ruler/README.md": "ruler-README.md",
}
for chapter in sorted((ROOT / "book/rules-src").glob("[0-9]*.md")):
    FILES[chapter.relative_to(ROOT).as_posix()] = chapter.name

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()

for src, name in FILES.items():
    if (OUT / name).exists():
        raise SystemExit(f"two files would be named {name}")
    shutil.copy2(ROOT / src, OUT / name)

print(f"{len(FILES)} files in {OUT}")
