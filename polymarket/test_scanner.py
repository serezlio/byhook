import sys
sys.path.insert(0, '.')
import scanner

opps = scanner.get_opportunities()
if not opps:
    print("Fırsat bulunamadı veya API erişim sorunu.")
else:
    for o in opps:
        print(f"[{o['score']:.3f}] {o['question'][:55]} | {o['best_side']} {o['price']:.0%} | liq=${o['liquidity']:,.0f}")
