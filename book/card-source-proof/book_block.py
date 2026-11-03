# Pack CS proof (2026-11-03): the book side in Python (what build_rules.py would do with a @@CARD:Name@@ marker):
# render the card block from cards.json and diff it against the block written in rules-src today. No dependency beyond the standard library.
# Run from the repository root: python3 book/card-source-proof/book_block.py
import json, re, os, sys, difflib
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
cards = json.load(open(os.path.join(HERE, 'cards.json')))['cards']
cap = lambda s: s[0].upper() + s[1:]
reaction = lambda c: bool(c.get('interrupt') or c.get('trigger'))

def block(c):
    aps = [v['ap'] for v in c.get('versions', [])]
    cost = ('%sR' % ' / '.join(map(str, aps)) if reaction(c) else '%s AP' % ' / '.join(map(str, aps))) if aps else ''
    L = ['<div class="action" markdown="1">',
         '<div class="action-head"><span>%s</span>%s<span class="cat">%s%s</span></div>' % (c['name'], '<span>%s</span>' % cost if cost else '', c['category'], ' %d' % c['level'] if c.get('level') else ''), '']
    if c.get('flavor'): L += ['**Flavor:** %s' % c['flavor'], '']
    if c.get('traits'): L += ['*%s*' % ' • '.join(cap(t) for t in c['traits']), '']
    for k in ('Escalation', 'Frequency', 'Target', 'Area', 'Distance', 'Vs', 'Requirements', 'Interrupt', 'Trigger'):
        if c.get(k.lower()): L += ['**%s:** %s' % (k, c[k.lower()]), '']
    if c.get('rules'): L += [c['rules'], '']
    vs = c.get('versions', [])
    if vs:
        head = ['%dR' % v['ap'] if reaction(c) else '%d AP' % v['ap'] for v in vs]
        if any('tiers' in v for v in vs):
            L += ['| | %s |' % ' | '.join(head), '|---|%s|' % '|'.join('---' for _ in head)]
            for t in range(3): L.append('| **Tier %d** | %s |' % (t + 1, ' | '.join(v['tiers'][t] for v in vs)))
            if any(v.get('critical') for v in vs): L.append('| **Critical** | %s |' % ' | '.join(v.get('critical', '') for v in vs))
            if any(v.get('effects') for v in vs): L.append('| **Effects** | %s |' % ' | '.join(v.get('effects', '') for v in vs))
        else:
            L += ['| %s |' % ' | '.join(head), '|%s|' % '|'.join('---' for _ in head), '| %s |' % ' | '.join(v.get('effects', '') for v in vs)]
        L.append('')
    if c.get('notes'): L += [c['notes'], '']
    L.append('</div>')
    return '\n'.join(L)

def today(name):
    src = os.path.join(ROOT, 'book', 'rules-src')
    for f in sorted(os.listdir(src)):
        if not re.match(r'\d\d-.*\.md$', f): continue
        for m in re.finditer(r'<div class="action" markdown="1">.*?\n</div>', open(os.path.join(src, f), encoding='utf8').read(), re.S):
            if '<div class="action-head"><span>%s</span>' % name in m.group(0): return f, m.group(0)
    return None, '(not found)'

ok = True
for c in cards:
    f, t = today(c['name']); mine = block(c)
    if t == mine: print('%s: IDENTICAL to rules-src/%s (%d lines)' % (c['name'], f, len(mine.split('\n'))))
    else:
        ok = False; print('%s: DIFFERENT from rules-src/%s' % (c['name'], f))
        print('\n'.join(difflib.unified_diff(t.split('\n'), mine.split('\n'), 'today', 'mine', lineterm='')))
print('ALL MATCH' if ok else 'SOMETHING DIFFERS'); sys.exit(0 if ok else 1)
