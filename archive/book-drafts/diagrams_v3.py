"""DRAFT (2026-10-24): the diagrams Lucas asked for in the Core review (straight line, corners, Pulled). Not used by the book until approved."""
import math, re
import diagrams as D
from diagrams import Svg, center

# ---- the squares of a straight line, one per step (the same walk as Foundry's cellLine)
def bres(a, b):
    out = []; x, y = a[1], a[0]; dx = abs(b[1] - x); dy = -abs(b[0] - y); sx = 1 if x < b[1] else -1; sy = 1 if y < b[0] else -1; err = dx + dy
    while True:
        out.append((y, x))
        if (x, y) == (b[1], b[0]): break
        e2 = 2 * err
        if e2 >= dy: err += dy; x += sx
        if e2 <= dx: err += dx; y += sy
    return out
def sq(c): return 'ABCDEFGHIJ'[c[1]] + str(c[0] + 1)

def straight_v3():
    rows, cols, S = 6, 9, 30; start = (0, 0); out = []
    # 1. a clear line: A1 to G4
    aim = (3, 6); path = bres(start, aim)
    assert [sq(c) for c in path] == ['A1', 'B2', 'C2', 'D3', 'E3', 'F4', 'G4']
    g = Svg(rows, cols, S)
    for c in path[1:-1]: g.cell(c[0], c[1], 'gpass')
    g.cell(aim[0], aim[1], 'gstop')
    g.line(center(start), center(aim), 'gcenter'); g.token(start[0], start[1], 'Y', 'ally')
    g.caption = 'A straight line from the center of your square (A1) to the center of another square (G4). The colored squares are the movement the token would make using an Action that requires a straight line, such as Charge'
    out.append(g)
    # 2. an obstacle on the line: the movement stops on the last legal square
    aim2 = (3, 7); path2 = bres(start, aim2); obst = (2, 4)
    assert [sq(c) for c in path2] == ['A1', 'B1', 'C2', 'D2', 'E3', 'F3', 'G4', 'H4']
    k = path2.index(obst); legal, last, blocked = path2[1:k - 1], path2[k - 1], path2[k:]
    g = Svg(rows, cols, S)
    for c in legal: g.cell(c[0], c[1], 'gpass')
    g.cell(last[0], last[1], 'gstop')
    for c in blocked: g.cell(c[0], c[1], 'gblock')
    g.line(center(start), center(aim2), 'gcenter')
    g.token(start[0], start[1], 'Y', 'ally'); g.token(obst[0], obst[1], 'X', 'neutral'); g.token(aim2[0], aim2[1], 'E', 'enemy')
    g.caption = 'A straight line stops on the last legal square. If you (Y, in A1) attempt to Charge toward the creature (E) in H4, and there is an obstacle (X, such as a creature or Difficult Terrain) in the way, in square E3, you stop in square D2, since that was the last legal square on a straight line from A1 to H4'
    out.append(g)
    return out, dict(last=sq(last), legal=[sq(c) for c in legal], blocked=[sq(c) for c in blocked])

def corners_v3():
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
    return out

# ---- Pulled: a cone with its apex on the creature (the 45 degree edge does not count), each square closer to the origin, and a creature next to the origin stops
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
def pull_v3():
    out = []; info = {}
    for key, rows, cols, O, G, cap in (('straight', 5, 7, (4, 3), (1, 3), 'Pulled 3, straight toward you'), ('diagonal', 5, 5, (4, 0), (1, 3), 'Pulled 3, diagonal')):
        g = Svg(rows, cols, 30, cap); r = pull_squares(G, O, 3)
        for c, s in r.items():
            if 0 <= c[0] < rows and 0 <= c[1] < cols: g.cell(c[0], c[1], 'greach'); g.text(c[0], c[1], s)
        g.token(O[0], O[1], 'Y', 'ally'); g.token(G[0], G[1], 'G', 'enemy'); out.append(g); info[key] = {k: sorted(sq(c) for c, s in r.items() if s == k) for k in (1, 2, 3)}
    return out, info

EXTRA_CSS = '.pushsvg .gpass{fill:#6fa8dc;fill-opacity:.55}.pushsvg .gstop{fill:#5fbf86;fill-opacity:.7}.pushsvg .gblock{fill:#e07a6a;fill-opacity:.55}'
if __name__ == '__main__':
    import cairosvg, subprocess
    css = re.sub(r'@media \(prefers-color-scheme:dark\)\{.*?\}\}\n', '', D.CSS, flags=re.S); css = '\n'.join(l for l in css.split('\n') if not l.startswith(':root[data-theme="dark"]')) + EXTRA_CSS
    st, fs = straight_v3(); co = corners_v3(); pl, pi = pull_v3()
    print('straight:', fs); print('pulled squares:', pi)
    def png(g, name):
        svg = g.svg().replace('class="pushsvg"', '').replace('style="width:', 'data-w="').replace(';max-width:none"', '"').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', 1)
        svg = re.sub(r'(<svg[^>]*>)', r'\1<style>' + css.replace('.pushsvg ', '') + '</style><rect width="100%" height="100%" fill="#fbfaf7"/>', svg, count=1)
        cairosvg.svg2png(bytestring=svg.encode(), write_to=name, scale=1.7)
    files = {}
    for k, g in enumerate(st): png(g, f'/tmp/v3_straight{k}.png')
    for k, g in enumerate(co): png(g, f'/tmp/v3_corner{k}.png')
    for k, g in enumerate(pl): png(g, f'/tmp/v3_pull{k}.png')
    caps = {'s': [g.caption for g in st], 'c': [g.caption for g in co], 'p': [g.caption for g in pl]}
    import json; json.dump(caps, open('/tmp/v3_caps.json', 'w'))
