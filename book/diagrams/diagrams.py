"""Diagrams for the rules book, in the style of the Pushed diagram (a square grid, numbered squares, tokens). Every number in a diagram is computed from the rules."""
import math, re, html
from geometry import *

e = html.escape
ALLY, ENEMY, NEUTRAL = '#4b7aa6', '#a2574a', '#8a8478'

class Svg:
    M = 16   # the margin that holds the coordinates: letters on top, numbers on the left
    def __init__(self, rows, cols, S=30, caption=''):
        self.rows, self.cols, self.S, self.caption = rows, cols, S, caption
        self.under, self.over = [], []
        for i in range(rows):
            for j in range(cols):
                self.under.append(f'<rect x="{j * S}" y="{i * S}" width="{S}" height="{S}" class="gcell"/>')
    X = lambda self, x: x * self.S
    def cell(self, i, j, cls):
        S = self.S; self.under.append(f'<rect x="{j * S}" y="{i * S}" width="{S}" height="{S}" class="{cls}"/>')
    def cells(self, cells, cls):
        for i, j in cells:
            if 0 <= i < self.rows and 0 <= j < self.cols: self.cell(i, j, cls)
    def text(self, i, j, t, cls='gnum', dy=4, dx=0, size=None):
        S = self.S; st = f' font-size="{size}"' if size else ''
        self.over.append(f'<text x="{j * S + S / 2 + dx}" y="{i * S + S / 2 + dy}" class="{cls}"{st}>{e(str(t))}</text>')
    def label(self, x, y, t, cls='glabel', anchor='start'):
        self.over.append(f'<text x="{x * self.S}" y="{y * self.S}" class="{cls}" text-anchor="{anchor}">{e(str(t))}</text>')
    def token(self, i, j, label, kind='ally', ring='', tr=0.36):
        S = self.S; cx, cy = j * S + S / 2, i * S + S / 2
        col = {'ally': ALLY, 'enemy': ENEMY, 'neutral': NEUTRAL}[kind]
        if ring: self.over.append(f'<circle cx="{cx}" cy="{cy}" r="{S * (tr + 0.1)}" class="gring {ring}"/>')
        self.over.append(f'<circle cx="{cx}" cy="{cy}" r="{S * tr}" fill="{col}" class="gtokc"/><text x="{cx}" y="{cy + 4}" class="gtok" font-size="{12 if len(label) < 3 else 9}">{e(label)}</text>')
    def token_big(self, i, j, n, label, kind='enemy'):
        """A token that fills n x n squares (Large, Huge)."""
        S = self.S; col = {'ally': ALLY, 'enemy': ENEMY, 'neutral': NEUTRAL}[kind]
        self.over.append(f'<rect x="{j * S + 3}" y="{i * S + 3}" width="{n * S - 6}" height="{n * S - 6}" rx="{S * 0.3}" fill="{col}" class="gtokc"/><text x="{(j + n / 2) * S}" y="{(i + n / 2) * S + 4}" class="gtok" font-size="12">{e(label)}</text>')
    def line(self, p, q, cls='gline', w=None):
        a, b = (p[0] * self.S, p[1] * self.S), (q[0] * self.S, q[1] * self.S)
        self.over.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" class="{cls}"/>')
    def arrow(self, p, q, cls='gpath'):
        """A line from p to q (grid points: x = column, y = row) with a small head at q."""
        S = self.S; x1, y1, x2, y2 = p[0] * S, p[1] * S, q[0] * S, q[1] * S
        L = math.hypot(x2 - x1, y2 - y1) or 1; ux, uy = (x2 - x1) / L, (y2 - y1) / L; h = S * 0.22
        bx, by = x2 - ux * h, y2 - uy * h
        self.over.append(f'<line x1="{x1}" y1="{y1}" x2="{bx}" y2="{by}" class="{cls}"/><polygon points="{x2},{y2} {bx - uy * h * 0.55},{by + ux * h * 0.55} {bx + uy * h * 0.55},{by - ux * h * 0.55}" class="gpathhead"/>')
    def wall(self, a, b):
        self.over.append(f'<line x1="{a[0] * self.S}" y1="{a[1] * self.S}" x2="{b[0] * self.S}" y2="{b[1] * self.S}" class="gwall"/>')
    def mark(self, x, y, kind):
        cx, cy, r = x * self.S, y * self.S, self.S * 0.17
        if kind == 'x': self.over.append(f'<path d="M{cx - r} {cy - r} L{cx + r} {cy + r} M{cx - r} {cy + r} L{cx + r} {cy - r}" class="gx"/>')
        else: self.over.append(f'<circle cx="{cx}" cy="{cy}" r="{self.S * 0.1}" class="gok"/>')
    def circle(self, x, y, r, cls):
        self.over.append(f'<circle cx="{x * self.S}" cy="{y * self.S}" r="{r * self.S}" class="{cls}"/>')
    def badge(self, i, j, t, cls='gbadge'):
        S = self.S; cx, cy = j * S + S - 8, i * S + 7
        self.over.append(f'<rect x="{cx - 9}" y="{cy - 6.5}" width="18" height="13" rx="6.5" class="{cls}"/><text x="{cx}" y="{cy + 3.5}" class="gbt">{e(str(t))}</text>')
    def outline(self, cells, cls='gout'):
        """The outer edge of a set of cells."""
        s = set(cells); S = self.S; d = []
        for (i, j) in s:
            for (di, dj, seg) in ((-1, 0, (j, i, j + 1, i)), (1, 0, (j, i + 1, j + 1, i + 1)), (0, -1, (j, i, j, i + 1)), (0, 1, (j + 1, i, j + 1, i + 1))):
                if (i + di, j + dj) not in s: d.append(f'M{seg[0] * S} {seg[1] * S} L{seg[2] * S} {seg[3] * S}')
        self.over.append(f'<path d="{" ".join(d)}" class="{cls}"/>')
    def svg(self, aria=''):
        S, M = self.S, self.M
        letters = ''.join(f'<text x="{M + j * S + S / 2}" y="{M - 5}" class="gcoord">{chr(65 + j)}</text>' for j in range(self.cols))
        numbers = ''.join(f'<text x="{M - 4}" y="{M + i * S + S / 2 + 3.5}" class="gcoord gcoordr">{i + 1}</text>' for i in range(self.rows))
        return f'<svg viewBox="0 0 {self.cols * S + M} {self.rows * S + M}" style="width:{self.cols * S + M}px;max-width:none" class="pushsvg" role="img" aria-label="{e(aria or self.caption)}">{letters}{numbers}<g transform="translate({M},{M})">{"".join(self.under)}{"".join(self.over)}</g></svg>'
    def figure(self, aria=''):
        return f'<figure style="--w:{max(self.cols * self.S + self.M, 230)}px" data-h="{self.rows * self.S + self.M}"><div class="figsvg">{self.svg(aria)}</div><figcaption>{self.caption}</figcaption></figure>'

# ------------------------------------------------------------------ Flanking (see Flanking in the book)
def flank_state(tokens):
    """tokens: {name: dict(cell, side, reach)}. A creature threatens the enemies within its Reach (diagonals count 1, 2, 1, 2...).
    Boons of an attacker against a defender it threatens: 1 for each other creature that threatens the defender minus 1 for each ally of the defender that threatens the attacker (never below 0), then at most 2."""
    names = list(tokens)
    threat = {a: {b for b in names if tokens[b]['side'] != tokens[a]['side'] and dist(tokens[a]['cell'], tokens[b]['cell']) <= tokens[a].get('reach', 1)} for a in names}
    def boons(a, d):
        if d not in threat[a]: return 0
        others = [x for x in names if x != a and d in threat[x]]
        cancel = [y for y in names if y != d and a in threat[y]]
        return max(0, min(2, len(others) - len(cancel)))   # the cancels first, then the limit of 2 Field Boons (2026-11-08)
    return dict(threat=threat, boons=boons)

def flank_panel(tokens, rows, cols, caption, S=44, reach_of=None, target=None):
    st = flank_state(tokens); g = Svg(rows, cols, S, caption)
    if reach_of:
        a = tokens[reach_of]; shape = [(i, j) for i in range(rows) for j in range(cols) if dist(a['cell'], (i, j)) <= a['reach'] and (i, j) != a['cell']]
        g.cells(shape, 'greach'); g.outline(shape + [a['cell']], 'gout')
    for name, t in tokens.items():
        if target and tokens[target]['side'] != t['side']:
            for b in st['threat'][name]:
                if dist(t['cell'], tokens[b]['cell']) > 1: g.line(center(t['cell']), center(tokens[b]['cell']), 'gthreat')
    for name, t in tokens.items():
        g.token(t['cell'][0], t['cell'][1], t.get('label', name), 'ally' if t['side'] == 'a' else 'enemy', tr=0.28)
    if target:
        for name, t in tokens.items():
            if t['side'] != tokens[target]['side']:
                n = st['boons'](name, target)
                if n: g.badge(t['cell'][0], t['cell'][1], f'+{n}')
    return g, st

def flanking_diagrams():
    out = []
    def T(cell, side, label, reach=1): return dict(cell=cell, side=side, label=label, reach=reach)
    boons_of = lambda st, toks, target: {n: st['boons'](n, target) for n, t in toks.items() if t['side'] != toks[target]['side']}
    facts = {}
    # Philip (P) and John (J) are the two allies of the examples; the other allies are "a third ally", "a fourth ally", "a fifth ally": tokens 3, 4, 5
    A = {'John': T((2, 1), 'a', 'J'), 'Philip': T((2, 3), 'a', 'P'), 'G': T((2, 2), 'b', 'G')}
    g, st = flank_panel(A, 5, 5, 'Two flankers: 1 Field Boon each', target='G'); out.append(g.figure()); facts['two'] = boons_of(st, A, 'G')
    B = {'John': T((2, 1), 'a', 'J'), 'Philip': T((2, 3), 'a', 'P'), 'a3': T((1, 2), 'a', '3'), 'G': T((2, 2), 'b', 'G')}
    g, st = flank_panel(B, 5, 5, 'Three flankers: 2 Field Boons each (the limit)', target='G'); out.append(g.figure()); facts['three'] = boons_of(st, B, 'G')
    C = dict(B); C['a4'] = T((3, 2), 'a', '4'); C['a5'] = T((3, 3), 'a', '5')
    g, st = flank_panel(C, 5, 5, 'Four or more: still 2 Field Boons each', target='G'); out.append(g.figure()); facts['five'] = boons_of(st, C, 'G')
    D = {'John': T((2, 1), 'a', 'J'), 'Philip': T((2, 4), 'a', 'P', 2), 'G': T((2, 2), 'b', 'G')}
    g, st = flank_panel(D, 5, 7, 'Range 2: a weapon with Range 2 flanks from 2 squares away', target='G', reach_of='Philip'); out.append(g.figure()); facts['reach'] = boons_of(st, D, 'G')
    # an ally of the defender next to an attacker cancels a Boon (the picture that led to this rule)
    E = {'John': T((2, 2), 'a', 'J'), 'Philip': T((2, 4), 'a', 'P'), 'A': T((1, 1), 'b', 'A'), 'B': T((1, 3), 'b', 'B'), 'C': T((3, 3), 'b', 'C')}
    g, st = flank_panel(E, 5, 6, 'Three goblins on John, with Philip next to two of them: each ally of John that threatens a goblin cancels one of its Boons', target='John'); out.append(g.figure()); facts['cancel'] = boons_of(st, E, 'John')
    # two lines: the neighbors of the defender cancel the boons, except for the fighter at the end of a line
    lines = {}
    for c in range(1, 5): lines[f'a{c}'] = T((1, c), 'a', 'D' if c == 2 else 'A'); lines[f'b{c}'] = T((2, c), 'b', 'B')
    g, st = flank_panel(lines, 4, 6, 'Two lines of fighters, all against the second fighter on the left (D): its neighbors cancel the Boons, only the enemy at the end of the line gets 1', target='a2'); out.append(g.figure())
    facts['lines'] = boons_of(st, lines, 'a2')
    facts['lines_all'] = sorted((a, d, st['boons'](a, d)) for a in lines for d in lines if lines[a]['side'] != lines[d]['side'] and st['boons'](a, d))
    return out, facts

# ------------------------------------------------------------------ Cover
COVER_WALL = ((4, 3), (4, 5))
COVER_ATT = (2, 0)
COVER_TARGETS = {0: (1, 6), 1: (6, 5), 2: (3, 6), 3: (5, 5), 4: (4, 6)}

def cover_panel(origin, att_cell, tgt, walls, S=24, rows=8, cols=9, caption=None, creature=None, extra_lines=None):
    g = Svg(rows, cols, S)
    blocked = blocked_corners(origin, tgt, walls)
    n = len(blocked)
    for w in walls: g.wall(*w)
    for c in corners(tgt):
        g.line(origin, c, 'glno' if c in blocked else 'glok')
        g.mark(c[0], c[1], 'x' if c in blocked else 'ok')
    if creature is not None:
        g.token(creature[0], creature[1], 'X', 'neutral')
    g.token(att_cell[0], att_cell[1], 'A', 'ally')
    g.token(tgt[0], tgt[1], 'T', 'enemy')
    g.caption = caption or f'{n} blocked corner{"s" if n != 1 else ""}: {cover_name(n)} cover' + (f' ({n} Field Bane{"s" if n != 1 else ""})' if 0 < n < 3 else (' (Doomed)' if n == 3 else (' (no Line of Effect)' if n == 4 else '')))   # High cover: Doomed (2026-11-08)
    return g, n

def cover_diagrams():
    out, facts = [], {}
    o = center(COVER_ATT)
    for k, tgt in COVER_TARGETS.items():
        g, n = cover_panel(o, COVER_ATT, tgt, [COVER_WALL]); out.append(g.figure()); facts[f'wall:{k}'] = n
    # a creature in the way: low cover, though no corner is blocked
    att, tgt, mid = (3, 0), (3, 7), (3, 3)
    g = Svg(8, 9, 24); o2 = center(att)
    blocked = blocked_corners(o2, tgt, [])
    for c in corners(tgt): g.line(o2, c, 'glok'); g.mark(c[0], c[1], 'ok')
    g.line(o2, center(tgt), 'gcenter')
    g.token(mid[0], mid[1], 'X', 'neutral'); g.token(att[0], att[1], 'A', 'ally'); g.token(tgt[0], tgt[1], 'T', 'enemy')
    g.caption = 'A creature on the line between the centers: Low cover (1 Field Bane), though no corner is blocked'; out.append(g.figure()); facts['creature'] = len(blocked)
    # leaning: from a corner of your own square
    att, tgt = (2, 1), (4, 3)
    wall = ((2, 2), (2, 6))
    LS = 32; g = Svg(8, 9, LS); oc = center(att); lean = (2, 2)
    nb_c = len(blocked_corners(oc, tgt, [wall])); nb_l = len(blocked_corners(lean, tgt, [wall]))
    g.wall(*wall)
    for c in corners(tgt): g.line(oc, c, 'glno' if c in blocked_corners(oc, tgt, [wall]) else 'glok', ) if False else None
    for c in corners(tgt):
        g.line(oc, c, 'glno ghalf')
    for c in corners(tgt):
        g.line(lean, c, 'glok' if c not in blocked_corners(lean, tgt, [wall]) else 'glno'); g.mark(c[0], c[1], 'ok' if c not in blocked_corners(lean, tgt, [wall]) else 'x')
    g.over.append(f'<circle cx="{lean[0] * LS}" cy="{lean[1] * LS}" r="5" class="glean"/>')
    g.token(att[0], att[1], 'A', 'ally'); g.token(tgt[0], tgt[1], 'T', 'enemy')
    g.caption = f'Leaning: from the center {nb_c} corners are blocked ({cover_name(nb_c)}); from the corner of your square, {nb_l} ({cover_name(nb_l)})'
    out.append(g.figure()); facts['lean'] = (nb_c, nb_l)
    return out, facts

# ------------------------------------------------------------------ Engaged, Reach, Emanation
def engaged_diagram():
    g = Svg(5, 5, 34, 'You are Engaged with the goblin next to you, even diagonally; the goblin 2 squares away is not adjacent')
    me = (2, 2); ring = [(i, j) for i in range(1, 4) for j in range(1, 4) if (i, j) != me]
    g.cells(ring, 'greach'); g.outline(ring + [me], 'gout')
    g.token(2, 2, 'Y', 'ally'); g.token(1, 3, 'A', 'enemy'); g.token(2, 0, 'B', 'enemy')
    return g.figure(), dict(engaged=[(1, 3)], far=dist(me, (2, 0)))

def reach_diagrams():
    out, facts = [], {}
    for R, cap in ((1, 'Reach 1: 9 squares in all (the creature and the 8 around it)'), (2, 'Reach 2: the squares up to 2 away. A second diagonal counts as 2, so the four corners are 3 away')):
        n = 7; g = Svg(n, n, 30, cap); c = (3, 3)
        inside = [(i, j) for i in range(n) for j in range(n) if dist(c, (i, j)) <= R and (i, j) != c]
        g.cells(inside, 'greach'); g.outline(inside + [c], 'gout')
        for i in range(n):
            for j in range(n):
                if (i, j) != c and dist(c, (i, j)) <= 3: g.text(i, j, dist(c, (i, j)), 'gnum' if dist(c, (i, j)) <= R else 'gnum gfar')
        g.token(3, 3, 'Y', 'ally')
        out.append(g.figure()); facts[R] = len(inside) + 1
    return out, facts

def emanation_diagrams():
    out, facts = [], {}
    def shape(n, occ, R): return [(i, j) for i in range(n) for j in range(n) if min(dist(o, (i, j)) for o in occ) <= R]
    cases = [('A 1 Emanation around a Medium creature: 3 x 3 squares', 7, [(3, 3)], 1, 1, 'M'), ('A 2 Emanation around a Medium creature: 21 squares (5 x 5 without the corners)', 7, [(3, 3)], 2, 1, 'M'),
             ('A 1 Emanation around a Huge creature (3 x 3): 5 x 5 squares', 7, [(i, j) for i in (2, 3, 4) for j in (2, 3, 4)], 1, 3, 'H')]
    for cap, n, occ, R, size, lab in cases:
        g = Svg(n, n, 30, cap); sh = shape(n, occ, R)
        g.cells([c for c in sh if c not in occ], 'greach'); g.outline(sh, 'gout')
        if size == 1: g.token(occ[0][0], occ[0][1], lab, 'enemy')
        else: g.token_big(2, 2, 3, lab, 'enemy')
        out.append(g.figure()); facts[cap] = len(sh)
    return out, facts

# ------------------------------------------------------------------ Light
def _oct(a, b):
    """The distance of an Emanation: the longer side plus half the shorter one (a diagonal counts 1, then 2, then 1...)."""
    dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1]); return max(dx, dy) + min(dx, dy) // 2
def light_diagram():
    n, S = 11, 26; c = (5, 5); g = Svg(n, n, S, 'A torch with Bright light 2 (Dim light 2 more): the same squares as a 2 Emanation and a 4 Emanation')
    bright = [(i, j) for i in range(n) for j in range(n) if _oct(c, (i, j)) <= 2]
    dim = [(i, j) for i in range(n) for j in range(n) if 2 < _oct(c, (i, j)) <= 4]
    g.cells(dim, 'gdim'); g.cells(bright, 'gbright')
    g.over.append(f'<circle cx="{(c[1] + .5) * S}" cy="{(c[0] + .5) * S}" r="5" class="glight"/>')
    return g.figure(), dict(bright=len(bright), dim=len(dim))

# ------------------------------------------------------------------ Burst (centered on a corner; the squares whose center is within N of it)
def burst_diagrams():
    out, facts = [], {}
    for N in (1, 2, 3):
        n, S = 8, 28; P = (4, 4)   # the corner between rows 3 and 4, columns 3 and 4
        sh = [(i, j) for i in range(n) for j in range(n) if math.hypot(i + .5 - P[0], j + .5 - P[1]) <= N + 1e-9]
        g = Svg(n, n, S, f'A {N} Burst: {len(sh)} squares' + (' (4 x 4 without its corners)' if N == 2 else ''))
        g.cells(sh, 'greach'); g.outline(sh, 'gout')
        g.over.append(f'<circle cx="{P[1] * S}" cy="{P[0] * S}" r="5" class="glight"/>')
        out.append(g.figure()); facts[N] = len(sh)
    return out, facts

# ------------------------------------------------------------------ Charge line and Difficult Terrain
def ordered_cells(p, q, rows, cols):
    """The cells a straight line passes through, in the order it enters them."""
    out = []; N = 4000
    for k in range(N + 1):
        t = k / N; x, y = p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t
        c = (int(math.floor(y)), int(math.floor(x)))
        if 0 <= c[0] < rows and 0 <= c[1] < cols and (not out or out[-1] != c): out.append(c)
    return out

# the squares of a straight line, one per step (the same walk as Foundry's cellLine)
def bres(a, b):
    out = []; x, y = a[1], a[0]; dx = abs(b[1] - x); dy = -abs(b[0] - y); sx = 1 if x < b[1] else -1; sy = 1 if y < b[0] else -1; err = dx + dy
    while True:
        out.append((y, x))
        if (x, y) == (b[1], b[0]): break
        e2 = 2 * err
        if e2 >= dy: err += dy; x += sx
        if e2 <= dx: err += dx; y += sy
    return out
def sq(c): return 'ABCDEFGHIJKLMN'[c[1]] + str(c[0] + 1)

# ------------------------------------------------------------------ the Line (the same walk as Foundry's linearea.mjs)
def line_walk(o, t, steps, side='left'):
    """Squares (row, col) from o toward t, one per step along the longer direction: the square whose center is nearest to the segment.
    A tie (exactly between two squares) takes the side chosen once (left or right, from o looking at t). Returns [(cell, tie, other)]."""
    dx, dy = t[1] - o[1], t[0] - o[0]; ax, ay = abs(dx), abs(dy); maj, mn = max(ax, ay), min(ax, ay); out = []
    if not maj: return out
    xmaj = ax >= ay; smaj = (1 if (dx if xmaj else dy) >= 0 else -1); smin = (1 if (dy if xmaj else dx) >= 0 else -1)
    at = lambda k, m: (o[0] + smin * m, o[1] + smaj * k) if xmaj else (o[0] + smaj * k, o[1] + smin * m)
    left = lambda c: dx * (c[0] - o[0]) - dy * (c[1] - o[1]) < 0
    for k in range(1, steps + 1):
        q, rem = divmod(k * mn, maj)
        if 2 * rem != maj: out.append((at(k, q + 1 if 2 * rem > maj else q), False, None)); continue
        a, b = at(k, q), at(k, q + 1)
        take, other = (b, a) if (side == 'right') == left(a) else (a, b)
        out.append((take, True, other))
    return out
def line_cost(o, c): return dist(o, c)
def line_squares(o, t, n, side='left'):
    """A Line n from o aimed at t: continues past t until the count would pass n."""
    return [x for x in line_walk(o, t, 4 * n + 4, side) if line_cost(o, x[0]) <= n] if (o != t) else []
def line_steps(a, b, side='left'):
    """A straight movement from a to b (Straight Line): its squares, b last."""
    return line_walk(a, b, max(abs(b[0] - a[0]), abs(b[1] - a[1])), side)

def line_panel(rows, cols, o, t, n, side='left', caption='', S=24, count=True, walls=(), big=None, stop=None):
    g = Svg(rows, cols, S, caption)
    sqs = line_squares(o, t, n, side)
    if stop: sqs = sqs[:stop]
    for c, tie, other in sqs:
        g.cell(c[0], c[1], 'gtie' if tie else 'greach')
        if count: g.text(c[0], c[1], line_cost(o, c[0:2]), size=10)
    for c, tie, other in sqs:
        if other and 0 <= other[0] < rows and 0 <= other[1] < cols: g.over.append(f'<rect x="{other[1] * S + 2}" y="{other[0] * S + 2}" width="{S - 4}" height="{S - 4}" class="gdash"/>')
    tc = center(t); oc = center(o); ux, uy = tc[0] - oc[0], tc[1] - oc[1]
    far = min([v for v in ((((cols if ux > 0 else 0) - oc[0]) / ux) if ux else None, (((rows if uy > 0 else 0) - oc[1]) / uy) if uy else None) if v is not None])   # to the edge of the grid
    end = (oc[0] + ux * far, oc[1] + uy * far)
    g.over.insert(0, f'<line x1="{oc[0] * S}" y1="{oc[1] * S}" x2="{end[0] * S}" y2="{end[1] * S}" class="gcenter"/>')
    g.over.append(f'<rect x="{t[1] * S + 1.5}" y="{t[0] * S + 1.5}" width="{S - 3}" height="{S - 3}" class="gaim"/>')
    for w in walls: g.wall(*w)
    if big: g.token_big(big[0], big[1], 2, 'Y', 'ally')
    else: g.token(o[0], o[1], 'Y', 'ally')
    return g, [c for c, _, _ in sqs]

def line_diagrams():
    """The Line: straight, diagonal, 5:2, steep; the 2:1 ties left and right; a Large creature; a wall."""
    figs, facts = [], {}
    g, a = line_panel(3, 12, (1, 0), (1, 1), 10, caption='Line 10 straight: 10 squares'); figs.append(g); facts['straight'] = len(a)
    g, a = line_panel(8, 8, (0, 0), (1, 1), 10, caption='Line 10 on a diagonal: 7 squares (every second diagonal counts 2)'); figs.append(g); facts['diagonal'] = len(a)
    g, a = line_panel(5, 10, (0, 0), (2, 5), 10, caption='Line 10 aimed at F3 (5 across, 2 down): 8 squares, no ties'); figs.append(g); facts['5:2'] = len(a)
    g, a = line_panel(10, 5, (9, 3), (4, 1), 10, caption='Line 10 aimed steeply at B5 (2 across, 5 up): 8 squares'); figs.append(g); facts['steep'] = len(a)
    l, al = line_panel(6, 10, (0, 0), (1, 2), 10, 'left', caption='Line 10 aimed at C2 (2:1), ties to the left: 8 squares'); figs.append(l)
    r, ar = line_panel(6, 10, (0, 0), (1, 2), 10, 'right', caption='The same Line, ties to the right: 8 squares'); figs.append(r)
    facts['left'] = [sq(c) for c in al]; facts['right'] = [sq(c) for c in ar]
    # A Large creature (Y, 2 x 2 in A1-B2) starts from a square of its space on the side it aims toward.
    for aim, start, cap in (((0, 7), (0, 1), 'A Large creature aims east along its top row: the Line starts from B1'), ((6, 6), (1, 1), 'The same creature aims southeast: the Line starts from B2')):
        g, a = line_panel(8, 9, start, aim, 6, caption=cap, big=(0, 0), count=False); figs.append(g); facts[cap[:20]] = [sq(c) for c in a]
    # A wall: the Line stops at the first square it can't enter.
    sqs = line_squares((1, 0), (1, 1), 8); k = next(n for n, (c, _, _) in enumerate(sqs) if c[1] == 5)
    g, a = line_panel(3, 10, (1, 0), (1, 1), 8, caption=f'Line 8 east with a wall before F2: it stops at E2 ({k} squares); nothing behind the wall is in it', walls=[((5, 0), (5, 3))], stop=k); figs.append(g); facts['wall'] = len(a)
    return [f.figure() for f in figs], facts

def straight_diagrams():
    rows, cols, S = 6, 9, 30; start = (0, 0); out = []
    # 1. a clear line: A1 to G4
    aim = (3, 6); steps = line_steps(start, aim, 'right'); path = [start] + [c for c, _, _ in steps]
    assert path == bres(start, aim) and [sq(c) for c in path] == ['A1', 'B2', 'C2', 'D3', 'E3', 'F4', 'G4']
    g = Svg(rows, cols, S)
    for c in path[1:-1]: g.cell(c[0], c[1], 'gpass')
    g.cell(aim[0], aim[1], 'gstop')
    for c, tie, other in steps:
        if other: g.over.append(f'<rect x="{other[1] * S + 2}" y="{other[0] * S + 2}" width="{S - 4}" height="{S - 4}" class="gdash"/>')
    g.line(center(start), center(aim), 'gcenter'); g.token(start[0], start[1], 'Y', 'ally')
    g.caption = 'A straight line from the center of your square (A1) to the center of another square (G4). The colored squares are the movement the token would make using an Action that requires a straight line, such as Charge. The line passes exactly between two squares three times; you chose the right side, so every tie takes it (dashed: the left side, not taken)'
    out.append(g)
    # 2. an obstacle on the line: the movement stops on the last legal square
    aim2 = (3, 7); path2 = [start] + [c for c, _, _ in line_steps(start, aim2)]; obst = (2, 4)
    assert path2 == bres(start, aim2) and [sq(c) for c in path2] == ['A1', 'B1', 'C2', 'D2', 'E3', 'F3', 'G4', 'H4']
    k = path2.index(obst); legal, last, blocked = path2[1:k - 1], path2[k - 1], path2[k:]
    g = Svg(rows, cols, S)
    for c in legal: g.cell(c[0], c[1], 'gpass')
    g.cell(last[0], last[1], 'gstop')
    for c in blocked: g.cell(c[0], c[1], 'gblock')
    g.line(center(start), center(aim2), 'gcenter')
    g.token(start[0], start[1], 'Y', 'ally'); g.token(obst[0], obst[1], 'X', 'neutral'); g.token(aim2[0], aim2[1], 'E', 'enemy')
    g.caption = 'A straight line stops on the last legal square. If you (Y, in A1) attempt to Charge toward the creature (E) in H4, and there is an obstacle (X, such as a creature or Difficult Terrain) in the way, in square E3, you stop in square D2, since that was the last legal square on a straight line from A1 to H4'
    out.append(g)
    return [g.figure() for g in out], dict(last=sq(last), legal=[sq(c) for c in legal], blocked=[sq(c) for c in blocked])


charge_diagrams = straight_diagrams   # the old name (build_diagrams_draft.py)

def straight_large_diagram():
    """A Large creature's straight line (the core rework D4, 2026-11-21): the line joins the centers of its start and end spaces, and the
    whole 2 x 2 space moves together, each step the same as a Medium creature's from its top-left square."""
    rows, cols, S = 6, 9, 30; start, aim = (0, 0), (3, 6)
    steps = line_steps(start, aim, 'right'); path = [start] + [c for c, _, _ in steps]
    assert [sq(c) for c in path] == ['A1', 'B2', 'C2', 'D3', 'E3', 'F4', 'G4']
    foot = lambda c: [(c[0] + di, c[1] + dj) for di in (0, 1) for dj in (0, 1)]
    g = Svg(rows + 1, cols + 1, S)
    passed = {x for c in path[1:-1] for x in foot(c)} - set(foot(aim)) - set(foot(start))
    for c in passed: g.cell(c[0], c[1], 'gpass')
    for c in foot(aim): g.cell(c[0], c[1], 'gstop')
    g.outline(foot(aim))
    g.line((start[1] + 1, start[0] + 1), (aim[1] + 1, aim[0] + 1), 'gcenter')
    g.token_big(start[0], start[1], 2, 'Y', 'ally')
    g.caption = ('A Large creature (Y, in A1 to B2) moves in a straight line to the space G4 to H5. The line joins the centers of the two spaces, and the whole space '
                 'moves together, one step at a time, ties to the right as for a Medium creature; the blue squares are every square its space passes through')
    return g, dict(path=[sq(c) for c in path], passed=len(passed))

def on_the_line_diagram():
    """"On the line" (the core rework D6, 2026-11-21; reversed 2026-11-22, Lucas: "it shouldnt count"): a creature whose space the center line only
    touches at a corner gives no cover; the line must pass through its space."""
    rows, cols, S = 5, 6, 32; att, tgt, x = (4, 0), (0, 4), (2, 1)
    a, t = center(att), center(tgt)
    g = Svg(rows, cols, S)
    g.line(a, t, 'gcenter')
    corner = (2, 3)   # x = 2, y = 3: on the segment from (0.5, 4.5) to (4.5, 0.5), and the bottom-right corner of X's square (B3)
    assert abs((corner[0] - a[0]) * (t[1] - a[1]) - (corner[1] - a[1]) * (t[0] - a[0])) < 1e-9
    g.outline([x])
    g.token(x[0], x[1], 'X', 'neutral'); g.token(att[0], att[1], 'Y', 'ally'); g.token(tgt[0], tgt[1], 'T', 'enemy')
    g.over.append(f'<circle cx="{corner[0] * S}" cy="{corner[1] * S}" r="5" class="glean"/>')
    g.caption = 'The line from the center of your square (Y, A5) to the center of the target\'s (T, E1) only touches the corner of X\'s square (B3, the dot): it doesn\'t pass through it, so X gives no cover. Had the line crossed X\'s square, T would have Low cover (1 Field Bane), unless X were Prone or dead'
    return g, dict(corner=corner)


def difficult_diagram():
    g = Svg(1, 7, 44, 'Advance 5 squares across 2 Difficult Terrain squares (brown): each of those counts double. The numbers are the squares used so far')
    dtc = [(0, 2), (0, 3)]; g.cells(dtc, 'gdt')
    used = 0; seq = []
    for j in range(1, 6):
        used += 2 if (0, j) in dtc else 1; seq.append(used)
        g.text(0, j, used, 'gnum gbig', dy=5)
    g.token(0, 0, 'Y', 'ally', tr=0.3)
    return g.figure(), dict(total=used, seq=seq)

# ------------------------------------------------------------------ Pushed (the cone: every step goes within 45 degrees of the line from the origin)
def push_reach(origin, target, N, cone=45):
    DIRS = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
    o = (origin[0] + .5, origin[1] + .5); t = (target[0] + .5, target[1] + .5)
    bearing = math.atan2(t[0] - o[0], t[1] - o[1])
    def diff(d):
        a = math.atan2(d[0], d[1]) - bearing
        while a > math.pi: a -= 2 * math.pi
        while a < -math.pi: a += 2 * math.pi
        return abs(a)
    lim = math.radians(cone) + 1e-6
    dirs = [d for d in DIRS if diff(d) <= lim] or [min(DIRS, key=diff)]
    dd = lambda s: math.hypot(t[0] + s[0] - o[0], t[1] + s[1] - o[1])
    out = {(0, 0): 0}; layer = [(0, 0)]
    for step in range(1, N + 1):
        nxt = []
        for cur in layer:
            for a, b in dirs:
                s = (cur[0] + a, cur[1] + b)
                if s in out or dd(s) <= dd(cur) + 1e-9: continue
                out[s] = step; nxt.append(s)
        layer = nxt
    return out

def push_panel(origin, target, N, rows, cols, caption):
    g = Svg(rows, cols, 30, caption); r = push_reach(origin, target, N)
    for (di, dj), step in r.items():
        if step == 0: continue
        i, j = target[0] + di, target[1] + dj
        if 0 <= i < rows and 0 <= j < cols: g.cell(i, j, 'greach'); g.text(i, j, step)
    g.token(origin[0], origin[1], 'Y', 'ally'); g.token(target[0], target[1], 'G', 'enemy')
    return g.figure(), r

def push_diagram():
    N = 3
    a, _ = push_panel((0, N), (1, N), N, N + 2, 2 * N + 1, 'Pushed 3, straight away from you (you push G)')
    b, _ = push_panel((0, 0), (1, 1), N, N + 2, N + 2, 'Pushed 3, diagonal')
    return wrap([a, b], 'The numbered squares are where G can end, and the number is how many steps it takes.')


# ------------------------------------------------------------------ Pulled (a cone under 45 degrees from the creature, each square closer, and a creature next to the origin stops)
def pull_squares(G, O, N):
    cheb = lambda a, b: max(abs(a[0] - b[0]), abs(a[1] - b[1])); eu = lambda a, b: math.hypot(a[0] - b[0], a[1] - b[1])
    bearing = math.atan2(O[0] - G[0], O[1] - G[1]); allowed = set()
    for i in range(-4, 16):
        for j in range(-4, 16):
            v = (i - G[0], j - G[1])
            if v == (0, 0): continue
            a = abs((math.atan2(v[0], v[1]) - bearing + math.pi) % (2 * math.pi) - math.pi)
            if a < math.radians(45) - 1e-9: allowed.add((i, j))
    seen = {G}; layer = [G]; res = {}
    for step in range(1, N + 1):
        nxt = []
        for cur in layer:
            if cheb(cur, O) <= 1: continue
            for di in (-1, 0, 1):
                for dj in (-1, 0, 1):
                    n = (cur[0] + di, cur[1] + dj)
                    if n == cur or n == O or n in seen or n not in allowed or eu(n, O) >= eu(cur, O) - 1e-9: continue
                    seen.add(n); nxt.append(n); res[n] = step
        layer = nxt
    return res
def pull_diagram():
    out = []; info = {}
    for key, rows, cols, O, G, cap in (('straight', 5, 7, (4, 3), (1, 3), 'Pulled 3, straight toward you'), ('diagonal', 5, 5, (4, 0), (1, 3), 'Pulled 3, diagonal')):
        g = Svg(rows, cols, 30, cap); r = pull_squares(G, O, 3)
        for c, s in r.items():
            if 0 <= c[0] < rows and 0 <= c[1] < cols: g.cell(c[0], c[1], 'greach'); g.text(c[0], c[1], s)
        g.token(O[0], O[1], 'Y', 'ally'); g.token(G[0], G[1], 'G', 'enemy'); out.append(g); info[key] = {k: sorted(sq(c) for c, s in r.items() if s == k) for k in (1, 2, 3)}
    return wrap([g.figure() for g in out], 'The numbered squares are where G can end, and the number is how many steps it takes. You can stop G next to you, or name your own square as the destination: G stops next to you and Collision applies.'), info


# ------------------------------------------------------------------ Slid (a path the origin chooses; the origin needs Line of Effect at every square)
def slid_diagram():
    g = Svg(4, 5, 44, 'Slid 3: you slide G along a path you choose. G ends north of you after 2 squares of its value, beside the fire and never in it')
    g.cell(2, 1, 'ghaz'); g.text(2, 1, 'fire', 'gnum', dy=4, size=10)
    path = [(1, 1), (1, 0)]   # (row, column) of each square of the path, in order
    for n, (i, j) in enumerate(path, 1): g.cell(i, j, 'greach'); g.text(i, j, n, 'gnum gbig', dy=5)
    o = (0.5, 2.5)   # your center (Y) as (x, y): you stand in row 2, column 0
    for (i, j) in path: g.line(o, (j + .5, i + .5), 'glok ghalf')   # the Line of Effect from the origin to every square of the path
    g.token(2, 0, 'Y', 'ally'); g.token(2, 2, 'G', 'enemy')
    g.arrow((2.5, 2.5), (1.5, 1.5)); g.arrow((1.5, 1.5), (0.62, 1.5))   # the path of G
    return g.figure(), dict(path=path)

# ------------------------------------------------------------------ Reposition (a path that goes around creatures: it can't pass through them)
def reposition_diagram():
    # 2026-11-20 (Lucas): a Reposition stays within your Reach the whole way; you hold a Reach 2 weapon here
    g = Svg(3, 3, 44, 'Reposition 2 with Reach 2: G can\'t pass through Dave\'s square, so the path goes around him, within your Reach, to the square next to you')
    path = [(0, 1), (0, 0)]   # (row, column) of each square of the path, in order
    for n, (i, j) in enumerate(path, 1): g.cell(i, j, 'greach'); g.text(i, j, n, 'gnum gbig', dy=5)
    g.line((2.5, 1.5), (1.5, 1.5), 'glno ghalf')   # the straight way, through Dave: not allowed
    g.token(1, 0, 'Y', 'ally'); g.token(1, 1, 'D', 'ally'); g.token(1, 2, 'G', 'enemy')
    g.mark(2.0, 1.5, 'x')   # on the edge G would cross into Dave's square
    g.arrow((2.5, 1.5), (1.5, 0.5)); g.arrow((1.5, 0.5), (0.6, 0.5))   # the path of G, around Dave
    return g.figure(), dict(path=path)

# ------------------------------------------------------------------ Corners (anything solid that reaches the corner point makes it solid)
def corners_diagram():
    S = 56; out = []
    def base(kind, cap):
        g = Svg(2, 2, S, cap)
        g.token(1, 0, 'Y', 'ally')
        return g
    # a. a wall that ends at the corner
    g = base('wall', 'A wall ends at the corner: blocked'); g.wall((1, 1), (1, 2)); g.line((.5, 1.5), (1.5, .5), 'glno'); g.mark(1, 1, 'x'); out.append(g)
    # b. an object that fills the square beside the path: square corners, the whole square
    g = base('fill', 'An object that fills a square beside the path: blocked'); g.over.append(f'<rect x="{S}" y="{S}" width="{S}" height="{S}" class="gobj"/>'); g.line((.5, 1.5), (1.5, .5), 'glno'); g.mark(1, 1, 'x'); out.append(g)
    # c. a pillar that only occupies the corner
    g = base('pillar', 'A pillar on the corner: blocked'); g.over.append(f'<rect x="{S - 9}" y="{S - 9}" width="18" height="18" class="gobj"/>'); g.line((.5, 1.5), (1.5, .5), 'glno'); g.mark(1, 1, 'x'); out.append(g)
    # d. a small object in the middle of a square: it doesn't reach the corner
    g = base('small', 'A small object in the middle of a square: allowed'); g.over.append(f'<circle cx="{1.5 * S}" cy="{1.5 * S}" r="{S * 0.2}" class="gobj"/>'); g.line((.5, 1.5), (1.5, .5), 'glok'); g.mark(1, 1, 'ok'); out.append(g)
    # e. two creatures
    g = base('crea', 'Two creatures at the corner: allowed, but it is Difficult Terrain'); g.token(0, 0, 'A', 'enemy'); g.token(1, 1, 'B', 'enemy'); g.cell(0, 1, 'gdt'); g.text(0, 1, 2, 'gnum gbig', dy=5); g.line((.5, 1.5), (1.5, .5), 'glok'); g.mark(1, 1, 'ok'); out.append(g)
    return [g.figure() for g in out], {}

# ------------------------------------------------------------------ Squeezing (a Large creature through a gap one square wide)
def squeeze_diagram():
    g = Svg(4, 6, 40, 'A Large creature (2 \u00d7 2) squeezing through a gap 1 square wide: while it squeezes, each square it moves counts as Difficult Terrain')
    g.cell(2, 3, 'gdt')
    g.wall((3, 0), (3, 2)); g.wall((3, 3), (3, 4))
    g.token_big(1, 1, 2, 'L', 'ally')
    g.arrow((2.1, 2.5), (3.9, 2.5))
    return g.figure(), {}

# ------------------------------------------------------------------ the diagrams the book uses (a placeholder @@DIAGRAM:name@@ in a chapter file)
# ------------------------------------------------------------------ Senses (Chapter 3: the two questions) and Moving Away (Chapter 2)
ORDER = {'Clear': 3, 'Obscured': 2, 'Hidden': 1, 'Unsensed': 0}
def perceives(light, half_blinded=False, hears=True):
    """How a creature with Sight and Hearing perceives a creature standing in that light."""
    p = {'bright': 'Clear', 'dim': 'Obscured', 'dark': None}[light]
    if p == 'Clear' and half_blinded: p = 'Obscured'
    return p or ('Hidden' if hears else 'Unsensed')
def attack_result(mine, theirs):
    """The two questions of Senses. mine: how you perceive it; theirs: how it perceives you. Returns (text, good)."""
    if mine == 'Unsensed': return 'no target', False
    pen = {'Clear': '', 'Obscured': '1 Field Bane', 'Hidden': 'Doomed'}[mine]
    bonus = ''
    if mine != 'Hidden' and ORDER[theirs] < ORDER[mine]: bonus = '1 Field Boon' if theirs == 'Obscured' else 'Favored'
    if pen and bonus: return f'{pen}, {bonus}', False
    return (pen, False) if pen else (bonus, True) if bonus else ('normal', True)
def senses_diagrams():
    scenes = [('A torch in the dark', 'dark', 'bright', False), ('Both at the edge of the light', 'dim', 'dim', False),
              ('Both in Bright light; G is Half-Blinded', 'bright', 'bright', True), ('Both in Darkness', 'dark', 'dark', False)]
    figs, data = [], []
    for cap, ly, lg, hb in scenes:
        y_sees, g_sees = perceives(lg), perceives(ly, half_blinded=hb)
        ya, yok = attack_result(y_sees, g_sees); ga, gok = attack_result(g_sees, y_sees)
        data.append((cap, y_sees, g_sees, ya, ga))
        c = lambda ok: 'sgood' if ok else 'sbad'
        ys, gs = c(y_sees == 'Clear'), c(g_sees == 'Clear')
        sq = {'bright': 'gbright', 'dim': 'gdim', 'dark': 'gdark'}
        svg = (f'<svg viewBox="0 0 340 196" style="width:340px;max-width:100%" class="pushsvg" role="img" aria-label="{e(cap)}: Y perceives G {y_sees}, G perceives Y {g_sees}; Y attacks: {ya}; G attacks: {ga}">'
            f'<rect x="20" y="78" width="44" height="44" class="{sq[ly]}"/><rect x="276" y="78" width="44" height="44" class="{sq[lg]}"/>'
            f'<path d="M44 74 Q170 6 296 74" class="sarc {ys}"/><polygon points="296,74 285,73 290,64" class="shead {ys}"/>'
            f'<text x="170" y="26" class="stext {ys}">Y perceives G: <tspan font-weight="700">{y_sees}</tspan></text>'
            f'<path d="M72 92 L262 92" class="sline {c(yok)}"/><polygon points="270,92 260,87 260,97" class="shead {c(yok)}"/>'
            f'<text x="170" y="84" class="stext {c(yok)}">Y attacks: <tspan font-weight="700">{e(ya)}</tspan></text>'
            f'<path d="M268 110 L78 110" class="sline {c(gok)}"/><polygon points="70,110 80,105 80,115" class="shead {c(gok)}"/>'
            f'<text x="170" y="128" class="stext {c(gok)}">G attacks: <tspan font-weight="700">{e(ga)}</tspan></text>'
            f'<path d="M296 126 Q170 194 44 126" class="sarc {gs}"/><polygon points="44,126 55,127 50,136" class="shead {gs}"/>'
            f'<text x="170" y="184" class="stext {gs}">G perceives Y: <tspan font-weight="700">{g_sees}</tspan></text>'
            f'<circle cx="42" cy="100" r="15" fill="{ALLY}" class="gtokc"/><text x="42" y="105" class="gtok" font-size="14">Y</text>'
            f'<circle cx="298" cy="100" r="15" fill="{ENEMY}" class="gtokc"/><text x="298" y="105" class="gtok" font-size="14">G</text></svg>')
        figs.append(f'<figure style="--w:340px" data-h="196"><div class="figsvg">{svg}</div><figcaption>{e(cap)}</figcaption></figure>')
    return figs, data

def away_panel(rows, cols, you, path, caption, S=30):
    """A creature (G) moves along `path` (cells, the first is where it starts); each square shows its distance from you; the first square farther than the start is outlined."""
    g = Svg(rows, cols, S, caption); d0 = dist(you, path[0]); best = d0; first = None
    for c in path[1:]:
        d = dist(you, c)
        if first is None and d > best: first = c
        best = min(best, d) if first is None else best
        g.cell(c[0], c[1], 'gtie' if c == first else 'gpass'); g.text(c[0], c[1], d)
    g.token(you[0], you[1], 'Y', 'ally'); g.token(path[0][0], path[0][1], 'G', 'enemy')
    return g.figure(), dict(start=d0, first=first, dists=[dist(you, c) for c in path[1:]])
def away_diagrams():
    a = away_panel(3, 7, (1, 0), [(1, 2), (1, 3), (1, 4), (1, 5)], 'G starts 2 squares from you and runs: its first square (orange) is farther, so it moves away from there')
    b = away_panel(3, 7, (1, 0), [(1, 2), (0, 2), (0, 1)], 'G starts 2 squares from you and circles you: no square is farther from you than the one before it. It does not move away')
    c = away_panel(3, 7, (1, 3), [(1, 0), (1, 1), (1, 2), (0, 3), (1, 4), (1, 5), (1, 6)], 'G starts 3 squares from you and runs past: it comes closer (to 1), then the orange square is the first one farther than the square before it. It moves away from there')
    return [a[0], b[0], c[0]], [a[1], b[1], c[1]]

def wrap(figs, desc=''):
    """Figures side by side: their diagrams share one height (the tallest), so the captions under them start on the same line."""
    hh = max([int(h) for f in figs for h in re.findall(r'data-h="(\d+)"', f)] or [0])
    return f'<div class="pushfig" style="--hh:{hh}px">' + ''.join(figs) + (f'<p class="figdesc">{desc}</p>' if desc else '') + '</div>'

def book_diagram(name):
    if name == 'push': return push_diagram()
    if name == 'pull': return pull_diagram()[0]
    if name == 'slid':
        fig, _ = slid_diagram(); return wrap([fig], 'The numbered squares are the path, in order. The thin green lines are the Line of Effect from you (Y): it must reach G at every square.')
    if name == 'reposition':
        fig, _ = reposition_diagram(); return wrap([fig], 'The numbered squares are the path, in order. The red line is the straight way through Dave: a Reposition can\'t pass through a creature.')
    if name == 'corners':
        figs, _ = corners_diagram(); return wrap(figs, 'You (Y) move diagonally. A red X is a solid corner: you must go around. A green dot is an open corner.')
    if name == 'squeeze':
        fig, _ = squeeze_diagram(); return wrap([fig])
    if name in ('flanking1', 'flanking2', 'flanking3'):
        figs, _ = flanking_diagrams(); k = int(name[-1]); return wrap({1: figs[0:3], 2: figs[3:5], 3: figs[5:6]}[k])
    if name == 'cover':
        figs, _ = cover_diagrams()
        return wrap(figs[:6], 'The same attacker (A) and wall in the first five panels; only the target (T) moves. Green lines reach a corner of the target\'s space; red lines are blocked (X). In the last panel a creature (X) is on the line between the centers: Low cover.')
    if name == 'leaning':
        figs, _ = cover_diagrams(); return wrap([figs[6]], 'The pale lines are the lines from the center of A\'s square; the green dot is the corner A leans from.')
    if name == 'flanking':
        figs, _ = flanking_diagrams()
        return wrap(figs, 'Blue tokens are allies and red-brown tokens are enemies. A badge is the Boons that creature gets on [Melee] Actions against the creature in the middle (G, John in the fifth picture) or against D in the last one.')
    if name == 'engaged': fig, _ = engaged_diagram(); return wrap([fig])
    if name == 'reach':
        figs, _ = reach_diagrams(); return wrap(figs, 'The numbers are the distance in squares from the creature in the middle.')
    if name == 'emanation':
        figs, _ = emanation_diagrams(); return wrap(figs)
    if name == 'light':
        fig, _ = light_diagram(); return wrap([fig], 'Bright squares: strong color. Dim squares: pale. The torch is the dot in the middle.')
    if name == 'burst':
        figs, _ = burst_diagrams(); return wrap(figs, 'The dot is the corner the Burst is centered on.')
    if name == 'straight-large':
        fig, _ = straight_large_diagram(); return wrap([fig.figure()])
    if name == 'on-the-line':
        fig, _ = on_the_line_diagram(); return wrap([fig.figure()])
    if name in ('straight', 'charge'):
        figs, _ = straight_diagrams(); return wrap(figs)
    if name in ('line1', 'line2', 'line3'):
        figs, _ = line_diagrams(); k = int(name[-1])
        return wrap({1: figs[0:4], 2: figs[4:6], 3: figs[6:9]}[k], {1: 'Y is you. The number in each square is its distance from you, counted as for any distance. The dashed line is the segment from the center of your square through the square you aim at (outlined).',
                    2: 'Orange squares are ties (the segment passes exactly between two squares): every tie takes the side you chose. Dashed squares are the other side, not taken.',
                    3: 'Y is you. The dashed line is the segment; the outlined square is the one aimed at.'}[k])
    if name == 'senses':
        figs, _ = senses_diagrams(); return wrap(figs, 'Y is you; G is a goblin. Both have only Sight and Hearing. Yellow square: Bright light; pale: Dim light; dark: Darkness. A curved dashed arrow is how one perceives the other; a straight arrow is what that gives its Actions. Green is good for the one acting, orange is bad.')
    if name == 'movingaway':
        figs, _ = away_diagrams(); return wrap(figs, 'Y is you. Blue and orange squares are the squares G enters, in order from G; the number in each is its distance from you.')
    if name == 'difficult':
        fig, _ = difficult_diagram(); return wrap([fig])
    raise KeyError(f'no diagram called {name}')

CSS = '''
.pushsvg .gdark{fill:#3a3732;stroke:#d9d3c7}.pushsvg .sgood{--sc:#2f7d4d}.pushsvg .sbad{--sc:#b85a14}.pushsvg .sarc{fill:none;stroke:var(--sc);stroke-width:2;stroke-dasharray:5 4}.pushsvg .sline{fill:none;stroke:var(--sc);stroke-width:3}.pushsvg .shead{fill:var(--sc)}.pushsvg .stext{fill:var(--sc);font:500 13px system-ui,sans-serif;text-anchor:middle}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pushsvg .gdark{fill:#0e0d0c;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .sgood{--sc:#7fc79a}:root:not([data-theme="light"]) .pushsvg .sbad{--sc:#e89a5a}}
:root[data-theme="dark"] .pushsvg .gdark{fill:#0e0d0c;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .sgood{--sc:#7fc79a}:root[data-theme="dark"] .pushsvg .sbad{--sc:#e89a5a}
.pushsvg .gcell{fill:#fff;stroke:#d9d3c7}.pushsvg .greach{fill:#ecd98b;stroke:#d9d3c7}.pushsvg .gdt{fill:#d9c3a0;stroke:#b79e74}
.pushsvg .gbright{fill:#f1d760;stroke:#d9d3c7}.pushsvg .gdim{fill:#f7ecbd;stroke:#d9d3c7}
.pushsvg .gcoord{font:600 10px system-ui,sans-serif;fill:#8a7f6a;text-anchor:middle}.pushsvg .gcoordr{text-anchor:end}
.pushsvg .gnum{font:600 11px system-ui,sans-serif;fill:#22201c;text-anchor:middle}.pushsvg .gfar{fill:#a39c8f;font-weight:400}.pushsvg .gbig{font-size:14px}
.pushsvg .glabel{font:600 10px system-ui,sans-serif;fill:#6b5a3a}
.pushsvg .gtok{font-family:system-ui,sans-serif;font-weight:700;fill:#fff;text-anchor:middle}
.pushsvg .gout{fill:none;stroke:#8a7650;stroke-width:2.2}
.pushsvg .gring{fill:none;stroke-width:2.4}
.pushsvg .gthreat{stroke:#4b7aa6;stroke-width:1.4;opacity:.65}
.pushsvg .gbadge{fill:#2f6f3d}.pushsvg .gbt{font:700 10px system-ui,sans-serif;fill:#fff;text-anchor:middle}
.pushsvg .gwall{stroke:#3a3732;stroke-width:5;stroke-linecap:butt}
.pushsvg .glok{stroke:#3a8f5b;stroke-width:1.6}.pushsvg .glno{stroke:#c0392b;stroke-width:1.6}.pushsvg .ghalf{opacity:.35;stroke-dasharray:3 3}
.pushsvg .gx{stroke:#c0392b;stroke-width:2.2;fill:none}.pushsvg .gok{fill:#3a8f5b}
.pushsvg .gcenter{stroke:#6b5a3a;stroke-width:1.6;stroke-dasharray:5 3}
.pushsvg .glean{fill:#3a8f5b;stroke:#fff;stroke-width:1.5}
.pushsvg .gend{fill:none;stroke:#3a8f5b;stroke-width:2.6}.pushsvg .gcirc{fill:none;stroke:#b8860b;stroke-width:1.6}.pushsvg .gcirc2{stroke-dasharray:5 3}.pushsvg .glight{fill:#b8860b}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pushsvg .gcell{fill:#24221f;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .greach{fill:#6d5e22;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .gdt{fill:#5a4a33;stroke:#7a6648}:root:not([data-theme="light"]) .pushsvg .gbright{fill:#8a7524;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .gdim{fill:#4a4228;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .gnum{fill:#ece8df}:root:not([data-theme="light"]) .pushsvg .gcoord{fill:#a39c8f}:root:not([data-theme="light"]) .pushsvg .gfar{fill:#7d776b}:root:not([data-theme="light"]) .pushsvg .glabel{fill:#d6c9a8}:root:not([data-theme="light"]) .pushsvg .gwall{stroke:#cfc8bb}:root:not([data-theme="light"]) .pushsvg .gcenter{stroke:#d6c9a8}:root:not([data-theme="light"]) .pushsvg .gout{stroke:#c8b48a}:root:not([data-theme="light"]) .pushsvg .glok{stroke:#58c98a}:root:not([data-theme="light"]) .pushsvg .glno,:root:not([data-theme="light"]) .pushsvg .gx{stroke:#ff7d6e}:root:not([data-theme="light"]) .pushsvg .gok{fill:#58c98a}:root:not([data-theme="light"]) .pushsvg .gthreat{stroke:#8bb4dc}:root:not([data-theme="light"]) .pushsvg .gcirc,:root:not([data-theme="light"]) .pushsvg .glight{stroke:#f1c84b;fill:none}:root:not([data-theme="light"]) .pushsvg .glight{fill:#f1c84b}:root:not([data-theme="light"]) .pushsvg .gend{stroke:#58c98a}}
:root[data-theme="dark"] .pushsvg .gcell{fill:#24221f;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .greach{fill:#6d5e22;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .gdt{fill:#5a4a33;stroke:#7a6648}:root[data-theme="dark"] .pushsvg .gbright{fill:#8a7524;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .gdim{fill:#4a4228;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .gnum{fill:#ece8df}:root[data-theme="dark"] .pushsvg .gcoord{fill:#a39c8f}:root[data-theme="dark"] .pushsvg .gfar{fill:#7d776b}:root[data-theme="dark"] .pushsvg .glabel{fill:#d6c9a8}:root[data-theme="dark"] .pushsvg .gwall{stroke:#cfc8bb}:root[data-theme="dark"] .pushsvg .gcenter{stroke:#d6c9a8}:root[data-theme="dark"] .pushsvg .gout{stroke:#c8b48a}:root[data-theme="dark"] .pushsvg .glok{stroke:#58c98a}:root[data-theme="dark"] .pushsvg .glno,:root[data-theme="dark"] .pushsvg .gx{stroke:#ff7d6e}:root[data-theme="dark"] .pushsvg .gok{fill:#58c98a}:root[data-theme="dark"] .pushsvg .gthreat{stroke:#8bb4dc}:root[data-theme="dark"] .pushsvg .gcirc{stroke:#f1c84b}:root[data-theme="dark"] .pushsvg .glight{fill:#f1c84b}:root[data-theme="dark"] .pushsvg .gend{stroke:#58c98a}
.pushsvg .gobj{fill:#9a7b57;stroke:#5e4630;stroke-width:2}.pushsvg .ghaz{fill:#f0c4b8;stroke:#c0392b}\
.pushsvg .gpath{stroke:#6b5a3a;stroke-width:2.4}.pushsvg .gpathhead{fill:#6b5a3a}
.pushsvg .gpass{fill:#6fa8dc;fill-opacity:.55}.pushsvg .gstop{fill:#5fbf86;fill-opacity:.7}.pushsvg .gblock{fill:#e07a6a;fill-opacity:.55}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pushsvg .gpass{fill:#4a7fb5;fill-opacity:.7}:root:not([data-theme="light"]) .pushsvg .gstop{fill:#3f9b66;fill-opacity:.8}:root:not([data-theme="light"]) .pushsvg .gblock{fill:#b8503f;fill-opacity:.7}}
:root[data-theme="dark"] .pushsvg .gpass{fill:#4a7fb5;fill-opacity:.7}:root[data-theme="dark"] .pushsvg .gstop{fill:#3f9b66;fill-opacity:.8}:root[data-theme="dark"] .pushsvg .gblock{fill:#b8503f;fill-opacity:.7}
.pushfig .figsvg{min-height:var(--hh,0)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pushsvg .gobj{fill:#7a6248;stroke:#b79e74}:root:not([data-theme="light"]) .pushsvg .ghaz{fill:#6a3a30;stroke:#ff7d6e}:root:not([data-theme="light"]) .pushsvg .gpath{stroke:#d6c9a8}:root:not([data-theme="light"]) .pushsvg .gpathhead{fill:#d6c9a8}}
:root[data-theme="dark"] .pushsvg .gobj{fill:#7a6248;stroke:#b79e74}:root[data-theme="dark"] .pushsvg .ghaz{fill:#6a3a30;stroke:#ff7d6e}:root[data-theme="dark"] .pushsvg .gpath{stroke:#d6c9a8}:root[data-theme="dark"] .pushsvg .gpathhead{fill:#d6c9a8}
.pushfig figure{max-width:var(--w,290px)}
.pushsvg .gtie{fill:#e9a25a;stroke:#d9d3c7}.pushsvg .gdash{fill:none;stroke:#8a7650;stroke-width:1.6;stroke-dasharray:4 3}.pushsvg .gaim{fill:none;stroke:#6b5a3a;stroke-width:2}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .pushsvg .gtie{fill:#9a5a22;stroke:#3a3732}:root:not([data-theme="light"]) .pushsvg .gdash{stroke:#c8b48a}:root:not([data-theme="light"]) .pushsvg .gaim{stroke:#d6c9a8}}
:root[data-theme="dark"] .pushsvg .gtie{fill:#9a5a22;stroke:#3a3732}:root[data-theme="dark"] .pushsvg .gdash{stroke:#c8b48a}:root[data-theme="dark"] .pushsvg .gaim{stroke:#d6c9a8}
'''
