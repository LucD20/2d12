import re,json,sys,collections
PATHS='fire air water earth astral death nature glamour blood holy'.split()
out=[]
for sch in ['evocation','alteration','enchantment','conjuration','thaumaturgy','blood-magic','divine-magic','construction']:
    t=open(f'wtxt/{sch}.txt').read()
    i=t.find('\n# ');  t=t[i:]
    level=None
    # split by headings and rows
    for block in re.split(r'\n(?=### |## |\| \n)',t):
        b=block.strip()
        if b.startswith('#'):
            h=b.split('\n')[0].lstrip('# ').strip(); level=h
            rest='\n'.join(b.split('\n')[1:])
        if b.startswith('|'):
            cells=[c.strip() for c in b.strip('| \n').split(' | ')]
            cells=[c for c in cells]
            if len(cells)<3 or cells[0]=='Spell': continue
            name=cells[0]; req=cells[1]; eff=cells[2] if len(cells)>2 else ''; stats=cells[3] if len(cells)>3 else ''
            paths=re.findall(r'\[(%s) (\d+)\]'%'|'.join(PATHS),req)
            gems=re.findall(r'(\d+)\s*\[([a-z ]+?)\]',req)
            out.append(dict(school=sch,level=level,name=name,req=req,paths=paths,eff=eff,stats=stats,ritual=('Ritual' in stats)))
json.dump(out,open('spells.json','w'),indent=0)
print(len(out))
c=collections.Counter((s['school'],s['ritual']) for s in out); print(c)
c=collections.Counter(); 
for s in out:
    if s['paths']: c[(s['paths'][0][0],s['school'][:4],'R' if s['ritual'] else 'B')]+=1
    else: c[('none',s['school'][:4])]+=1
S=['evoc','alte','ench','conj','thau','bloo','divi']
print('battle/ritual   '+'  '.join(f'{x:>6}' for x in S))
for p in PATHS: print(f'{p:8}', '  '.join(f"{c[(p,x,'B')]:>3}/{c[(p,x,'R')]:<3}" for x in S))
print([ (s['name'],s['req'][:40]) for s in out if not s['paths']][:15])
print(sorted(set(s['level'] for s in out)))
