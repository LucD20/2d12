import sys,re,html,os
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.inmain=False; s.cell=False
    def handle_starttag(s,t,a):
        a=dict(a)
        if t in('script','style','nav','footer','head'): s.skip+=1
        if t in('h1','h2','h3','h4'): s.out.append('\n\n'+'#'*int(t[1])+' ')
        elif t in('p','div','ul','ol','table'): s.out.append('\n')
        elif t=='tr': s.out.append('\n| ')
        elif t in('td','th'): s.cell=True
        elif t=='li': s.out.append('\n- ')
        elif t=='br': s.out.append(' / ' if s.cell else '\n')
        elif t=='img':
            alt=a.get('alt') or a.get('title') or ''
            if alt: s.out.append('['+alt+']')
    def handle_endtag(s,t):
        if t in('script','style','nav','footer','head'): s.skip=max(0,s.skip-1)
        if t in('td','th'): s.out.append(' | '); s.cell=False
    def handle_data(s,d):
        if not s.skip: s.out.append(d.replace('\n',' ') if s.cell else d)
src,dst=sys.argv[1],sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.html'): continue
    raw=open(os.path.join(src,f),errors='replace').read()
    p=P(); p.feed(raw); t=''.join(p.out)
    t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n\n',t)
    open(os.path.join(dst,f[:-5]+'.txt'),'w').write(t)
