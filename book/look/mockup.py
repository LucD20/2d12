"""Mockups of the book's decided look (book/cards/card-look.md): copies the built documents into a folder with book-look.css,
the fonts and a Light / Dark switch injected. Nothing in rules.css, build_rules.py or the built documents changes.
Run from book/: python3 look/mockup.py OUTDIR FONTDIR  (FONTDIR holds the Source Serif 4 woff2 subsets of the full files)."""
import sys, os, base64, re
out, fonts = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
def uri(n): return 'data:font/woff2;base64,' + base64.b64encode(open(os.path.join(fonts, n), 'rb').read()).decode()
ff = (f"@font-face{{font-family:'Source Serif 4';src:url({uri('SourceSerif4opszwght.woff2')}) format('woff2');font-weight:200 900;font-style:normal}}\n"
      f"@font-face{{font-family:'Source Serif 4';src:url({uri('SourceSerif4-Italicopszwght.woff2')}) format('woff2');font-weight:200 900;font-style:italic}}\n")
css = open(os.path.join(os.path.dirname(__file__), 'book-look.css')).read()
head = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap">'
        f'<style>{ff}{css}</style>'
        '<script>try{var t=localStorage.getItem("bookTheme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>')
switch = ('<div class="lk-theme">Theme: <button type="button" data-t="">System</button> · <button type="button" data-t="light">Light</button> · '
          '<button type="button" data-t="dark">Dark</button></div>'
          '<script>(function(){var bs=document.querySelectorAll(".lk-theme button");function set(t){if(t)document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;'
          'try{t?localStorage.setItem("bookTheme",t):localStorage.removeItem("bookTheme")}catch(e){}bs.forEach(function(b){b.setAttribute("aria-pressed",String(b.dataset.t===(t||"")))})}'
          'bs.forEach(function(b){b.addEventListener("click",function(){set(b.dataset.t)})});set(document.documentElement.dataset.theme||"")})();</script>')
for f in sys.argv[3:] or ['core-rules.html', 'gear.html', 'paladin.html', 'archer.html', 'species.html', 'bestiary.html']:
    s = open(f, encoding='utf-8').read()
    s = s.replace('</head>', head + '</head>', 1)
    s = re.sub(r'(<div class="tocbtns">.*?</div>)', lambda m: m.group(1) + switch, s, count=1, flags=re.S)
    if switch not in s: s = s.replace('<main', switch + '<main', 1)
    open(os.path.join(out, f), 'w', encoding='utf-8').write(s)
    print(f)
