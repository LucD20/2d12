import json,sys,re
S=json.load(open('spells.json'))
p=sys.argv[1]; mode=sys.argv[2] if len(sys.argv)>2 else 'B'
def rq(s): return ''.join(({'astral':'S','glamour':'G','air':'A'}.get(x[0],x[0][0].upper()))+x[1] for x in s['paths']) if s['paths'] else s['req'][:12]
def st(s,n):
    t=s['stats']
    t=re.sub(r'\d+% Casting Time / ','',t); t=re.sub(r'Range: ','R:',t); t=re.sub(r' Squares?','sq',t); t=t.replace('Fatigue','Fat').replace('AOE: ','A:').replace('(+','(+').replace(' per )','/lv)')
    return t[:n]
for sch in ['evocation','alteration','enchantment','conjuration','thaumaturgy','blood-magic','divine-magic']:
    rows=[s for s in S if s['paths'] and s['paths'][0][0]==p and s['school']==sch and (s['ritual']==(mode=='R'))]
    if not rows: continue
    print(f'## {p} {sch} ({len(rows)})')
    for s in rows:
        print(f"- {s['name']} [{rq(s)}; {s['level']}] {st(s,int(sys.argv[3]) if len(sys.argv)>3 else 240)}")
if mode=='B':
    sec=[s for s in S if len(s['paths'])>1 and p in [x[0] for x in s['paths'][1:]]]
    print('## as secondary path:', '; '.join(f"{s['name']}[{rq(s)}{'R' if s['ritual'] else ''}]" for s in sec))
