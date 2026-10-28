"""Builds diagrams-draft.html: the diagrams for review, in the book's own styles (nothing is added to the book)."""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import diagrams as D

here = os.path.dirname(os.path.abspath(__file__))
css = open(os.path.join(here, '..', 'rules.css')).read() + D.CSS + '''
.dfig{margin:2rem 0 2.4rem;padding-top:.4rem;border-top:2px solid var(--line)}
.dfig h2{margin-top:.4rem}
.rulebox{margin:.6rem 0;padding:.5rem .9rem;border-left:4px solid var(--acc);background:var(--accbg);font-size:.95rem}
.confirm{font:13px/1.5 system-ui,sans-serif;color:var(--mut);margin:.4rem 0}
.themebtn{position:fixed;top:10px;right:10px;font:12px system-ui;padding:3px 10px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:4px;cursor:pointer;z-index:9}
.pushfig{margin:.8rem 0}
'''
def section(title, rule, figs, note=''):
    f = ''.join(figs) if isinstance(figs, list) else figs
    return f'<section class="dfig"><h2>{title}</h2><div class="rulebox">{rule}</div><div class="pushfig">{f}</div>{f"<p class=confirm>{note}</p>" if note else ""}</section>'

cover, cf = D.cover_diagrams()
flank, ff = D.flanking_diagrams()
eng, ef = D.engaged_diagram()
reach, rf = D.reach_diagrams()
eman, mf = D.emanation_diagrams()
light, lf = D.light_diagram()
charge, chf = D.charge_diagrams()
diff, df = D.difficult_diagram()
body = ''.join([
  section('Cover', '<b>Cover</b> is how well a target is protected from you. Count the corners of the target\'s space that are blocked from the center of your square. 0: none; 1: Low (1 bane); 2: Medium (2 banes); 3: High (3 banes); 4: Total (no Line of Effect). A creature on the line from center to center gives Low cover. Leaning: you calculate from one of your corners. A line that only touches the end of a wall isn\'t blocked.', cover,
          'The same attacker (A) and wall in the first five panels; only the target (T) moves. Green lines reach a corner, red lines are blocked (X).'),
  section('Flanking (draft rule)', 'A creature <b>threatens</b> every enemy within its Reach for as long as it can make a [Melee] Action that deals damage. Creatures that threaten the same enemy <b>flank</b> it: each gets 1 boon on its [Melee] Actions against it for each other flanker, up to 3, minus 1 for each ally of that enemy that threatens it.', flank,
          'Blue tokens are allies, red-brown tokens are enemies. A badge is the boons that creature gets on [Melee] Actions against the enemy G (or A in the last panel). Thin blue lines: who threatens whom.'),
  section('Engaged', 'You are <b>Engaged</b> if you are adjacent to an enemy (next to you, even diagonally) and both of you can be Engaged.', eng),
  section('Reach', 'Every distance is counted in squares. A creature next to you, even diagonally, is 1 square away. Every second diagonal counts as 2 squares (1, 2, 1, 2...). Areas and ranges are measured the same way.', reach, 'The numbers are the distance in squares from the center creature.'),
  section('Emanation', 'An Emanation extends a number of squares around its target. Around a creature it extends that many squares from every square the creature occupies, so it follows the creature\'s Size.', eman),
  section('Light', 'A light reaches a <b>circle</b> around it, not a count of squares: a square is lit when the center of the square is inside that circle. A center exactly on the edge counts. Bright light 2 reaches the squares 2 straight out and the squares diagonally next to it, but not the squares 2 away and 1 to the side.', light, 'Bright squares: strong color. Dim squares: pale. The torch is the dot in the middle.'),
  section('Charge: the straight line (draft)', 'Draw a line from the center of your square to the center of the destination square. The line must be a legal move: you can\'t Charge through or past a creature or through Difficult Terrain, even with movement left. The Charge ends in the last legal square on the line, and you attack from there.', charge, 'Green ring: where the Charge ends. In Foundry the ruler shows the line, dragging the token shows its path on the grid, and the token ends in the last legal square.'),
  section('Difficult Terrain', 'Each square of difficult terrain counts double the squares it would normally count.', diff),
])
html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diagrams (draft)</title><style>{css}</style></head><body><button class="themebtn" onclick="var r=document.documentElement;r.dataset.theme=r.dataset.theme===\'dark\'?\'light\':\'dark\'">light / dark</button><main style="max-width:900px;margin:0 auto;padding:1rem 1.2rem"><h1>Diagrams for the rules (draft, not in the book)</h1><p class="draft">Each diagram is computed from the rule it shows. Nothing here is in the book yet.</p>{body}</main></body></html>'
open(os.path.join(here, 'diagrams-draft.html'), 'w').write(html)
print('built', len(html), 'chars')
