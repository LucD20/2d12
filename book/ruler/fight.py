# Expected-value fight model: 4 PCs (24 dmg/turn each, 85% effective for moving/overkill) focus enemies one at a time;
# each living enemy deals D per round to the party (112 Health total). Prints rounds to win and the share of party Health lost.
def fight(n, H, D, pcs=4, dmg=24*0.85, party=112):
    hp=[H]*n; lost=0; rnd=0
    while any(h>0 for h in hp) and rnd<10:
        rnd+=1
        alive=sum(1 for h in hp if h>0)
        lost+=alive*D/2            # enemies act, on average, between the PCs' turns: half before the PCs' damage lands
        pool=pcs*dmg
        for i in range(n):
            if hp[i]<=0: continue
            take=min(hp[i],pool); hp[i]-=take; pool-=take
            if pool<=0: break
        alive2=sum(1 for h in hp if h>0); lost+=alive2*D/2
    return rnd, lost/party
for label,n,H,D in [("my targets: 4 Standards (25 Health, 8 dmg)",4,25,8),("8 Standards (25 Health, 8 dmg)",8,25,8),("8 Standards (25 Health, 4 dmg)",8,25,4),
                    ("4 Standards (50 Health, 8 dmg)",4,50,8),("4 Standards (50 Health, 7 dmg)",4,50,7),("4 Standards (60 Health, 6 dmg)",4,60,6),
                    ("2 Elites (110 Health, 15 dmg)",2,110,15),("1 Elite + 2 Standards (mixed)",0,0,0)]:
    if n==0:
        # mixed: Elite 110/15 + 2 Standards 50/7
        hp=[50,50,110]; D=[7,7,15]; lost=0; rnd=0
        while any(h>0 for h in hp) and rnd<10:
            rnd+=1; lost+=sum(d for h,d in zip(hp,D) if h>0)/2; pool=4*24*0.85
            for i in range(3):
                if hp[i]<=0: continue
                t=min(hp[i],pool); hp[i]-=t; pool-=t
                if pool<=0: break
            lost+=sum(d for h,d in zip(hp,D) if h>0)/2
        print(f"{label:45} rounds {rnd}  party Health lost {lost/112:.0%}"); continue
    r,l=fight(n,H,D); print(f"{label:45} rounds {r}  party Health lost {l:.0%}")
