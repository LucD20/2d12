# Builds the seven documents (core-rules.html, species.html, gear.html, talents.html, paladin.html, archer.html, bestiary.html) from the chapter files in rules-src/.
# A chapter file says which document it belongs to on its first line: <!-- doc: species -->  (no tag = Core Rules).
import re, os, sys, math, json, base64, html as H, markdown
import rules_tools as RT
import cards as CARDS   # the cards of book/cards/*.json: a chapter writes @@CARD:Name@@ where one goes
sys.path.insert(0, 'diagrams')
import diagrams as D   # the drawing code of the diagrams (diagrams/diagrams.py)
from markdown.extensions.toc import slugify as md_slugify

SRC = 'rules-src'
if '--where' in sys.argv:   # python3 build_rules.py --where Engaged [Cover ...]: every mention of a term
    RT.where(SRC, sys.argv[sys.argv.index('--where') + 1:]); sys.exit()
OUT = next((a for a in sys.argv[1:] if not a.startswith('--')), 'core-rules.html')   # where Core Rules goes; the other documents are written beside it
OUTDIR = os.path.dirname(OUT) or '.'
DOCS = [('core', os.path.basename(OUT), 'Core Rules'), ('species', 'species.html', 'Species'), ('gear', 'gear.html', 'Gear'), ('talents', 'talents.html', 'Talents'), ('paladin', 'paladin.html', 'Paladin'), ('archer', 'archer.html', 'Archer'), ('bestiary', 'bestiary.html', 'Bestiary')]
DOC_FILE = {k: f for k, f, _ in DOCS}
RATIO = {1: 0.898, 2: 1.078, 3: 1.203, 4: 1.469, 5: 1.594}

# ---------------------------------------------------------------- traits and highlighting
# Trait groups (Lucas, 2026-10-23): Roll, Requires, Kind, Damage, Keywords. A card's traits are listed by group, in this order, alphabetical inside a group.
# Weapon properties (Barehanded, Long, Reload, Two-handed...) are not traits and have no color.
GROUPS = [("roll", "Roll", ["appeal", "body", "instinct", "mind", "power", "save", "signature", "split", "weapon"]),
          ("requires", "Requires", ["gun", "handle", "melee", "ranged", "shot"]),
          ("kind", "Kind", ["area", "move", "self", "strike"]),
          ("damage", "Damage", ["nonlethal"]),
          ("keywords", "Keywords", ["divine", "focus", "fear"])]
def group_of(k):
    if k.startswith('ht:'): return 'kind'
    return next((g for g, _, ks in GROUPS if k in ks), 'keywords')
RULES = {"strike", "weapon", "power", "signature", "split"}
LABEL = {"twohanded": "Two-handed"}
TRAIT_WORDS = {"Strike": "strike", "Nonlethal": "nonlethal", "Divine": "divine", "Focus": "focus", "Handle": "handle", "Power": "power", "Signature": "signature", "Split": "split", "Melee": "melee", "Ranged": "ranged", "Self": "self", "Weapon": "weapon", "Shot": "shot", "Gun": "gun", "Save": "save"}
DMG_WORDS = {"Blunt": "#8a8a8a", "Cold": "#2f9bc4", "Holy": "#b8921c", "Psychic": "#c9577f", "Pierce": "#8a8a8a", "Slash": "#8a8a8a"}
ASSETS = 'rules-assets'
ICONS = json.load(open(os.path.join(ASSETS, 'dtype-icons.json')))   # Font Awesome Free (CC BY 4.0), see rules-assets/FONTAWESOME-LICENSE.txt
DTYPE = {"Acid": "#5d9b2b", "Blunt": "#8a8a8a", "Cold": "#2f9bc4", "Electricity": "#c99a00", "Fire": "#d0583a", "Force": "#a45ae0", "Holy": "#b8921c",
         "Pierce": "#8a8a8a", "Psychic": "#c9577f", "Slash": "#8a8a8a", "Thunder": "#3b78c0", "Unholy": "#8f59b3"}
def icon_svg(name):
    i = ICONS[name]
    return f'<svg class="ico" viewBox="0 0 {i["w"]} {i["h"]}" aria-hidden="true"><path fill="currentColor" d="{i["d"]}"/></svg>'
DCODE = {"Ac": "Acid", "Bl": "Blunt", "Co": "Cold", "El": "Electricity", "Fi": "Fire", "Fo": "Force", "Ho": "Holy", "Pi": "Pierce", "Ps": "Psychic", "Sl": "Slash", "Th": "Thunder", "Un": "Unholy"}
DCODE_RE = re.compile(r'(?<=[\d\]]) (' + '|'.join(DCODE) + r')\b')   # a code after a number or a [At]: "1d6 Ho", "[At] Bl"
def dcode_html(code): return f'<span class="dcode" style="--dc:{DTYPE[DCODE[code]]}">{code}</span>'
def dtype_html(name): return f'<span class="dtype" style="--dc:{DTYPE[name]}">{icon_svg(name)}{name}</span>'
def pool_html(k):
    k = {"V": "B", "R": "M"}.get(k, k)   # pack R-core: Vigor and Resolve use the Body and Mind icons
    name = {"B": "Body", "M": "Mind"}[k]
    return f'<span class="pool pool-{k.lower()}" role="img" aria-label="{name}">{icon_svg(name)}</span>'

fam_color = lambda k: f"var(--g-{group_of(k)})"   # a trait word in the text: the color of its group
WORD_RE = re.compile(r'\b(' + '|'.join(sorted(list(TRAIT_WORDS) + list(DMG_WORDS), key=len, reverse=True)) + r')\b')
_TW = '|'.join(sorted(TRAIT_WORDS, key=len, reverse=True))
TRAIT_CTX = re.compile(r'(?:\s*(?:,|or|and)\s*(?:' + _TW + r'))*\s+(?:Actions?|traits?|propert(?:y|ies))\b')   # what follows a trait word when it names the trait
SKIP_OPEN = re.compile(r'^<(h[1-4]|summary|a|code|button|th)\b', re.I)
SKIP_CLOSE = re.compile(r'^</(h[1-4]|summary|a|code|button|th)>', re.I)

def hl(fragment):
    """Light background behind trait names and colored damage words, outside headings, links and code."""
    skip = 0
    out = []
    for part in re.split(r'(<[^>]+>|\[\[.*?\]\])', fragment):
        if part.startswith('[['):
            out.append(part); continue
        if part.startswith('<'):
            if SKIP_OPEN.match(part): skip += 1
            elif SKIP_CLOSE.match(part): skip = max(0, skip - 1)
            out.append(part); continue
        if skip: out.append(part); continue
        def sub(m, part=part):
            w = m.group(1)
            if w in TRAIT_WORDS:
                # only where the word names the trait: inside [brackets], or before "Action(s)", "trait(s)" or "property" ("Weapon Action", "the Melee or Ranged trait")
                before = part[:m.start()]
                in_brackets = before.rfind('[') > before.rfind(']')
                if in_brackets or TRAIT_CTX.match(part, m.end()):
                    return f'<span class="trhl" style="--tc:{fam_color(TRAIT_WORDS[w])}">{w}</span>'
                return w
            return f'<span class="dmgword" style="--dc:{DMG_WORDS[w]}">{w}</span>'
        part = DCODE_RE.sub(lambda m: ' ' + dcode_html(m.group(1)), part)
        out.append(WORD_RE.sub(sub, part))
    return ''.join(out)

e = lambda s: H.escape(s, quote=False)
def ap(n): return f'<span class="apmark" role="img" aria-label="{n} Action Points">{n}AP</span>'
def ap_label(aps):
    aps = sorted(set(aps)); t = '/'.join(str(a) for a in aps)
    return f'<span class="apmark" role="img" aria-label="{t} Action Points">{t}AP</span>'

def chevrons(keys):
    """A card's traits: a block per trait group (a small label over its chips), in the order Roll, Requires, Kind, Damage, Keywords; a thin line between blocks."""
    by = {}
    for k in keys: by.setdefault(group_of(k), []).append(k)
    def lab(k): return LABEL.get(k) or (('HT: ' + ', '.join(w.strip().capitalize() for w in k.split(':', 1)[1].split(','))) if k.startswith('ht:') else k.capitalize())
    out = []
    for g, title, _ in GROUPS:
        if g not in by: continue
        chips = ''.join(f'<span class="tchip">{e(lab(k))}</span>' for k in sorted(by[g], key=lambda k: lab(k).lower()))
        out.append(f'<span class="tg" style="--tg:var(--g-{g})"><span class="tgl">{title}</span><span class="tgc">{chips}</span></span>')
    return ''.join(out)

def cells(line):
    """The cells of a table row. A `|` inside a [[link|label]] is not a separator (cards 1, 2026-11-05: Smite's [[Bright|Bright light]])."""
    keep = re.sub(r'\[\[([^\]]*?)\]\]', lambda m: '[[' + m.group(1).replace('|', '\x00') + ']]', line.strip().strip('|'))
    return [c.strip().replace('\x00', '|') for c in keep.split('|')]
def inline(t): return hl(re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', e(t)))

# ---------------------------------------------------------------- action cards
FREQ_COL = {'at-will': ('#3B6D11', '#EAF3DE'), 'turn': ('#0F6E6E', '#E1F3F2'), 'round': ('#185FA5', '#E6F1FB'), 'encounter': ('#A32D2D', '#FCEBEB'), 'daily': ('#5B3FA6', '#EEEDFE')}
GREY_COL = ('#5F5E5A', '#F1EFE8')
KNOWN = ('Frequency', 'Target', 'Distance', 'Area', 'Vs', 'Requirements', 'Prerequisites', 'Trigger', 'Interrupt', 'Flavor', 'Setup', 'Escalation', 'Split', 'Inline')

# A chapter written in the class style (first line "<!-- style: class -->"): its Action cards open and close, and its text is colored: a damage expression
# (the [B] or [M] tag with its dice and numbers; [W] and [Mod] expressions for Body) in the color of its pool, Bane, Boon and Rally Point (with their
# number), and the words Body, Mind, Instinct and Appeal. Only the expression itself is colored, never what follows it ("Pushed 1", "Prone"). Used by the class documents.
CLASSY = {'on': False}
_ATOM = r'(?:\d+d\d+|\d+\[W\]|\[Mod\]|\d+)'
_EXPR = rf'{_ATOM}(?:\s*[+\-\u2212/]\s*{_ATOM})*'
_IMPL = r'(?:\d+\[W\]|\[Mod\])(?:\s*\+\s*(?:\d+\[W\]|\[Mod\]|\d+d\d+|\d+))*'
CLASS_TOKEN = re.compile(
    rf'(?P<slash>{_ATOM}(?:\s*/\s*{_ATOM})+\s*\[(?P<sp>[BMVR])\])'    # "1d6 / 1d4 / 0 [R]": tier values with the pool after them
    rf'|(?P<tag>\[(?P<tp>[BMVR])\]\s*{_EXPR})'                           # "[V] 1[W] + [Mod]", "[R] 1d6+1" (pack R-core; [B] / [M] still read)
    r'|(?P<ht>\[HT(?::[^\]]*)?\])'                                         # "[HT: Entering, Turn]": Hazardous Terrain
    r'|(?P<mod>\b(?:Weapon|Power|Signature)\s(?:Modifier|Attribute)s?\b)'  # the modifiers (not Weapon as gear or as a trait)
    r'|\((?P<apa>\d(?:/\d)*A)\)|(?P<ap>\b\d(?:\s*/\s*\d)*\s?AP\b)|(?P<rx>\b\d(?:/\d)*R\b)'   # "(1A)", "2 AP", "1R": costs, the color of the cost chips
    r'|(?P<mv>\b(?:Advance|Evade|Pushed|Pulled|Slid|Reposition)\s\d+\b)'    # a movement with its value
    r'|(?P<neg>\b(?:Doomed|Enfeebled|Vulnerable|Down)\b(?:\s\d+\b)?)|(?P<pos>\b(?:Favored|Empowered)\b(?:\s\d+\b)?)'
    r'|(?P<bane>\b(?:\d+\s+)?Banes?\b)|(?P<boon>\b(?:\d+\s+)?Boons?\b)|(?P<rally>\b(?:(?:up to )?\d+\s+)?Rally Points?\b)'
    r'|(?P<attr>\b(?:Body|Mind|Instinct|Appeal)\b)')
POOL_CLASS = {'B': 'b', 'V': 'b', 'M': 'm', 'R': 'm'}   # pack R-core: [V] Vigor and [R] Resolve damage (were [B] and [M]; both read until R-Foundry)
def _tok(m):
    t = m.group(0)
    if m.group('slash'): return f'<span class="pool-{POOL_CLASS[m.group("sp")]}">{t}</span>'
    if m.group('tag'): return f'<span class="pool-{POOL_CLASS[m.group("tp")]}">{t}</span>'
    if m.group('ht'): return f'<span class="kw-ht">{t}</span>'
    if m.group('mod'): return f'<span class="mod-{t.split()[0].lower()}">{t}</span>'
    if m.group('apa'): return f'(<span class="kw-ap">{m.group("apa")}</span>)'
    if m.group('ap') or m.group('rx'): return f'<span class="kw-ap">{t}</span>'
    if m.group('mv'): return f'<span class="kw-mv">{t}</span>'
    if m.group('neg'): return f'<span class="kw-neg">{t}</span>'
    if m.group('pos'): return f'<span class="kw-pos">{t}</span>'
    if m.group('bane'): return f'<span class="kw-bane">{t}</span>'
    if m.group('boon'): return f'<span class="kw-boon">{t}</span>'
    if m.group('rally'): return f'<span class="kw-rally">{t}</span>'
    return f'<span class="at-{t.lower()}">{t}</span>'
ATTR_SKIP = re.compile(r'(<span class="(?:tchip|apmark|rmark)".*?</span>|<(h[1-6]|a|script|style|svg|summary)\b[^>]*>.*?</\2>)', re.S)
def class_colors(html):
    """The class style's colors, applied to the text of a chapter (not to headings, links, trait chips or card titles)."""
    keep = []
    def stash_(m): keep.append(m.group(0)); return f'\x00{len(keep) - 1}\x00'
    h = ATTR_SKIP.sub(stash_, html)
    h = re.sub(r'(<[^>]+>)|([^<]+)', lambda m: m.group(1) or CLASS_TOKEN.sub(_tok, m.group(2)), h)
    return re.sub(r'\x00(\d+)\x00', lambda m: keep[int(m.group(1))], h)

def card(block, markers=False):
    """An Action card in the book (layout A2): the title bar colored by Frequency, the tiers as a grid with one column per Version
    (Versions with the same tiers share a column), the Critical row under Tier 3, and the Effects (Tier 2+) one line per Version."""
    name = re.search(r'<div class="action-head"><span>(.*?)</span>', block).group(1)
    cat = (re.search(r'<span class="cat">(.*?)</span>', block) or [None, ''])[1]
    tm = re.search(r'^\*([^*].*?)\*\s*$', block, re.M)
    traits = [t.strip().lower().replace('-', '') for t in tm.group(1).split('•')] if tm else []
    get = lambda key: re.search(r'^\*\*' + key + r':\*\*\s*(.+)$', block, re.M)
    target, freq, distm, vsm, reqm, trgm, flav = get('Target'), get('Frequency'), get('Distance'), get('Vs'), get('Requirements'), get('Trigger'), get('Flavor')
    intm = get('Interrupt')   # cards 4: an Interrupt line, shown first like a Trigger (it was a note paragraph before)
    aream, prem, escm, splitm = get('Area'), get('Prerequisites'), get('Escalation'), get('Split')
    setups = re.findall(r'^\*\*(Setup[^*]*):\*\*\s*(.+)$', block, re.M)
    inlines = re.findall(r'^\*\*Inline:\*\*\s*(.+)$', block, re.M)   # cards 2: inline Actions (Name — cost | Frequency | ... | Effects: ...)
    costm = re.search(r'<div class="action-head"><span>.*?</span><span>(\d+(?:\s*/\s*\d+)*\s*R)</span>', block)
    free = None   # (the old Free Action marker is gone: 0 AP)
    lines = block.split('\n')
    table = [l for l in lines if l.strip().startswith('|')]
    def is_note(l):
        l = l.strip()
        if not l or l.startswith(('|', '<')): return False
        if l.startswith('**'): return not any(l.startswith(f'**{k}') for k in KNOWN)
        return not l.startswith('*')
    notes = [l.strip() for l in lines if is_note(l)]
    versions = []
    if table:
        head = cells(table[0]); rows = [cells(l) for l in table[2:]]
        tiered = head[0] == ''
        heads = head[1:] if tiered else head
        aps = [int(re.match(r'(\d)', h).group(1)) for h in heads if re.match(r'\d', h)]
        modes = []
        if not aps and heads and all(re.sub(r'\*', '', h).strip() for h in heads):   # a Split Action: one column per mode ("Weapon", "Power"), all at the card's cost
            modes = [re.sub(r'\*', '', h).strip() for h in heads]
            hc = re.search(r'<div class="action-head"><span>.*?</span><span>(\d+)', block)
            aps = [int(hc.group(1)) if hc else 0] * len(modes)
        for k, a in enumerate(aps):
            v = {"ap": a, "tiers": [], "effects": "", "critical": "", "tiered": tiered, "mode": modes[k] if modes else ""}
            for r in rows:
                if tiered:
                    label = re.sub(r'\*', '', r[0])
                    if label.startswith('Tier'): v["tiers"].append((label, r[k + 1]))
                    elif label.startswith('Critical'): v["critical"] = r[k + 1]
                    elif label.startswith('Effects'): v["effects"] = r[k + 1]
                else: v["effects"] = r[k]
            versions.append(v)
    f = (freq.group(1).strip().lower() if freq else '')
    col, txt = next((c for key, c in FREQ_COL.items() if f.startswith(key)), GREY_COL)
    passive = not versions and not costm and not free and re.search(r'Talent|Feature|Escalation', cat or '')
    mk = (lambda n: f'<sup class="mk">{n}</sup>') if markers else (lambda n: '')
    reaction = bool(costm)
    badge = lambda aps_: (f'<span class="rmark">{"/".join(map(str, aps_))}R</span>' if reaction else ap_label(aps_))
    if versions and versions[0]["mode"]: cost = f'<span class="rmark">{re.sub(r"\s+", "", costm.group(1))}</span>' if costm else ap_label([versions[0]["ap"]])
    elif versions: cost = badge([v["ap"] for v in versions])
    elif costm: cost = f'<span class="rmark">{re.sub(r"\s+", "", costm.group(1))}</span>'
    else: cost = ''
    # the tier grid: one column per group of Versions with the same tiers and Critical
    cols = []
    for v in versions:
        if not v["tiers"]: continue
        key = (tuple(t for _, t in v["tiers"]), v["critical"])
        if cols and cols[-1]["key"] == key and not v["mode"]: cols[-1]["aps"].append(v["ap"])
        else: cols.append({"key": key, "aps": [v["ap"]], "tiers": v["tiers"], "critical": v["critical"], "mode": v["mode"]})
    grid = ''
    if cols:
        same = all(len({t for _, t in c["tiers"]}) == 1 for c in cols) and len(cols[0]["tiers"]) == 3
        labels = ['Tiers 1-3'] if same else [l for l, _ in cols[0]["tiers"]]
        thead = '' if len(cols) == 1 else '<tr><th class="lbl"></th>' + ''.join(f'<th>{e(c["mode"]) + " mode" if c["mode"] else " ".join(badge([a]) for a in c["aps"])}</th>' for c in cols) + '</tr>'
        body = ''
        for r, lab in enumerate(labels):
            body += f'<tr><th class="lbl">{e(lab)}</th>' + ''.join(f'<td>{inline(c["tiers"][r][1])}</td>' for c in cols) + '</tr>'
        crits = [c["critical"] for c in cols]
        if any(crits):
            if len(set(crits)) == 1: body += f'<tr class="crit"><th class="lbl">Critical</th><td colspan="{len(cols)}">{inline(crits[0])}</td></tr>'
            else: body += '<tr class="crit"><th class="lbl">Critical</th>' + ''.join(f'<td>{inline(c)}</td>' for c in crits) + '</tr>'
        grid = f'<table class="tgrid">{thead}{body}</table>'
    # the Effects: one line per Version (Versions with the same text share a line); one Version needs no badge
    groups = []
    for v in versions:
        if not v["effects"]: continue
        if groups and groups[-1]["text"] == v["effects"]: groups[-1]["aps"].append(v["ap"])
        else: groups.append({"text": v["effects"], "aps": [v["ap"]]})
    eff = ''
    if groups:
        label = 'Effects (Tier 2+)' if any(v["tiers"] for v in versions) else 'Effects'
        if len(groups) == 1 and len(versions) <= 1 or (len(groups) == 1 and len(groups[0]["aps"]) == len(versions)):
            items = f'<div class="el"><span>{inline(groups[0]["text"])}</span></div>'
        else:
            items = ''.join(f'<div class="el"><span class="elb">{" ".join(badge([a]) for a in g["aps"])}</span><span>{inline(g["text"])}</span></div>' for g in groups)
        eff = f'<div class="eff{" sep" if grid else ""}"><div class="eh">{label}{mk(8)}</div>{items}</div>'
    # Three meta-lines, always in this place: 1 Escalation; 2 Targets ✦ Area; 3 Distance ✦ Vs. (a Save is written as it is: "Instinct Save").
    sep = " <i class='sep'>&#10022;</i> "
    vs_txt = (f'<span class="vs">{"" if vsm.group(1).strip().endswith("Save") else "Vs. "}{inline(vsm.group(1))}</span>') if vsm else ''
    l1 = [f'<span class="esc">Escalation {inline(escm.group(1))}</span>'] if escm else []   # pack R: a requirement ("Escalation 3"), not a cost
    l2 = ([f'<span><b>Targets:</b> {inline(target.group(1))}</span>'] if target else []) + ([f'<span class="dist"><b>Area:</b> {inline(aream.group(1))}</span>'] if aream else [])   # cards 2 (Lucas): the label
    l3 = ([f'<span class="dist"><b>Distance:</b> {inline(distm.group(1))}</span>'] if distm and distm.group(1).strip().lower() != 'self' else []) + ([vs_txt] if vs_txt else [])
    meta_lines = [l for l in (l1, l2, l3) if l]
    meta = meta_lines
    head = ((f'<div class="traits">{chevrons(traits)}{mk(4)}</div>' if traits else '')
            + (f'<div class="arow trg"><b>Interrupt:</b> {inline(intm.group(1))}</div>' if intm else '')   # cards 4 (Lucas, 2026-11-06): a Reaction's Interrupt / Trigger line comes first
            + (f'<div class="arow trg"><b>Trigger:</b> {inline(trgm.group(1))}</div>' if trgm else '')
            + ''.join(f'<div class="meta">{sep.join(l)}{mk(5) if k == len(meta) - 1 else ""}</div>' for k, l in enumerate(meta))
            + (f'<div class="arow"><b>Prerequisites:</b> {inline(prem.group(1))}</div>' if prem else '')
            + (f'<div class="arow"><b>Requirements:</b> {inline(reqm.group(1))}</div>' if reqm else '')
            + (f'<div class="arow"><b>Split:</b> {inline(splitm.group(1))}</div>' if splitm else '')
            + ''.join(f'<div class="arow"><b>{e(k)}:</b> {inline(t)}</div>' for k, t in setups))
    is_action = bool(versions or costm or free)
    mods = [n for n in notes if n.startswith('**Modifies')]
    plain = [n for n in notes if n not in mods]
    if is_action and not versions and plain:
        # an Action with no table: its text is its Effects (Opportunity Attack, Release)
        eff = f'<div class="eff"><div class="eh">Effects</div>' + ''.join(f'<div class="el"><span>{inline(n)}</span></div>' for n in plain) + '</div>'
        plain = []
    def mod_html(n):
        m = re.match(r'^\*\*Modifies\s+(.*?):\*\*\s*(.*)$', n)
        body_ = f'<b>{inline(m.group(1)).capitalize() if False else inline(m.group(1))}:</b> {inline(m.group(2))}' if m else inline(n)
        return f'<div class="eff sep"><div class="eh">Modifies</div><div class="el"><span>{body_}</span></div></div>'
    modblock = ''.join(mod_html(n) for n in mods)
    def inline_html(line):
        # Name — cost | Frequency | [traits] | Interrupt: ... | Effects: ... (a plain hyphen reads too): a small nested card
        m = re.match(r'^(.*?)\s+(?:\u2014|-)\s+(.*)$', line)
        nm, fields = (m.group(1), [f.strip() for f in m.group(2).split('|')]) if m else (line, [])
        cost_, freq_ = (fields[0] if fields else ''), (fields[1] if len(fields) > 1 else '')
        rest = fields[2:]
        tr = [f for f in rest if f.startswith('[')]
        rows_ = [f for f in rest if not f.startswith('[')]
        trs = [t.strip().lower().replace('-', '') for t in tr[0].strip('[]').split(',')] if tr else []
        badge_ = (f'<span class="rmark">{e(cost_)}</span>' if cost_.endswith('R') else ap_label([int(cost_.split()[0])]) if cost_ and cost_[0].isdigit() else '')
        body_ = ''.join(f'<div class="arow"><b>{e(r.split(":", 1)[0])}:</b> {inline(r.split(":", 1)[1].strip())}</div>' if ':' in r and not r.startswith('Effects:') else f'<div class="eff"><div class="eh">Effects</div><div class="el"><span>{inline(r.split(":", 1)[1].strip())}</span></div></div>' for r in rows_)
        icol, itxt = next((c for key, c in FREQ_COL.items() if freq_.strip().lower().startswith(key)), GREY_COL)   # its own Frequency color
        return (f'<div class="acard inl" style="--fq:{icol};--fqt:{itxt}"><div class="ahead"><b>{e(nm)}</b>'
                + (f'<span class="afreq">{e(freq_)}</span>' if freq_ else '') + (f'<span class="aps">{badge_}</span>' if badge_ else '') + '</div>'
                + f'<div class="abody">' + (f'<div class="traits">{chevrons(trs)}</div>' if trs else '') + body_ + '</div></div>')
    inlblock = ''.join(inline_html(l) for l in inlines)
    if passive and plain:
        # a Talent or Feature that isn't an Action: its text belongs with its traits, above any divider
        head += ''.join(f'<p class="anote">{inline(n)}</p>' for n in plain)
        plain = []
    rest = ''.join(f'<p class="anote">{inline(n)}</p>' for n in plain) + grid + eff + inlblock + modblock
    body = ((f'<div class="flavor">{inline(flav.group(1))}</div>' if flav else '') + head
            + ('<hr class="cdiv">' if head and rest else '') + rest)
    tag_, head_ = ('details', 'summary') if CLASSY['on'] else ('div', 'div')   # the class style: a card opens and closes
    cid = 'card-' + re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', name).lower()).strip('-')   # cards 1 (2026-11-05): every card is an anchor, so [[Hide]] links to the card
    return (f'<{tag_} class="acard{" passive" if passive else ""}" id="{cid}" style="--fq:{col};--fqt:{txt}"><{head_} class="ahead"><b>{name}{mk(1)}</b>'
            + (f'<span class="acat">{e(cat)}{mk(2)}</span>' if cat else '')
            + (f'<span class="afreq">{inline(freq.group(1))}</span>' if freq else '')
            + (f'<span class="aps">{cost}{mk(3)}</span>' if cost else '') + f'</{head_}>'
            + f'<div class="abody">{body}</div></{tag_}>')

SAMPLE = '''<div class="action" markdown="1">
<div class="action-head"><span>Smite</span><span>1 / 2 / 3 AP</span><span class="cat">Divine Power 1</span></div>

**Flavor:** Your weapon blazes with holy light.

*Divine • Strike • Weapon*

**Frequency:** Round

**Target:** One creature

**Distance:** Weapon

**Vs:** AD

| | 1 AP | 2 AP | 3 AP |
|---|---|---|---|
| **Tier 1** | 1[W] | 1[W] + [R] 2d4 Ho | 1[W] + [R] 2d4 Ho |
| **Tier 2** | 1[W] + [Mod] + [R] 1d4 Ho | 1[W] + [Mod] + [R] 2d6 Ho | 1[W] + [Mod] + [R] 2d6 Ho |
| **Tier 3** | 1[W] + [Mod] + [R] 1d6 Ho | 1[W] + [Mod] + [R] 2d8 Ho | 1[W] + [Mod] + [R] 2d8 Ho |
| **Effects** | The target sheds Bright light 1 ▣ and takes 1 bane when they try to hide, for 1 round. | The target sheds Bright light 2 ▣ and takes 1 bane when they try to hide, for 1 round. You gain 1 boon on your next Divine Action against the target. | As 2 AP, and enemies in the Bright light must make an Appeal Save: 1d6 / 1d4 / 0 [R] Holy. |

</div>
'''
def sample_card():
    html = card(SAMPLE, markers=True)
    # the parchment style of Foundry's cards: parchment body, gold lines and \u2726 dividers, Effects with a gold side line
    html = html.replace('class="acard"', 'class="acard parch"', 1).replace('<hr class="cdiv">', '<div class="orn">&#10022; &#10022; &#10022;</div>', 1).replace('<div class="eff sep">', '<div class="orn">&#10022;</div><div class="eff sep">', 1)
    # markers 6 and 7 go on the tier grid and on a damage entry
    html = html.replace('<th class="lbl">Tier 1</th>', '<th class="lbl">Tier 1<sup class="mk">6</sup></th>', 1)
    html = re.sub(r'(1\[W\] \+ \[Mod\] \+ \[M\] 1d4 (?:<span class="dcode"[^>]*>Ho</span>|Ho))</td>', r'\1<sup class="mk">7</sup></td>', html, count=1)
    legend = '''<ol class="legend">
<li><b>Title bar.</b> The color of the bar is the Action's Frequency: green At-will, teal Turn, blue Round, red Encounter, purple Daily, grey for passive features with no Frequency. The italic line under the title bar is flavor: it describes the Action and never changes its rules.</li>
<li><b>Category and level.</b> The kind of Action (Basic Action, Weapon Technique...) or the feature that gave it (Divine Power...); the number after it is the level you get it at. An Escalation Action shows the Escalation it needs on the line below the title bar.</li>
<li><b>Cost.</b> The AP of each <b>Version</b> of the Action: "1/2/3AP", "0AP" for one that costs nothing, or "1R" (or "0R") for a Reaction. When you use the Action, you choose a Version.</li>
<li><b>Traits.</b> Colored by kind; Chapter 7 explains the ones with rules of their own.</li>
<li><b>Meta-lines.</b> Always in the same place, each only when the Action has it: <b>1</b> the Escalation it needs; <b>2</b> who it affects ✦ its Area; <b>3</b> how far it reaches (Reach, Weapon for your weapon's Range, a number of squares) ✦ the Defense it rolls against (Vs.), or the Save its targets roll for a Save Action ("Instinct Save"). Every Action that rolls has a Vs. entry. Requirements, Setup and Trigger/Interrupt come under these lines when the Action has them.</li>
<li><b>Tiers.</b> What happens on a Tier 1, 2 or 3 result. Each column is a Version; Versions with the same tiers share a column. A Split Action has one column per mode instead. A <b>Critical</b> row comes under Tier 3 when the Action has one.</li>
<li><b>Damage.</b> See the notation below.</li>
<li><b>Effects.</b> The General Effects row: what happens on a Tier 2 or 3 result, after the damage, one line per Version.</li>
</ol>'''
    return f'<div class="sample">{html}{legend}</div>'

# ---------------------------------------------------------------- build
slugs = {}
def slug(value, sep='-'):
    base = md_slugify(value, sep) or 'section'
    n = slugs.get(base, 0); slugs[base] = n + 1
    return base if n == 0 else f'{base}{sep}{n + 1}'

norm = lambda s: re.sub(r'[^a-z0-9]', '', re.sub(r'<[^>]+>', '', s).lower())
CALL_TITLES = {'example': 'Example', 'tbd': 'To be decided', 'note': 'Designer note', 'tip': "Designer's Tip"}
files = RT.chapter_files(SRC)   # only the numbered chapter files (INDEX.md and README.md are not chapters)
CARD_DATA = CARDS.by_name(CARDS.load())   # name -> card
CARD_PROBLEMS = []   # @@CARD@@ markers with no card, cards the book doesn't show, cards no chapter places
PLACED_CARDS = set()
chapters = []          # dicts: part, html, h1 (id, title), h2 list
open_items = []        # (heading title, html)
headings = {}          # normalized title -> id
for fn in files:
    text = open(os.path.join(SRC, fn)).read()
    part = (re.match(r'<!-- part: (.*?) -->', text) or [None, ''])[1]
    text = re.sub(r'<!-- part: .*? -->\n', '', text, count=1)
    doc = (re.match(r'<!-- doc: (\w+) -->', text) or [None, 'core'])[1]
    text = re.sub(r'<!-- doc: \w+ -->\n', '', text, count=1)
    style = (re.search(r'<!-- style: (\w+) -->', text[:300]) or [None, ''])[1]
    text = re.sub(r'<!-- style: \w+ -->\n', '', text, count=1)
    CLASSY['on'] = (style == 'class')
    PLACED_CARDS.update(m.group(1).strip() for m in re.finditer(r'^@@CARD:(.+?)@@\s*$', text, re.M))
    text = CARDS.expand(text, CARD_DATA, fn, CARD_PROBLEMS)   # the cards of book/cards/ take the place of their markers; card() reads them as before
    stash = {}
    def put(html):
        k = f'@@S{len(stash)}@@'; stash[k] = html; return k
    text = re.sub(r'\{\{dt:(\w+)\}\}', lambda m: put(dtype_html(m.group(1))), text)
    text = re.sub(r'\{\{pool:([BMVR])\}\}', lambda m: put(pool_html(m.group(1))), text)
    text = re.sub(r'\{\{dc:(\w\w)\}\}', lambda m: put(dcode_html(m.group(1))), text)
    # callouts, with the nearest heading for open items
    lines = text.split('\n'); out = []; last = ''; i = 0
    while i < len(lines):
        l = lines[i]
        hm = re.match(r'^#{1,4} (.*)$', l)
        if hm: last = hm.group(1)
        cm = re.match(r'^> \[!(\w+)\]\s*$', l)
        if cm:
            body = []; i += 1
            while i < len(lines) and lines[i].startswith('>'):
                body.append(re.sub(r'^> ?', '', lines[i])); i += 1
            kind = cm.group(1)
            inner = hl(markdown.markdown('\n'.join(body), extensions=['sane_lists']))
            if kind == 'tbd': open_items.append((doc, last, inner))
            out += ['', put(f'<div class="callout {kind}"><div class="ctitle">{CALL_TITLES.get(kind, kind)}</div>{inner}</div>'), '']
            continue
        out.append(l); i += 1
    text = '\n'.join(out)
    text = re.sub(r'<div class="action" markdown="1">.*?\n</div>\n', lambda m: '\n\n' + put(card(m.group(0))) + '\n\n', text, flags=re.S)
    text = text.replace('@@SAMPLE_CARD@@', put(sample_card())).replace('@@PUSH_DIAGRAM@@', put(D.book_diagram('push')))
    text = re.sub(r'@@DIAGRAM:([\w-]+)@@', lambda m: put(D.book_diagram(m.group(1))), text)   # a diagram of diagrams/diagrams.py, by name
    body = markdown.markdown(text, extensions=['tables', 'sane_lists', 'toc'], extension_configs={'toc': {'slugify': slug}})
    body = body.replace('<table>', '<div class="tablewrap"><table>').replace('</table>', '</table></div>')
    body = hl(body)
    for _ in range(3):
        for k, v in stash.items(): body = body.replace(f'<p>{k}</p>', v).replace(k, v)
    body = class_colors(body)   # the colors are for every document (v0.0.170); the class style is only the page look and the cards that open
    h1 = re.search(r'<h1 id="([^"]+)">(.*?)</h1>', body)
    h2s = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
    for m in re.finditer(r'<h([1-4]) id="([^"]+)">(.*?)</h\1>', body): headings.setdefault(norm(m.group(3)), []).append((doc, m.group(2)))   # when titles repeat, [[Title]] goes to the one in its own document, else the first
    for m in re.finditer(r'<(?:details|div) class="acard[^"]*" id="(card-[^"]+)"[^>]*><(?:summary|div) class="ahead"><b>(.*?)</b>', body): headings.setdefault(norm(m.group(2)), []).append((doc, m.group(1)))   # cards 1: a card is an anchor too (a heading of the same name comes first)
    chapters.append(dict(part=part, body=body, h1=h1.groups(), h2=h2s, fn=fn, doc=doc, style=style))

def ref_id(title, doc):
    """(document, id) of the heading a [[reference]] names: the one in its own document if the title repeats, else the first."""
    n = norm(title)
    c = headings.get(n) or [x for k, v in headings.items() if k.startswith(n) for x in v]
    return next((x for x in c if x[0] == doc), c[0]) if c else None

def href(target, doc):
    return ('#' if target[0] == doc else DOC_FILE[target[0]] + '#') + target[1]   # another document: its file + the id

def resolve(html, doc):
    def r(m):
        t = m.group(1); label = t.split('|')[-1] if '|' in t else t; tgt = t.split('|')[0]
        i = ref_id(tgt, doc)
        return f'<a class="xref" href="{href(i, doc)}">{label}</a>' if i else f'<span class="badref">{label}</span>'
    return re.sub(r'\[\[(.+?)\]\]', r, html)

NAV_CSS = '.docnav{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px;font:13px system-ui,sans-serif}.docnav a{padding:2px 11px;border:1px solid var(--line);border-radius:999px;color:var(--fg);text-decoration:none;background:var(--card)}.docnav a:hover{color:var(--acc)}.docnav a.cur{background:var(--accbg);color:var(--acc);border-color:var(--acc);font-weight:600}\n'
css = open('rules.css').read() + D.CSS + NAV_CSS
css += '@font-face{font-family:"Cinzel";font-weight:700;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,' + base64.b64encode(open(os.path.join(ASSETS, 'cinzel-700.woff2'), 'rb').read()).decode() + ') format("woff2")}\n'
js = '''
function openUp(el){let d=el&&el.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details');}}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const t=document.getElementById(a.getAttribute('href').slice(1));openUp(t);}));
window.addEventListener('hashchange',()=>openUp(document.getElementById(location.hash.slice(1))));
if(location.hash)openUp(document.getElementById(location.hash.slice(1)));
document.getElementById('expandAll').onclick=()=>document.querySelectorAll('details.chapter-d,section.chapter>details').forEach(d=>d.open=true);
document.getElementById('collapseAll').onclick=()=>document.querySelectorAll('section.chapter>details').forEach(d=>d.open=false);
const oc=document.getElementById('openCards'),cc=document.getElementById('closeCards');if(oc)oc.onclick=()=>document.querySelectorAll('details.acard').forEach(d=>d.open=true);if(cc)cc.onclick=()=>document.querySelectorAll('details.acard').forEach(d=>d.open=false);
const tw=document.querySelector('.tocwrap');if(tw&&window.innerWidth<1000)tw.open=false;
'''

def build_doc(doc, title):
    mine = [c for c in chapters if c['doc'] == doc]
    my_items = [(h, t) for d_, h, t in open_items if d_ == doc]
    classy = any(c.get('style') == 'class' for c in mine)   # a class document: the class style (cards that open, colored damage and attributes)
    if my_items or doc == 'core':   # the Open Items appendix of a document, when it has open boxes (Core always has one)
        items = ''.join(f'<li><a href="{href(ref_id(h, doc), doc) if ref_id(h, doc) else "#"}">{e(re.sub("<[^>]+>", "", h))}</a>: {re.sub("^<p>|</p>$", "", t.strip())}</li>' for h, t in my_items)
        appendix = f'<h1 id="open-items">Appendix: Open Items</h1><p>Rules that are not decided or not written yet. They are collected from the "To be decided" boxes in the chapters.</p><ol class="openitems">{items}</ol>'
        mine = mine + [dict(part='Appendix' if doc == 'core' else '', body=appendix, h1=('open-items', 'Appendix: Open Items'), h2=[], fn='appendix', doc=doc)]
    parts_html = []; toc = []; last_part = None
    for c in mine:
        if c['part'] and c['part'] != last_part:
            parts_html.append(f'<div class="part">{e(c["part"])}</div>'); toc.append(f'<div class="tocpart">{e(c["part"])}</div>'); last_part = c['part']
        body = c['body']
        m = re.search(r'<h1 id="[^"]+">.*?</h1>', body)
        h1 = m.group(0); rest = body.replace(h1, '', 1)
        parts_html.append(f'<section class="chapter"><details open><summary>{h1}</summary><div class="cbody">{rest}</div></details></section>')
        toc.append(f'<div class="tocch"><a href="#{c["h1"][0]}">{re.sub("<[^>]+>", "", c["h1"][1])}</a><div class="toch2">' + ''.join(f'<a href="#{i}">{re.sub("<[^>]+>", "", t)}</a>' for i, t in c['h2']) + '</div></div>')
    main = resolve('\n'.join(parts_html), doc)
    first_h1 = re.sub(r'<[^>]+>', '', (re.search(r'<h1 id="[^"]+">(.*?)</h1>', main) or [0, ''])[1]).strip()
    dup_title = first_h1 == title   # the chapter's own heading is already the title: no title block, no "Draft" (Lucas, 2026-10-25)
    nav = '<div class="docnav">' + ''.join(f'<a href="{f}"{" class=cur" if k == doc else ""}>{t}</a>' for k, f, t in DOCS) + '</div>'
    out = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{title}{'' if dup_title else ' (Draft)'}</title><style>{css}</style></head>
<body id="top"{' class="classdoc"' if classy else ''}><div class="layout"><nav class="toc"><details class="tocwrap" open><summary>Contents</summary><div class="tocbtns"><button id="expandAll" type="button">Expand all</button><button id="collapseAll" type="button">Collapse all</button></div>{'<div class="tocbtns"><button id="openCards" type="button">Open all cards</button><button id="closeCards" type="button">Close all cards</button></div>' if classy else ''}{''.join(toc)}</details></nav>
<main>{nav}{'' if dup_title else f'<div class="titleblock"><h1 class="doctitle">{title}</h1><p class="draft">Draft</p></div>'}{main}<p class="credits">Icons: Font Awesome Free (CC BY 4.0). Card title font: Cinzel (SIL Open Font License).</p><p class="totop"><a href="#top">Back to top</a></p></main></div><script>{js}</script></body></html>'''
    path = os.path.join(OUTDIR, DOC_FILE[doc]); open(path, 'w').write(out)
    return path, out

built = [build_doc(k, t) for k, _, t in DOCS]
doc = '\n'.join(o for _, o in built)   # every document together, for the checks
for path, o in built: print('built', path, len(o), 'chars')
print(len(open_items), 'open items; unresolved refs:', len(re.findall(r'<span class="badref">', doc)))
bad = re.findall(r'<span class="badref">(.*?)</span>', doc)
if bad: print('BAD REFS:', bad)

parsed = RT.parse(SRC)
RT.write_index(parsed, SRC)
RT.report(parsed, doc)
RT.report_cards(CARD_DATA, PLACED_CARDS, CARD_PROBLEMS, parsed)
