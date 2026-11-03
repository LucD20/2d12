"""The cards (book/cards/*.json), for the book builder: load them and render a card's Markdown block, the one build_rules.py card() reads.

A chapter writes `@@CARD:Name@@` where the card goes; the builder replaces the marker with the block this module renders, so the HTML is
the same as when the block was written in the chapter. The format: book/cards/README.md. No dependency beyond the standard library.
"""
import json, os, glob

CARDS_DIR = 'cards'   # beside rules-src/, from the folder build_rules.py runs in
FIELDS = ('Escalation', 'Frequency', 'Target', 'Area', 'Distance', 'Vs', 'Requirements', 'Prerequisites', 'Interrupt', 'Trigger', 'Setup')

def load(cards_dir=CARDS_DIR):
    """Every card of every file, in file order; each card knows its file. Raises on a duplicate name or a card with no name."""
    out, names = [], {}
    for f in sorted(glob.glob(os.path.join(cards_dir, '*.json'))):
        data = json.load(open(f, encoding='utf8'))
        for c in data.get('cards', []):
            if not c.get('name'): raise SystemExit(f'{f}: a card has no name')
            if c['name'] in names: raise SystemExit(f'{f}: the card "{c["name"]}" is also in {names[c["name"]]}')
            names[c['name']] = f
            c['_file'] = os.path.basename(f)
            out.append(c)
    return out

def by_name(cards): return {c['name']: c for c in cards}

reaction = lambda c: bool(c.get('interrupt') or c.get('trigger'))
cap = lambda s: s[0].upper() + s[1:]

def cost_text(c):
    aps = [v['ap'] for v in c.get('versions', [])]
    if not aps: return ''
    return '%sR' % ' / '.join(map(str, aps)) if reaction(c) else '%s AP' % ' / '.join(map(str, aps))

def block(c):
    """The card as a rules-src Markdown block (see rules-src/README.md, 'An Action card')."""
    cost = cost_text(c)
    L = ['<div class="action" markdown="1">',
         '<div class="action-head"><span>%s</span>%s<span class="cat">%s%s</span></div>' % (
             c['name'], '<span>%s</span>' % cost if cost else '', c['category'], ' %d' % c['level'] if c.get('level') else ''), '']
    if c.get('flavor'): L += ['**Flavor:** %s' % c['flavor'], '']
    if c.get('traits'): L += ['*%s*' % ' • '.join(cap(t) for t in c['traits']), '']
    for k in FIELDS:
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
    elif c.get('text'): L += [c['text'], '']
    if c.get('notes'): L += [c['notes'], '']
    for m in c.get('modifies', []): L += [m, '']
    L.append('</div>')
    return '\n'.join(L)

def expand(text, cards, fn, problems):
    """Replaces every `@@CARD:Name@@` line of a chapter with the card's block. A card that is not in the files is left as a visible placeholder and reported."""
    import re
    def rep(m):
        name = m.group(1).strip()
        c = cards.get(name)
        if not c: problems.append(f'{fn}: @@CARD:{name}@@ is not in {CARDS_DIR}/'); return m.group(0)
        if c.get('book') is False: problems.append(f'{fn}: @@CARD:{name}@@ is a card the book does not show (book: false)'); return ''
        return block(c)
    return re.sub(r'^@@CARD:(.+?)@@[ \t]*$', rep, text, flags=re.M)
