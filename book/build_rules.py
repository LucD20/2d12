# Builds the six documents (core-rules.html, species.html, gear.html, paladin.html, archer.html, bestiary.html; the Talents document is set aside
# since 2026-11-12: rules-src/set-aside/16-talents.md, not built) from the chapter files in rules-src/.
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
DOCS = [('core', os.path.basename(OUT), 'Core Rules'), ('species', 'species.html', 'Species'), ('gear', 'gear.html', 'Gear'), ('paladin', 'paladin.html', 'Paladin'), ('archer', 'archer.html', 'Archer'), ('bestiary', 'bestiary.html', 'Bestiary')]
DOC_FILE = {k: f for k, f, _ in DOCS}
RATIO = {1: 0.898, 2: 1.078, 3: 1.203, 4: 1.469, 5: 1.594}

# ---------------------------------------------------------------- traits and highlighting
# Trait groups (Lucas, 2026-10-23): Roll, Requires, Kind, Damage, Keywords. A card's traits are listed by group, in this order, alphabetical inside a group.
# Weapon properties (Barehanded, Long, Reload, Two-handed...) are not traits and have no color.
GROUPS = [("roll", "Roll", ["appeal", "body", "instinct", "mind", "power", "save", "signature", "split", "weapon"]),
          ("requires", "Requires", ["gun", "handle", "melee", "ranged", "shot"]),   # the keys Foundry still has (test t146 compares the two lists); the book prints gun as Firearm and shot as Projectile (cards.py RENAMED) until the Foundry pass renames the keys
          ("kind", "Kind", ["area", "move", "self", "strike"]),
          ("damage", "Damage", ["nonlethal"]),
          ("keywords", "Keywords", ["archer", "divine", "focus", "fear", "magical", "paladin", "subtle", "unfailing"])]   # archer, paladin: the class traits (Lucas, 2026-11-26)
def group_of(k):
    if k.startswith('ht:'): return 'kind'
    k = {'projectile': 'shot', 'firearm': 'gun'}.get(k, k)
    return next((g for g, _, ks in GROUPS if k in ks), 'keywords')
RULES = {"strike", "weapon", "power", "signature", "split"}
LABEL = {"twohanded": "Two-handed"}
TRAIT_WORDS = {"Strike": "strike", "Nonlethal": "nonlethal", "Divine": "divine", "Focus": "focus", "Handle": "handle", "Magical": "magical", "Subtle": "subtle", "Power": "power", "Signature": "signature", "Split": "split", "Melee": "melee", "Ranged": "ranged", "Self": "self", "Weapon": "weapon", "Save": "save"}

ASSETS = 'rules-assets'
ICONS = json.load(open(os.path.join(ASSETS, 'dtype-icons.json')))   # Font Awesome Free (CC BY 4.0), see rules-assets/FONTAWESOME-LICENSE.txt
# v0.0.457 (Lucas, 2026-11-19): one hue a damage type, (light, dark); Foundry's config.mjs subtypeInk / subtypeColors are the same (t286)
DTYPE2 = {"Acid": ("#3f7a12", "#8bc34a"), "Blunt": ("#5a4a36", "#b9a58c"), "Cold": ("#136f8f", "#4fc3e8"), "Electricity": ("#7d6a00", "#e3cf3b"), "Fire": ("#a63a17", "#ef6a3a"), "Force": ("#6a35b8", "#a77ce8"), "Holy": ("#8a5a08", "#e0a83a"), "Pierce": ("#44513f", "#a9b8a4"), "Psychic": ("#a3335c", "#e07a9e"), "Slash": ("#4a5058", "#c3c9d1"), "Thunder": ("#1f4f8a", "#6f95c8"), "Unholy": ("#6e2a6e", "#c06ac0")}
DTYPE = {k: v[0] for k, v in DTYPE2.items()}
DMG_WORDS = {w: DTYPE[w] for w in ("Blunt", "Cold", "Holy", "Psychic", "Pierce", "Slash")}
def _dvars(name): return f'--dc:{DTYPE2[name][0]};--dcd:{DTYPE2[name][1]}'
def icon_svg(name):
    i = ICONS[name]
    return f'<svg class="ico" viewBox="0 0 {i["w"]} {i["h"]}" aria-hidden="true"><path fill="currentColor" d="{i["d"]}"/></svg>'
DCODE = {"Ac": "Acid", "Bl": "Blunt", "Co": "Cold", "El": "Electricity", "Fi": "Fire", "Fo": "Force", "Ho": "Holy", "Pi": "Pierce", "Ps": "Psychic", "Sl": "Slash", "Th": "Thunder", "Un": "Unholy"}
DCODE_RE = re.compile(r'(?<=[\d\]!]) (' + '|'.join(DCODE) + r')\b')   # a code after a number, a die's ! or a [At]: "1d6 Ho", "1d6! Ho", "[At] Bl"
def dcode_html(code): return f'<span class="dcode" style="{_dvars(DCODE[code])}">{code}</span>'
def dtype_html(name): return f'<span class="dtype" style="{_dvars(name)}">{icon_svg(name)}{name}</span>'
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
            return f'<span class="dmgword" style="{_dvars(w)}">{w}</span>'
        part = DCODE_RE.sub(lambda m: ' ' + dcode_html(m.group(1)), part)
        out.append(WORD_RE.sub(sub, part))
    return ''.join(out)

e = lambda s: H.escape(s, quote=False)
def inline(t): return hl(re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', e(t)))

# ---------------------------------------------------------------- action cards
FREQ_COL = {'at-will': ('#3B6D11', '#EAF3DE'), 'turn': ('#0F6E6E', '#E1F3F2'), 'round': ('#185FA5', '#E6F1FB'), 'encounter': ('#A32D2D', '#FCEBEB'), 'daily': ('#5B3FA6', '#EEEDFE')}
GREY_COL = ('#5F5E5A', '#F1EFE8')

# A chapter written in the class style (first line "<!-- style: class -->"): its Action cards open and close, and its text is colored: a damage expression
# (the [B] or [M] tag with its dice and numbers; [W] and [Mod] expressions for Body) in the color of its pool, Bane, Boon and Rally Point (with their
# number), and the words Body, Mind, Instinct and Appeal. Only the expression itself is colored, never what follows it ("Pushed 1", "Prone"). Used by the class documents.
CLASSY = {'on': False}
_ATOM = r'(?:\d+d\d+!?|\d+\[W\]|\[Mod\]|\d+)'
_EXPR = rf'{_ATOM}(?:\s*[+\-\u2212/]\s*{_ATOM})*'
_IMPL = r'(?:\d+\[W\]|\[Mod\])(?:\s*\+\s*(?:\d+\[W\]|\[Mod\]|\d+d\d+!?|\d+))*'
CLASS_TOKEN = re.compile(
    rf'(?P<slash>{_ATOM}(?:\s*/\s*{_ATOM})+\s*\[(?P<sp>[BMVR])\])'    # "1d6 / 1d4 / 0 [R]": tier values with the pool after them
    rf'|(?P<tag>\[(?P<tp>[BMVR])\]\s*{_EXPR})'                           # "[V] 1[W] + [Mod]", "[R] 1d6+1" (pack R-core; [B] / [M] still read)
    r'|(?P<ht>\[HT(?::[^\]]*)?\])'                                         # "[HT: Entering, Turn]": Hazardous Terrain
    r'|(?P<mod>\b(?:Weapon|Power|Signature)\s(?:Modifier|Attribute)s?\b)'  # the modifiers (not Weapon as gear or as a trait)
    r'|\((?P<apa>\d(?:/\d)*A)\)|(?P<ap>\b\d(?:\s*/\s*\d)*\s?AP\b)|(?P<rx>\b\d(?:/\d)*R\b)'   # "(1A)", "2 AP", "1R": costs, the color of the cost chips
    r'|(?P<mv>\b(?:Advance|Evade|Pushed|Pulled|Slid|Reposition)\s\d+\b)'    # a movement with its value
    r'|(?P<neg>\b(?:Doomed|Enfeebled|Vulnerable|Down)\b(?:\s\d+\b)?)|(?P<pos>\b(?:Favored|Empowered)\b(?:\s\d+\b)?)'
    r'|(?P<bane>\b(?:\d+\s+)?Banes?\b)|(?P<boon>\b(?:\d+\s+)?Boons?\b)|(?P<rally>\b(?:(?:up to )?\d+\s+)?Rally Points?\b)'
    r'|(?P<guard>\bGuard\b(?:\s\d+\b)?)'                               # Lucas, 2026-11-13: the word Guard in the Guard blue (as in Foundry)
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
    if m.group('guard'): return f'<span class="kw-guard">{t}</span>'
    return f'<span class="at-{t.lower()}">{t}</span>'
ATTR_SKIP = re.compile(r'(<span class="(?:tchip|apmark|rmark)".*?</span>|<div class="ahead">.*?</div>|<(h[1-6]|a|script|style|svg|summary)\b[^>]*>.*?</\2>)', re.S)   # (a card's bar keeps its own color)
def class_colors(html):
    """The class style's colors, applied to the text of a chapter (not to headings, links, trait chips or card titles)."""
    keep = []
    def stash_(m): keep.append(m.group(0)); return f'\x00{len(keep) - 1}\x00'
    h = ATTR_SKIP.sub(stash_, html)
    h = re.sub(r'(<[^>]+>)|([^<]+)', lambda m: m.group(1) or CLASS_TOKEN.sub(_tok, m.group(2)), h)
    return re.sub(r'\x00(\d+)\x00', lambda m: keep[int(m.group(1))], h)

def traits_html(keys):
    """A card's traits on one line: plain words in the color of their group, in the order Roll, Requires, Kind, Damage, Keywords, alphabetical inside a group."""
    def lab(k): return LABEL.get(k) or (('HT: ' + ', '.join(w.strip().capitalize() for w in k.split(':', 1)[1].split(','))) if k.startswith('ht:') else k.capitalize())
    keys = [k.strip().lower().replace('-', '') if not k.startswith('ht:') else k for k in keys]
    out = []
    for g, title, _ in GROUPS:
        out += [f'<span class="tchip" style="--tg:var(--g-{g})" title="{title}">{e(lab(k))}</span>' for k in sorted((k for k in keys if group_of(k) == g), key=lambda k: lab(k).lower())]
    return '<i class="dot">&middot;</i>'.join(out)

def card(s, marks=None, anchor=True):
    """An Action card in the book, drawn in the Structure (cards/card-structure.md, "THE STRUCTURE, WHOLE") from CARDS.structure(card):
    the bar (the name; Escalation, Frequency and cost at the right; colored by Frequency), the Flavor, the traits, the grid (Distance and Area |
    Target), the labeled lines in play order, then one block per Version or Mode. `marks` puts numbered markers on the parts (the sample card)."""
    marks = dict(marks or {}); lab_marks = dict(marks.get('labels', {}))
    mk = lambda k: f'<sup class="mk">{marks.pop(k)}</sup>' if k in marks else ''
    def grid(d, top=False):
        left = [f'<b>{k.capitalize()}:</b> {inline(d[k])}' for k in ('distance', 'area') if d.get(k) and not (k == 'distance' and d[k].strip().lower() == 'self')]
        l = f'<span>{" &middot; ".join(left)}{mk("reach") if top else ""}</span>' if left else ''
        r = f'<span class="tgt"><b>Target:</b> {inline(d["target"])}{mk("target") if top else ""}</span>' if d.get('target') else ''
        return f'<div class="cgrid">{l}{r}</div>' if l or r else ''
    def line(l):
        if not l.get('label'): return f'<div class="cl nolab"><span>{inline(l["text"])}</span></div>'
        m = f'<sup class="mk">{lab_marks.pop(l["label"])}</sup>' if l['label'] in lab_marks else ''
        return f'<div class="cl"><b>{e(l["label"])}{m}</b><span>{inline(l["text"])}</span></div>'
    def block(b):
        tr = traits_html(b.get('traits', []))
        return (f'<div class="cblock"><div class="cbh"><b>{inline(b["heading"])}</b>{"<i class=dot>&middot;</i>" + tr if tr else ""}{mk("block")}</div>'
                + grid(b) + ''.join(line(l) for l in b.get('body', [])) + '</div>')
    f = (s.get('frequency') or '').lower()
    col, txt = next((c for key, c in FREQ_COL.items() if f.startswith(key)), GREY_COL)
    meta = ' &middot; '.join(e(str(x)) for x in (s.get('escalation') and f'Escalation {s["escalation"]}', s.get('frequency'), s.get('cost')) if x)
    body = ((f'<div class="flavor">{inline(s["flavor"])}{mk("flavor")}</div>' if s.get('flavor') else '')
            + (f'<div class="traits">{traits_html(s["traits"])}{mk("traits")}</div>' if s.get('traits') else '')
            + grid(s, True) + ''.join(line(l) for l in s.get('body', [])) + ''.join(block(b) for b in s.get('blocks', []))
            + (f'<div class="cafter">{"".join(line(l) for l in s["after"])}</div>' if s.get('after') else ''))
    tag_, head_ = ('details', 'summary') if CLASSY['on'] else ('div', 'div')   # the class style: a card opens and closes
    name = s['name']
    cid = 'card-' + re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', name).lower()).strip('-')   # cards 1 (2026-11-05): every card is an anchor, so [[Hide]] links to the card
    return (f'<{tag_} class="acard{" passive" if s.get("passive") else ""}"{f" id={chr(34)}{cid}{chr(34)}" if anchor else ""} style="--fq:{col};--fqt:{txt}"><{head_} class="ahead"><b>{name}{mk("name")}</b>'
            + (f'<span class="ameta">{meta}{mk("meta")}</span>' if meta else '') + f'</{head_}>'
            + f'<div class="abody">{body}</div></{tag_}>')

SAMPLE = ('Smite', 'Lay On Hands')   # the cards of "Reading an Action": a rolled Action with every part, and one with Versions (its blocks)
def sample_card(cards):
    """Chapter 1's "Reading an Action": two cards of the book drawn with numbered markers (the chapter's text explains the numbers; no anchor: the
    cards' own place is their class document). 1 the name; 2 Escalation, Frequency, cost; 3 the Flavor; 4 the traits; 5 Distance and Area;
    6 the Target; 7 the roll line; 8 the Tiers; 9 another labeled line; 10 a block's heading."""
    was, CLASSY['on'] = CLASSY['on'], False   # the sample never closes
    a = card(CARDS.structure(cards[SAMPLE[0]]), dict(name=1, meta=2, flavor=3, traits=4, reach=5, target=6, labels={'Attack': 7, 'Save': 7, 'Tier 1': 8, 'Special': 9}), anchor=False)
    b = card(CARDS.structure(cards[SAMPLE[1]]), dict(block=10), anchor=False)
    CLASSY['on'] = was
    return f'<div class="sample">{a}{b}</div>'

# ---------------------------------------------------------------- build
slugs = {}
def slug(value, sep='-'):
    base = md_slugify(value, sep) or 'section'
    n = slugs.get(base, 0); slugs[base] = n + 1
    return base if n == 0 else f'{base}{sep}{n + 1}'

norm = lambda s: re.sub(r'[^a-z0-9]', '', re.sub(r'<[^>]+>', '', s).lower())
CALL_TITLES = {'example': 'Example', 'tbd': 'To be decided', 'note': 'Designer note', 'tip': "Designer's Tip"}
files = RT.chapter_files(SRC)   # only the numbered chapter files (INDEX.md and README.md are not chapters)
CARD_DATA = CARDS.by_name(CARDS.load_book())   # name -> card (a Structure card of cards/stage0/ in the place of the old card of the same name)
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
    text = CARDS.expand(text, CARD_DATA, fn, CARD_PROBLEMS, lambda c: '\n\n' + put(card(CARDS.structure(c))) + '\n\n')   # the cards of book/cards/ take the place of their markers
    if '@@SAMPLE_CARD@@' in text: text = text.replace('@@SAMPLE_CARD@@', put(sample_card(CARD_DATA)))
    text = text.replace('@@PUSH_DIAGRAM@@', put(D.book_diagram('push')))
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

NAV_CSS = '.docnav{display:flex;flex-wrap:wrap;gap:.4rem 1rem;margin:0 0 10px;font:15px var(--lk-text)}.docnav a{color:var(--lk-ink2);text-decoration:none}.docnav a:hover{color:var(--lk-ink);text-decoration:underline}.docnav a.cur{color:var(--lk-ink);font-weight:600;border-bottom:1px solid var(--lk-ink)}\n'   # the book look (2026-11-17): the document bar as plain words
css = open('rules.css').read() + D.CSS + NAV_CSS
def _ff(fam, f, style):
    return '@font-face{font-family:"' + fam + '";font-weight:200 900;font-style:' + style + ';font-display:swap;src:url(data:font/woff2;base64,' + base64.b64encode(open(os.path.join(ASSETS, f), 'rb').read()).decode() + ') format("woff2")}\n'
css += _ff('Source Serif 4', 'source-serif-4.woff2', 'normal') + _ff('Source Serif 4', 'source-serif-4-italic.woff2', 'italic') + _ff('Source Sans 3', 'source-sans-3.woff2', 'normal') + _ff('Source Sans 3', 'source-sans-3-italic.woff2', 'italic')
css += '@font-face{font-family:"Cinzel";font-weight:700;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,' + base64.b64encode(open(os.path.join(ASSETS, 'cinzel-700.woff2'), 'rb').read()).decode() + ') format("woff2")}\n'
js = '''
function openUp(el){let d=el&&el.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details');}}
// v0.0.427 (Lucas: "the links in the book are broken"): shown inside another page's frame (the Claude app, a published page), a "#..." link
// resolved against that page and reloaded the frame instead of scrolling. A link to a place in this document (written "#id", or with this
// document's own file name) now opens the chapter or card around it and scrolls there itself, in any viewer.
const ownFile=(document.querySelector('.docnav a.cur')||{}).getAttribute?.('href')||'';
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey)return;const h=a.getAttribute('href')||'';const m=h.match(/^([^#]*)#(.+)$/);if(!m||(m[1]&&m[1]!==ownFile))return;const id=decodeURIComponent(m[2]),t=document.getElementById(id);if(!t)return;e.preventDefault();openUp(t);t.scrollIntoView({block:'start'});try{history.replaceState(null,'','#'+id)}catch(_){}});
window.addEventListener('hashchange',()=>openUp(document.getElementById(location.hash.slice(1))));
if(location.hash)openUp(document.getElementById(location.hash.slice(1)));
document.getElementById('expandAll').onclick=()=>document.querySelectorAll('details.chapter-d,section.chapter>details').forEach(d=>d.open=true);
document.getElementById('collapseAll').onclick=()=>document.querySelectorAll('section.chapter>details').forEach(d=>d.open=false);
const oc=document.getElementById('openCards'),cc=document.getElementById('closeCards');if(oc)oc.onclick=()=>document.querySelectorAll('details.acard').forEach(d=>d.open=true);if(cc)cc.onclick=()=>document.querySelectorAll('details.acard').forEach(d=>d.open=false);
(function(){const bs=document.querySelectorAll('.lk-theme button');function set(t){if(t)document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;try{t?localStorage.setItem('bookTheme',t):localStorage.removeItem('bookTheme')}catch(e){}bs.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===(t||''))))}bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.t)));set(document.documentElement.dataset.theme||'')})();
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
    out = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><script>try{{var t=localStorage.getItem("bookTheme");if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{title}{'' if dup_title else ' (Draft)'}</title><style>{css}</style></head>
<body id="top"{' class="classdoc"' if classy else ''}><div class="layout"><nav class="toc"><details class="tocwrap" open><summary>Contents</summary><div class="tocbtns"><button id="expandAll" type="button">Expand all</button><button id="collapseAll" type="button">Collapse all</button></div>{'<div class="tocbtns"><button id="openCards" type="button">Open all cards</button><button id="closeCards" type="button">Close all cards</button></div>' if classy else ''}<div class="lk-theme">Theme: <button type="button" data-t="">System</button> · <button type="button" data-t="light">Light</button> · <button type="button" data-t="dark">Dark</button></div>{''.join(toc)}</details></nav>
<main>{nav}{'' if dup_title else f'<div class="titleblock"><h1 class="doctitle">{title}</h1><p class="draft">Draft</p></div>'}{main}<p class="credits">Icons: Font Awesome Free (CC BY 4.0). Text fonts: Source Serif 4 and Source Sans 3 (SIL Open Font License). Card title font of the sample card: Cinzel (SIL Open Font License).</p><p class="totop"><a href="#top">Back to top</a></p></main></div><script>{js}</script></body></html>'''
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

# Pack CARD-ONE (Lucas, 2026-11-17: one card for every place it shows): every card's Structure as JSON (cards/structure.json; Foundry's card model,
# module/cardmodel.mjs, is checked against it by a test) and the book's card gallery (card-gallery.html: every card in the book's look, the
# screenshots of foundry/gallery compare it with Foundry's faces). Both are written by this build; never edit them.
json.dump({n: CARDS.structure(c) for n, c in sorted(CARD_DATA.items())}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cards', 'structure.json'), 'w'), indent=1, ensure_ascii=False)
was_classy, CLASSY['on'] = CLASSY['on'], False
gal_cards = ''.join(f'<div class="gal-card" data-card="{e(n)}">{re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', card(CARDS.structure(c), anchor=False))}</div>' for n, c in sorted(CARD_DATA.items()))
CLASSY['on'] = was_classy
open(os.path.join(OUTDIR, 'card-gallery.html'), 'w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Card gallery (book)</title><style>{css}.gal-card{{width:440px;margin:0 0 18px}}body{{padding:16px}}</style></head><body><main>{gal_cards}</main></body></html>')
print('card gallery:', len(CARD_DATA), 'cards; cards/structure.json written')
