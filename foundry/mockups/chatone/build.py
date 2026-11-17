# Step 6, option C (Lucas, 2026-11-17: "C, proceed"): one message per Action, the damage written into the attack card.
# Builds index.html from pieces.json (node pieces.mjs: the system's own functions) and the approved chat mockups' cards and styles
# (the same inputs as ../chatsize/build.py).   python3 build.py <round2 chat-cards page> <chat1.json> <chat2.json>
import json, re, sys, os
here = os.path.dirname(os.path.abspath(__file__))
page, j1, j2 = sys.argv[1:4]
older = os.path.join(here, '..', 'chat-older-dark.html')
st = re.findall(r'<style[^>]*>(.*?)</style>', open(page).read(), re.S)
st2 = re.findall(r'<style[^>]*>(.*?)</style>', open(older).read(), re.S)
c1, c2 = json.load(open(j1)), json.load(open(j2))
P = json.load(open(os.path.join(here, 'pieces.json')))


def between(h, start, end_marker):
    i = h.index(start)
    j = h.index(end_marker, i)
    return h[i:j]


def dgroup(dmg_html):
    """The damage card's pools, dice and target rows (its cc-dgroup), without its stamp and title."""
    i = dmg_html.index('<div class="cc-dgroup">')
    depth = 0
    for m in re.finditer(r'<(/?)div\b[^>]*>', dmg_html[i:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return dmg_html[i:i + m.end()]


def merged(dmg_html, total=18):
    """The attack card once the damage is rolled. The damage's pools go beside the stamp, under the ladder (the space the stamp
    leaves); the target's row moves into the footer: its Apply (or Took and Undo) in the place of the Damage button."""
    a = P['attack']
    g = dgroup(dmg_html)
    pools = g[len('<div class="cc-dgroup">'):g.index('<div class="cc-trows">')]
    trow = g[g.index('<div class="cc-trows">'):]
    lab = f'<div class="cc-dlab"><span>Damage</span><b>{total}</b></div>'
    a = a.replace('<div class="cc-outcome">', lab + pools + '<div class="cc-outcome">', 1)
    applied = 'cc-trow done' in trow
    btns = re.findall(r'<button type="button" class="cc-(?:icon small|btn small[^"]*cc-rbtn)".*?</button>', trow, re.S)
    adj = re.search(r'<div class="cc-adjrow ondemand">.*?</div>', trow, re.S)
    rep = ''.join(btns)
    a = re.sub(r'<button type="button" class="cc-btn small primary" data-twod12="rollDamage">.*?</button>', rep, a, count=1, flags=re.S)
    if applied:
        took = re.search(r'<span class="cc-took">.*?</span>\s*</span>', trow, re.S).group(0)
        took = took[:took.rindex('</span>')]
        a = a.replace('<b class="cc-tname">Orc Warrior</b></span>', '<b class="cc-tname">Orc Warrior</b><span class="cc-ftook">' + took + '</span></span>', 1)
    if adj:
        a = a[:a.rindex('</div></div>')] + adj.group(0) + '</div></div>'
    return a


wrap = lambda h: f'<div class="twod12 chat cc">{h}</div>'
M_PEND = wrap(merged(P['dmgPending']))
M_DONE = wrap(merged(P['dmgApplied']))
A_ONLY = wrap(P['attack'])

CSS = """
/* the damage written into the attack card: beside the stamp, under the ladder; Apply in the footer */
.twod12.chat.cc .cc-dlab{display:flex;align-items:baseline;gap:6px;margin:5px 0 0}
.twod12.chat.cc .cc-dlab span{font-size:9.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;opacity:.8}
.twod12.chat.cc .cc-dlab b{font-size:15px;line-height:1}
.twod12.chat.cc .cc-attack .cc-pools{margin-top:2px!important;padding:2px 6px!important}
.twod12.chat.cc .cc-foot{flex-wrap:wrap}
.twod12.chat.cc .cc-ftook{display:block;line-height:1.15}
.twod12.chat.cc .cc-ftook .cc-took{font-size:11px;opacity:.85}
.twod12.chat.cc .cc-foot .cc-adjrow{flex-basis:100%}
.twod12-dark .twod12.chat.cc .cc-stamp.t1{background:#a8471a!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-stamp.t2{background:#0e6e52!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-seg.s1{background:color-mix(in srgb,#a8471a 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s2{background:color-mix(in srgb,#0e6e52 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s3{background:color-mix(in srgb,#2366a3 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s1.lit{background:#a8471a!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-seg.s2.lit{background:#0e6e52!important;color:#fff!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-stamp.t1{background:#b34a12!important;color:#fff!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-stamp.t2{background:#0f7a5a!important;color:#fff!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-seg.s1{background:color-mix(in srgb,#b34a12 18%,#f4ede0)!important;color:#2a241d!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-seg.s2{background:color-mix(in srgb,#0f7a5a 18%,#f4ede0)!important;color:#2a241d!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-seg.s3{background:color-mix(in srgb,#0a64a8 18%,#f4ede0)!important;color:#2a241d!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-seg.s1.lit{background:#b34a12!important;color:#fff!important}
.twod12-type:not(.twod12-dark) .twod12.chat.cc .cc-seg.s2.lit{background:#0f7a5a!important;color:#fff!important}
"""

PAGE = """
html,body{background:#1c1a17}
body{color:#e9e3d6;font:15px/1.5 "Signika",system-ui,sans-serif;padding:24px 16px 60px}
.wrap{max-width:72rem;margin:0 auto}
h1{font:600 1.6rem/1.2 "Cinzel",Georgia,serif;margin:0 0 .4rem;letter-spacing:0}
h2{font:600 1.15rem/1.3 "Cinzel",Georgia,serif;margin:2.2rem 0 .4rem;padding-top:1rem;border-top:1px solid #5b5448;letter-spacing:0}
p,li{max-width:50rem}.sub{color:#a9a194}
.chats{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-start;margin-top:1rem}
.chatcol{width:300px;flex:none}
.chatcol>h3{font:600 15px "Signika",sans-serif;margin:0 0 .2rem}
.chatcol>.h{font-size:13px;color:#a9a194;margin:0 0 .5rem;min-height:2.6em}
.log{background:#211e1a;border:1px solid #3a362f;padding:6px}
.stage.side:not(.dk) .log{background:#d9d3c5;border-color:#bfae8c}
.msg{margin-bottom:6px}
.turn{font-size:11.5px;color:#a9a194;text-align:center;margin:2px 0 6px;border-bottom:1px solid #3a362f;line-height:1.6}
.stage.side:not(.dk) .turn{color:#5d5446;border-color:#bfae8c}
.tot{font-size:13px;color:#a9a194;margin-top:.4rem}.tot b{color:#e9e3d6}
.stage.side{padding:0!important;background:none!important}
ol li,ul li{margin:.2rem 0}
"""


def col(title, note, cls, body, ident=''):
    tot = f'<p class="tot" data-for="{ident}"></p>' if ident else ''
    idattr = f' id="{ident}"' if ident else ''
    return f'''<div class="chatcol"><h3>{title}</h3><p class="h">{note}</p>
<div class="stage side {cls}"><div class="log"{idattr}>{body}</div></div>{tot}</div>'''


DK, LT = 'dk twod12-dark twod12-type', 'twod12-type'
msg = lambda h: f'<div class="msg">{h}</div>'
states = (col('1. Rolled', 'As today: the roll, its Tier, the Damage button.', DK, msg(A_ONLY))
          + col('2. Damage rolled', 'The same message: the damage under the roll, the target\'s row with Apply. No second card.', DK, msg(M_PEND))
          + col('3. Applied', 'The row says what it took, with Undo and Full / Half / Double, as the damage card does today.', DK, msg(M_DONE)))
light = (col('2. Damage rolled (light)', 'The same card on the light theme.', LT, msg(M_PEND))
         + col('3. Applied (light)', '', LT, msg(M_DONE)))
TURN_O = '<div class="turn">Orc Warrior\'s turn</div>'
TURN_D = '<div class="turn">Durgan\'s turn (now)</div>'
orc = ''.join(msg(c1[0]['html']) + msg(c2[1]['html']) + msg(c2[18]['html']) for _ in [0])
today = TURN_O + orc + TURN_D + msg(c1[1]['html']) + msg(c1[10]['html']) + msg(c2[0]['html'])
one = TURN_O + orc + TURN_D + msg(M_PEND) + msg(c2[0]['html'])
turns = (col('Today', 'The attack card, then a damage card.', DK, today, 'today')
         + col('C. One message per Action', 'The damage in the attack card.', DK, one, 'one'))

body = f'''<div class="wrap">
<h1>Foundry One Message</h1>
<p class="sub">Step 6, option C: one message per Action. The Damage button no longer posts a second card: it writes the damage into the attack card it sits on. Drawn with the system's own card functions (the attack card and the damage card's pools and rows), put together the way the build would. Smite on the Orc Warrior, Tier 2, 18 damage.</p>

<h2>The card, step by step</h2>
<div class="chats">{states}</div>
<div class="chats">{light}</div>

<h2>Two turns of the chat</h2>
<p class="sub">The same two turns as the Chat Size page: the Orc Warrior's turn, then Durgan's Smite, its damage and the Reactions card. <strong>One Action:</strong> the attack card and the damage card (175 + 131 px and a gap) become one card of 219 px, about 30% less, and one Foundry header less. <strong>Two turns:</strong> about 9% less, since the Reactions card and the End of Turn line stay as they are (folding older turns, B, would add to it).</p>
<div class="chats">{turns}</div>

<h2>What changes in the card</h2>
<ul>
<li><strong>The damage goes beside the stamp, under the ladder</strong> (the space the tall stamp leaves today): "Damage 18" and the pools (Vigor, Resolve; a click shows the dice, as today).</li>
<li><strong>Apply takes the Damage button's place in the footer,</strong> beside the target's name, with Full / Half / Double behind the sliders button; once applied, "Took …" goes under the name and Apply becomes Undo, as the damage card's row does today.</li>
<li><strong>With several targets</strong> the attack card already has a row a target; each row takes its own Apply (not drawn here).</li>
<li><strong>The damage stamp goes:</strong> the Tier stamp is already on the card, and the damage card's link back to its roll card has nothing to link to.</li>
</ul>

<h2>What changes in Foundry (the build, not style)</h2>
<ol>
<li><strong>Damage</strong> rolls and updates the attack's own message (its content, its flags, its roll for Dice So Nice), in the place of posting a damage message.</li>
<li><strong>Apply, Apply all, Undo, Full / Half / Double, Lethal</strong> work as today, on that message's stored damage. Players' choices still go to the creature's owner through the socket.</li>
<li><strong>Several targets:</strong> one row a target under the damage, each with its own Tier's damage (today's groups by Tier). <strong>A Save Action's card</strong> takes its damage the same way.</li>
<li><strong>Damage with no attack card keeps its own damage card:</strong> Bleed, an area's hazard, an inline [[damage]] link, the area damage of a Save stack.</li>
<li><strong>Old messages keep working</strong> (an old damage card still applies); the flags other modules read (flags.twod12.damage) are written on the attack message.</li>
<li><strong>Rolling again:</strong> once rolled, the Damage button goes (no second roll by mistake); the GM can roll it again from the card's menu.</li>
</ol>
<p class="sub">Not tried in Foundry. The height measured here leaves out Foundry's own message header (the speaker and the time), so the real saving is one header more than shown.</p>
</div>
<script>
(function(){{
  const H=id=>Math.round(document.getElementById(id).getBoundingClientRect().height);
  const a=H('today'),b=H('one');
  document.querySelector('[data-for="today"]').innerHTML='Two turns: <b>'+a+' px</b>';
  document.querySelector('[data-for="one"]').innerHTML='Two turns: <b>'+b+' px</b> ('+Math.round(100-100*b/a)+'% less)';
}})();
</script>'''

styles = ''.join(f'<style>{s}</style>' for s in st2[:2] + st[1:]) + f'<style>{CSS}{PAGE}</style>'
html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Foundry One Message</title>{styles}</head><body>{body}</body></html>'
open(os.path.join(here, 'index.html'), 'w').write(html)
print('ok', len(html))
