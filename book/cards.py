"""The cards (book/cards/*.json), for the book builder: load them and give each one in the card Structure that build_rules.py card() draws.

A chapter writes `@@CARD:Name@@` where the card goes. Two sources feed the book (the format: book/cards/README.md):
- the old files (book/cards/*.json), read by the book, Foundry and the ruler; `structure()` adapts an old card to the Structure without changing a word;
- the Structure files (book/cards/stage0/*.json, `"structure": 2`), read ONLY by the book: a card there takes the place of the old card of the same name.
No dependency beyond the standard library.
"""
import json, os, glob, re

CARDS_DIR = 'cards'   # beside rules-src/, from the folder build_rules.py runs in
NEW_DIR = 'stage0'    # inside CARDS_DIR: the cards already written in the Structure

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

def load_book(cards_dir=CARDS_DIR):
    """The cards the BOOK shows: the old files' cards in file order, each replaced by the Structure card of the same name when stage0/ has one,
    then the Structure cards with a new name. (load() alone is what Foundry and the ruler see, through load.mjs.)"""
    new = {}
    for f in sorted(glob.glob(os.path.join(cards_dir, NEW_DIR, '*.json'))):
        data = json.load(open(f, encoding='utf8'))
        if data.get('structure') != 2: raise SystemExit(f'{f}: not a Structure file ("structure": 2)')
        for c in data.get('cards', []):
            if not c.get('name'): raise SystemExit(f'{f}: a card has no name')
            if c['name'] in new: raise SystemExit(f'{f}: the card "{c["name"]}" is also in {new[c["name"]]["_file"]}')
            c['structure'] = 2; c['_file'] = NEW_DIR + '/' + os.path.basename(f)
            new[c['name']] = c
    out = [new.pop(c['name'], None) or c for c in load(cards_dir)]
    return out + list(new.values())

def by_name(cards): return {c['name']: c for c in cards}

reaction = lambda c: bool(c.get('interrupt') or c.get('trigger'))
cap = lambda s: s[0].upper() + s[1:]
ROLLS = ('weapon', 'power', 'signature', 'body', 'instinct', 'mind', 'appeal')   # the Roll traits that name what is rolled
DEFENSE = {'AD': 'Armor Defense', 'WD': 'Ward Defense'}

def or_list(xs):
    xs = [str(x) for x in xs]
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' or ' + xs[-1]

def cost_text(c):
    """The bar's cost: "2 AP", "1 or 2 AP", "1, 2 or 3 AP", "1R"; "Passive" for a card with no cost and no Versions (not a placeholder)."""
    if c.get('structure') == 2: return c.get('cost', '')
    aps = sorted({v['ap'] for v in c.get('versions', [])})
    if aps: return or_list(aps) + ('R' if reaction(c) else ' AP')
    if c.get('cost'): return c['cost']   # a costed card with no table (Opportunity Attack: 1R and prose)
    return 'Passive' if c.get('text') and not c.get('placeholder') else ''

def _line(label, text): return {'label': label, 'text': text}

def _version_lines(c, v):
    """An old Version's lines: the Tiers, the Critical, then the old Effects cell under the label that says when it happened."""
    L = [_line('Tier %d' % (k + 1), t) for k, t in enumerate(v.get('tiers', []))]
    if v.get('critical'): L.append(_line('Critical', v['critical']))
    if v.get('effects'):
        # general Effects happened on a Tier 2 or 3; on a Save Action the Tiers are the target's result, so on its Tier 1 or 2 (Chapter 1, Save Actions)
        label = 'Effect' if not v.get('tiers') else 'Tier 1 or 2' if 'save' in c.get('traits', []) else 'Tier 2 or 3'
        L.append(_line(label, v['effects']))
    return L

def structure(c):
    """The card in the Structure (card-structure.md, "THE STRUCTURE, WHOLE"): name, escalation, frequency, cost, flavor, traits, distance, area,
    target, body ([{label, text}], in play order), blocks ([{heading, traits, distance, target, body}]). A Structure card is returned as it is
    written; an old card is adapted: its words don't change, only where they sit and the label above them."""
    s = {k: c.get(k) for k in ('name', 'escalation', 'frequency', 'flavor', 'distance', 'area', 'target')}
    s.update(traits=c.get('traits', []), cost=cost_text(c), body=[], blocks=[], after=[])
    s['passive'] = s['cost'] == 'Passive'
    if c.get('structure') == 2:
        s.update(body=c.get('body', []), blocks=c.get('blocks', []))
        return s
    B = s['body']
    for key, label in (('requirements', 'Requirement'), ('prerequisites', 'Prerequisite'), ('interrupt', 'Interrupt'), ('trigger', 'Trigger'), ('setup', 'Setup'), ('rules', 'Special')):
        if c.get(key): B.append(_line(label, c[key]))
    vs = c.get('vs')
    if vs and vs.endswith(' Save'): B.append(_line('Save', vs[:-5]))
    elif vs:
        roll = ' or '.join(cap(t) for t in c.get('traits', []) if t in ROLLS)
        # 'A or B (the one used to roll)': the roll and the Defense are the same Attribute, so say it once
        dfn = "the target's same Attribute" if vs.endswith('(the one used to roll)') else DEFENSE.get(vs, vs)
        B.append(_line('Attack', (roll + ' ' if roll else '') + 'vs. ' + dfn))
    versions = c.get('versions', [])
    if len(versions) == 1: B += _version_lines(c, versions[0])
    else:
        for v in versions:
            heading = cap(v['mode']) if v.get('mode') else '%d%s' % (v['ap'], 'R' if reaction(c) else ' AP')
            s['blocks'].append({'heading': heading, 'body': _version_lines(c, v)})
    if c.get('text'):
        B.append(_line('' if c.get('placeholder') else 'Passive' if s['passive'] else 'Effect', c['text']))
    after = [_line('Special', c['notes'])] if c.get('notes') else []
    # an inline Action, one line in Lucas's format: Name — cost | Frequency | [traits] | Interrupt: ... | Effects: ...
    for a in c.get('inline', []):
        parts = [a.get('cost', ''), a.get('frequency', '')]
        if a.get('traits'): parts.append('[%s]' % ', '.join(cap(t) for t in a['traits']))
        for k in ('interrupt', 'trigger', 'target', 'requirements', 'effects'):
            if a.get(k): parts.append('%s: %s' % (cap(k), a[k]))
        after.append(_line('Special', '**%s** \u2014 %s' % (a['name'], ' | '.join(p for p in parts if p))))
    after += [_line('Special', m) for m in c.get('modifies', [])]
    if s['blocks']: s['after'] = after   # lines that follow the blocks and belong to the whole card (drawn under a rule)
    else: B += after
    return s

def lines(c):
    """The card as plain lines ("Label: text"), for the search of a term (rules_tools.where)."""
    s = structure(c)
    out = [s['name'], ' \u00b7 '.join(str(x) for x in (s['escalation'] and 'Escalation %s' % s['escalation'], s['frequency'], s['cost']) if x), s['flavor'] or '',
           ' \u00b7 '.join(cap(t) for t in s['traits'])]
    def part(d):
        o = ['%s: %s' % (k.capitalize(), d[k]) for k in ('distance', 'area', 'target') if d.get(k)]
        return o + [(l['label'] + ': ' if l['label'] else '') + l['text'] for l in d.get('body', [])]
    out += part(s)
    for b in s['blocks']: out += [' \u00b7 '.join([b['heading']] + [cap(t) for t in b.get('traits', [])])] + part(b)
    out += [l['label'] + ': ' + l['text'] for l in s['after']]
    return [o for o in out if o]

def expand(text, cards, fn, problems, render):
    """Replaces every `@@CARD:Name@@` line of a chapter with render(card). A card that is not in the files is left as a visible placeholder and reported."""
    def rep(m):
        name = m.group(1).strip()
        c = cards.get(name)
        if not c: problems.append(f'{fn}: @@CARD:{name}@@ is not in {CARDS_DIR}/'); return m.group(0)
        if c.get('book') is False: problems.append(f'{fn}: @@CARD:{name}@@ is a card the book does not show (book: false)'); return ''
        return render(c)
    return re.sub(r'^@@CARD:(.+?)@@[ \t]*$', rep, text, flags=re.M)
