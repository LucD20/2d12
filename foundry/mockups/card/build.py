import base64, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = open('src.html').read()
img = base64.b64encode(open('today-smite.png', 'rb').read()).decode()


def smite(live):
    extra = ' <span class="chg up">+1 per die</span> <span class="chg up">+ Radiant Zeal</span>' if live else ''
    head = '' if live else '<div class="ahead"><b>Smite</b><span class="ameta">Encounter &middot; 2 AP</span></div>'
    liveb = ('<div class="live"><div class="cl"><b>Your roll</b><span class="roll"><span class="m">+2 Weapon</span>'
             '<span class="g">Radiant Zeal</span><span class="b">Hindered</span>'
             '<button type="button" class="use no" title="1 AP left" aria-disabled="true">Use &middot; 2 AP</button></span></div></div>') if live else ''
    return f'''<div class="acard{' inrow' if live else ''}">{head}
<div class="flavor">Holy light gathers on your weapon as the fight wears on, and you bring all of it down in one blow.</div>
<div class="traits"><span>Signature</span><i class="dot">&middot;</i><span>Weapon</span><i class="dot">&middot;</i><span>Strike</span><i class="dot">&middot;</i><span>Divine</span><span class="auto"><i class="autodia auto-diamond" aria-hidden="true">&#9670;</i> Diamond</span></div>
<div class="cgrid"><span><b>Distance:</b> Weapon</span><span><b>Target:</b> One creature</span></div>
<div class="cl"><b>Smite dice</b><span><span class="pr">[R] 1d6!</span> Ho for each Escalation you have, up to 4 dice. Against a <span class="term">Profane</span> creature they are 1d8!s.</span></div>
<div class="cl"><b>Attack</b><span>Signature vs. Armor Defense</span></div>
<div class="cl"><b>Tier 1</b><span>Your Smite dice.</span></div>
<div class="cl"><b>Tier 2</b><span><span class="pv">[V] 1[W] + [Mod]</span> + your Smite dice.{extra}</span></div>
<div class="cl"><b>Tier 3</b><span><span class="pv">[V] 1[W] + [Mod]</span> + your Smite dice + 1 more Smite die.{extra}</span></div>
<div class="cl"><b>Special</b><span>When you use Smite, you can spend your Reaction AP to roll 1 more Smite die. Neither extra die counts toward the 4.</span></div>
{liveb}</div>'''


def judge(live):
    head = '' if live else '<div class="ahead"><b>Judge</b><span class="ameta">At-will &middot; 0 or 1 AP</span></div>'
    b0 = '<span class="why">Start of an encounter, or a 0R</span><button type="button" class="use no" aria-disabled="true">Use &middot; 0 AP</button>' if live else ''
    b1 = '<button type="button" class="use">Use &middot; 1 AP</button>' if live else ''
    return f'''<div class="acard{' inrow' if live else ''}">{head}
<div class="flavor">You pronounce a foe guilty before your god, and holy light dulls its blows against those who stand near you.</div>
<div class="traits"><span>Divine</span><span class="auto"><i class="autodia auto-mithril" aria-hidden="true">&#9670;</i> Mithril</span></div>
<div class="cgrid"><span><b>Distance:</b> 10 sq.</span><span><b>Target:</b> One enemy you can see</span></div>
<div class="cl"><b>Judged</b><span>A creature stops being Judged when it goes <span class="term">Down</span>. A creature Judged by you counts as <span class="term">Profane</span> for you. The first time each round it damages an ally within 5 squares of you, that damage is reduced by your Power Modifier.</span></div>
<div class="cblock{' off' if live else ''}"><div class="cbh"><span>0 AP</span>{b0}</div>
<div class="cl"><b>Special</b><span>You can use this only at the start of an encounter, or as a 0R when the creature you Judged goes <span class="term">Down</span>.</span></div>
<div class="cl"><b>Effect</b><span>The target is Judged by you until the encounter ends.</span></div></div>
<div class="cblock"><div class="cbh"><span>1 AP</span>{b1}</div>
<div class="cl"><b>Effect</b><span>The target is Judged by you instead of the one you had.</span></div></div>
</div>'''


def row(name, sub, cost, fq, btn, open_=True):
    return f'''<div class="row{'' if open_ else ' closed'}" style="--fq:var({fq})"><span class="strip"></span><span class="chev"></span><span><b>{name}</b><small>{sub}</small></span><span class="cost">{cost}</span>{btn}</div>'''


def opened(th, label):
    return f'''<div class="surf {th}"><p class="lab">{label}: THE ACTIONS TAB</p>
{row('Judge', 'Divine', '0 / 1 AP', '--fq-atw', '<button type="button" class="use">Use</button>')}
{judge(True)}
{row('Smite', 'Weapon &middot; Strike', '2 AP', '--fq-enc', '<button type="button" class="use no" title="1 AP left" aria-disabled="true">Use</button>')}
{smite(True)}
{row('Lay On Hands', 'Setup &middot; Divine', '1 / 2 AP', '--fq-atw', '<button type="button" class="use">Use</button>', False)}
</div>'''


def solo(th, label):
    return f'''<div class="surf {th}"><p class="lab">{label}</p>{smite(False)}<div style="height:12px"></div>{judge(False)}</div>'''


out = (src.replace('@@TODAY@@', img).replace('@@OPEN_DARK@@', opened('th-dark', 'DARK')).replace('@@OPEN_LIGHT@@', opened('th-light', 'LIGHT'))
       .replace('@@SOLO_DARK@@', solo('th-dark', 'DARK')).replace('@@SOLO_LIGHT@@', solo('th-light', 'LIGHT')))
open('index.html', 'w').write(out)
print('ok', len(out))
