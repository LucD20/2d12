#!/usr/bin/env bash
# The guard for the magic and Talents files (book/magic-files.sha256).
#   bash book/tools/guard.sh check     every guarded file is there and unchanged (prints "guard: N files OK")
#   bash book/tools/guard.sh rebuild   after a change made on purpose: rebuild the list from the globs below
# A file is added to the guard by adding its path or glob here, then running "rebuild".
set -euo pipefail
cd "$(dirname "$0")/.."            # book/
shopt -s nullglob
FILES=(
  magic-design.md magic-rules-draft.md magic-out-of-combat.md decided.md talents-design.md roleplay-skills.md
  cards/magic-*.md cards/talents-*.md
  research/dominions-*.md research/ars-magica.md research/magic-schools.md research/caster-class-shape.md
  research/charm-confusion-summons.md research/progression-feel.md research/cones.md research/resources-and-recovery.md
  research/revival.md research/crucible.md research/out-of-combat-magic.md research/magic-vs-skills.md
  research/roleplay-and-utility-magic.md research/skills-or-magic-first.md research/helping.md research/talents.md
  research/bypass-and-repeat.md research/retries.md research/party-retries.md research/famous-picks.md
  research/divinity-original-sin-2.md research/pillars-of-eternity.md
  research/raw/2026-11-18-* research/raw/2026-11-19-* research/raw/2026-11-20-* research/raw/tools/*.py
  ../archive/old-notes/rules-backlog-magic-talents-2026-11-18-19.md
)
case "${1:-check}" in
  rebuild)
    for f in "${FILES[@]}"; do [ -f "$f" ] || { echo "guard: missing $f" >&2; exit 1; }; done
    sha256sum "${FILES[@]}" > magic-files.sha256
    echo "guard: rebuilt, $(wc -l < magic-files.sha256) files" ;;
  check)
    if out=$(sha256sum -c --quiet magic-files.sha256 2>&1); then
      echo "guard: $(wc -l < magic-files.sha256) files OK"
    else
      echo "$out"; echo "guard: FAILED (a guarded file is missing or changed; after a change made on purpose run: bash book/tools/guard.sh rebuild)" >&2; exit 1
    fi
    n=$(sha256sum "${FILES[@]}" 2>/dev/null | wc -l)
    [ "$n" -eq "$(wc -l < magic-files.sha256)" ] || { echo "guard: the list has $(wc -l < magic-files.sha256) files but the globs find $n: run rebuild" >&2; exit 1; } ;;
  *) echo "usage: bash book/tools/guard.sh [check|rebuild]" >&2; exit 2 ;;
esac
