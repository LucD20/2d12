# Step 6 of the Foundry style plan (style-book.md): the chat cards' size.
# Builds index.html from the approved chat mockups' real cards (drawn by the system's own functions):
#   the styles and cards of ../chat-cards-dark.html (round 2 colors, fonts swapped) and ../chat-older-dark.html,
#   passed in as two JSON dumps (chat1.json, chat2.json: the outerHTML of each card, in page order) and the round-2 page.
# Usage: python3 build.py <round2 chat-cards page> <chat1.json> <chat2.json>
import json, re, sys, os
here = os.path.dirname(os.path.abspath(__file__))
page, j1, j2 = sys.argv[1:4]
older = os.path.join(here, '..', 'chat-older-dark.html')
st = re.findall(r'<style[^>]*>(.*?)</style>', open(page).read(), re.S)
st2 = re.findall(r'<style[^>]*>(.*?)</style>', open(older).read(), re.S)
c1, c2 = json.load(open(j1)), json.load(open(j2))

# palette A (decided 2026-11-17), dark
TIERA = """
.twod12-dark .twod12.chat.cc .cc-stamp.t1{background:#a8471a!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-stamp.t2{background:#0e6e52!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-stamp.t3{background:#2366a3!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-stamp.crit{background:#d9a62e!important;color:#1f1c18!important;box-shadow:inset 0 0 0 3px #f0c35a!important}
.twod12-dark .twod12.chat.cc .cc-seg.s1{background:color-mix(in srgb,#a8471a 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s2{background:color-mix(in srgb,#0e6e52 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s3{background:color-mix(in srgb,#2366a3 22%,#28241d)!important;color:#ece3cf!important}
.twod12-dark .twod12.chat.cc .cc-seg.s1.lit{background:#a8471a!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-seg.s2.lit{background:#0e6e52!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-seg.s3.lit{background:#2366a3!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-pill.word.t1{background:#a8471a!important;border-color:#a8471a!important;color:#fff!important}
.twod12-dark .twod12.chat.cc .cc-pill.word.t2{background:#0e6e52!important;border-color:#0e6e52!important;color:#fff!important}
"""

# A: tighter, CSS only (no element added, moved or removed)
TIGHT = """
.tight .twod12.chat.cc .cc-card{padding:5px 7px 5px!important}
.tight .twod12.chat.cc .cc-tline{margin:1px 0 3px!important;font-size:12px}
.tight .twod12.chat.cc .cc-body{grid-template-columns:46px minmax(0,1fr)!important;gap:7px!important}
.tight .twod12.chat.cc .cc-stamp{min-height:44px!important;padding:2px 1px!important}
.tight .twod12.chat.cc .cc-stamp b{font-size:24px!important}
.tight .twod12.chat.cc .cc-stamp small{font-size:8px!important;letter-spacing:.4px!important}
.tight .twod12.chat.cc .cc-stamp .cc-stl{font-size:9px!important;margin-top:0!important}
.tight .twod12.chat.cc .cc-ladder{padding-top:14px!important;min-height:0!important}
.tight .twod12.chat.cc .cc-hr{margin:4px 0 3px!important}
.tight .twod12.chat.cc .cc-foot .cc-btn,.tight .twod12.chat.cc .cc-icon{height:22px!important;min-height:22px!important}
.tight .twod12.chat.cc .cc-icon{width:22px!important}
.tight .twod12.chat.cc .cc-btn{min-height:22px!important;padding:1px 8px!important}
.tight .twod12.chat.cc .cc-pools{margin-top:2px!important;padding:2px 6px!important}
.tight .twod12.chat.cc .cc-trow{padding:2px 0!important}
.tight .msg{margin-bottom:4px}
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
.chatcol>.h{font-size:13px;color:#a9a194;margin:0 0 .5rem;min-height:3.9em}
.log{position:relative;background:#211e1a;border:1px solid #3a362f;padding:6px}
.msg{margin-bottom:6px}
.turn{font-size:11.5px;color:#a9a194;text-align:center;margin:2px 0 6px;border-bottom:1px solid #3a362f;line-height:1.6}
.tot{font-size:13px;color:#a9a194;margin-top:.4rem}.tot b{color:#e9e3d6}
.fold{display:flex;align-items:center;gap:7px;height:26px;padding:0 7px;margin-bottom:3px;background:#28241d;border:1px solid #3a362f;font-size:12.5px;cursor:pointer;white-space:nowrap;overflow:hidden}
.fold .t{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
.fold .mk{flex:none;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;color:#fff}
.fold .mk.t1{background:#a8471a}.fold .mk.t2{background:#0e6e52}.fold .mk.t3{background:#2366a3}
.fold .mk.dm{background:none;border:1px solid #d2a75a;color:#e9e3d6;width:auto;padding:0 4px}
.fold .mk.ln{background:none;color:#a9a194;font-size:13px}
.fold .chev{flex:none;width:6px;height:6px;border-right:1.5px solid #a9a194;border-bottom:1.5px solid #a9a194;transform:rotate(-45deg)}
.screen{position:absolute;left:-6px;right:-6px;border-top:2px dashed #d2a75a;pointer-events:none}
.screen span{position:absolute;right:0;top:-1.5em;font-size:11px;color:#d2a75a;background:#1c1a17;padding:0 4px}
table.h{border-collapse:collapse;font-size:14px;margin-top:.6rem}
table.h td,table.h th{border-bottom:1px solid #3a362f;padding:.25rem 1rem .25rem 0;text-align:left;font-weight:400}
table.h th{color:#a9a194}
"""

def card(lst, i):
    return f'<div class="msg">{lst[i]["html"]}</div>'

def fold(mark, cls, text):
    return f'<div class="fold" role="button" tabindex="0"><span class="mk {cls}">{mark}</span><span class="t">{text}</span><span class="chev" aria-hidden="true"></span></div>'

# one round's slice of the chat, oldest first: the Orc Warrior's turn, then Durgan's (the latest)
orc = [card(c1, 0), card(c2, 1), card(c2, 18)]
durgan = [card(c1, 1), card(c1, 10), card(c2, 0)]
orc_folded = [fold('1', 't1', '<b>Cleaver</b> &rarr; Aveline &middot; 9 vs AD 13'),
              fold('&#9889;', 'ln', '<b>Reactions</b> &middot; resolved, 2 used'),
              fold('&#9656;', 'ln', "<b>End of Orc Warrior's Turn</b> &middot; Guard 4")]
TURN_O = '<div class="turn">Orc Warrior\'s turn</div>'
TURN_D = '<div class="turn">Durgan\'s turn (now)</div>'

def col(title, note, cls, body, ident):
    return f'''<div class="chatcol"><h3>{title}</h3><p class="h">{note}</p>
<div class="stage side dk twod12-dark twod12-type {cls}"><div class="log" id="{ident}">{body}</div></div><p class="tot" data-for="{ident}"></p></div>'''

cols = (col('Today (steps 2 to 4 in)', 'The approved cards with the new fonts, colors and Tier palette A.', '', TURN_O + ''.join(orc) + TURN_D + ''.join(durgan), 'today')
        + col('A. Tighter (CSS only)', 'Smaller stamp, paddings and buttons; nothing added, moved or removed.', 'tight', TURN_O + ''.join(orc) + TURN_D + ''.join(durgan), 'tight')
        + col('A + B. Older turns fold', "A, and every message from an earlier turn folds to one line (click to open it). The current turn stays open.", 'tight', TURN_O + ''.join(orc_folded) + TURN_D + ''.join(durgan), 'fold'))

body = f'''<div class="wrap">
<h1>Foundry Chat Size</h1>
<p class="sub">Step 6 of the Foundry style plan. Two turns of the chat, at the sidebar's width (300 px), with the system's real cards: the Orc Warrior's Cleaver, a Strike with Reactions and its End of Turn line, then Durgan's Smite, its damage and the Reactions card it opens. The dashed line is about what a 1080p screen shows of the chat at once (an estimate: Foundry's tabs and the chat box take the rest).</p>
<div class="chats">{cols}</div>

<h2>What I found</h2>
<ul>
<li><strong>The attack and damage cards are already short.</strong> The chat cards' redesign put the result first; an attack card is about 175 px, a damage card about 130. Tightening them (A) saves about a tenth, without hiding anything.</li>
<li><strong>The height comes from the number of messages an Action leaves</strong> (the attack, the damage, the Reactions card, follow-up lines, the End of Turn line) <strong>and from a few tall cards</strong>: the Reactions card while it waits (about 200 px), the initiative card (about 255), the area damage card (about 310), an End of Turn line left open (160).</li>
<li><strong>Folding what is past (B) is the fix other systems ship</strong> (the research: collapse older cards; summary lines), and it keeps every card one click away.</li>
</ul>
<table class="h"><tr><th>The two turns</th><th>Height</th></tr><tbody id="sums"></tbody></table>

<h2>The options</h2>
<ul>
<li><strong>A, tighter (my pick, with B).</strong> CSS only: the stamp from 64 to 44 px, the card's padding, the buttons from 26 to 22 px. A style change like steps 2 and 3.</li>
<li><strong>B, older turns fold (my pick).</strong> When a new turn starts, the messages of the turns before it fold to one line each: the Tier as a small square with its number, the Action and its target, the roll; the damage as its total; Reactions as "resolved"; the End of Turn line as its title. A click opens one. <em>Not style only:</em> a small script reads what each card already stores and draws its line; nothing is lost. A setting can turn it off.</li>
<li><strong>C, one message per Action (not now).</strong> The damage written into the attack card instead of a second card, as dnd5e and Draw Steel do. The biggest gain, but it changes how damage, Apply and the Reactions work: a Foundry pack of its own, logged, not part of this style pass.</li>
</ul>
<p class="sub">Not tried in Foundry. The folded lines' text is mine; the cards' text comes from the mockups' samples, so the Reactions card shows an earlier sample's names.</p>
</div>
<script>
(function(){{
  const H=id=>Math.round(document.getElementById(id).getBoundingClientRect().height);
  const names={{today:'Today',tight:'A. Tighter',fold:'A + B. Older turns fold'}};
  const base=H('today'); let rows='';
  for(const id of ['today','tight','fold']){{const h=H(id);document.querySelector('[data-for="'+id+'"]').innerHTML='Two turns: <b>'+h+' px</b>'+(id==='today'?'':' ('+Math.round(100-100*h/base)+'% less)');rows+='<tr><td>'+names[id]+'</td><td>'+h+' px'+(id==='today'?'':' ('+Math.round(100-100*h/base)+'% less)')+'</td></tr>';}}
  document.getElementById('sums').innerHTML=rows;
  for(const id of ['today','tight','fold']){{const el=document.getElementById(id);const s=document.createElement('div');s.className='screen';s.style.top='760px';s.innerHTML='<span>about one screen</span>';if(H(id)>760)el.appendChild(s);}}
  document.querySelectorAll('.fold').forEach(f=>f.addEventListener('click',()=>f.classList.toggle('open')));
}})();
</script>'''

styles = ''.join(f'<style>{s}</style>' for s in st2[:2] + st[1:]) + f'<style>{TIERA}{TIGHT}{PAGE}</style>'
html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Foundry Chat Size</title>{styles}</head><body>{body}</body></html>'
open(os.path.join(here, 'index.html'), 'w').write(html)
print('ok', len(html))
