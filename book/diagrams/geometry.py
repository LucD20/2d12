"""The geometry behind the diagrams. Cells are (row, column); a cell spans x in [col, col+1] and y in [row, row+1]. Walls are segments between grid points."""
import math

EPS = 1e-9

def seg_cross(p, q, a, b, end_margin=0.0):
    """Do the segments p-q and a-b cross? A line that only touches the end of a wall is not blocked (a-b are the wall's ends)."""
    (px, py), (qx, qy), (ax, ay), (bx, by) = p, q, a, b
    r = (qx - px, qy - py); s = (bx - ax, by - ay)
    den = r[0] * s[1] - r[1] * s[0]
    if abs(den) < EPS: return False          # parallel: along the wall or apart, never "through" it
    t = ((ax - px) * s[1] - (ay - py) * s[0]) / den     # along the line of sight
    u = ((ax - px) * r[1] - (ay - py) * r[0]) / den     # along the wall
    if not (-EPS <= t <= 1 + EPS): return False
    if u <= end_margin + EPS or u >= 1 - end_margin - EPS: return False   # only touches an end of the wall
    return True

def center(cell): return (cell[1] + 0.5, cell[0] + 0.5)
def corners(cell):
    i, j = cell
    return [(j, i), (j + 1, i), (j, i + 1), (j + 1, i + 1)]

def blocked_corners(origin, cell, walls):
    """The corners of the target's space that are blocked from the point `origin` (the center of the attacker's square, or one of its corners when Leaning)."""
    return [c for c in corners(cell) if any(seg_cross(origin, c, w[0], w[1]) for w in walls)]

def cover_name(n): return ["None", "Low", "Medium", "High", "Total"][n]

def dist(a, b):
    """Squares between two cells: every second diagonal counts as 2."""
    dx, dy = abs(a[0] - b[0]), abs(a[1] - b[1])
    return max(dx, dy) + min(dx, dy) // 2

def margin(origin, cell, walls):
    """How close the picture is to an ambiguous case (a line grazing a wall's end): the smallest distance from a wall end to a line of sight."""
    m = 9
    for c in corners(cell):
        for w in walls:
            for e in w:
                (px, py), (qx, qy) = origin, c
                L = math.hypot(qx - px, qy - py)
                d = abs((qx - px) * (py - e[1]) - (px - e[0]) * (qy - py)) / L
                # only wall ends that lie between origin and corner matter
                t = ((e[0] - px) * (qx - px) + (e[1] - py) * (qy - py)) / (L * L)
                if 0 < t < 1: m = min(m, d)
    return m
