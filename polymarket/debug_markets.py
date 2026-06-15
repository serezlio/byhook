import requests

r = requests.get('https://gamma-api.polymarket.com/markets?active=true&limit=30&order=volume24hr&ascending=false')
data = r.json()
for m in data:
    prices = m.get('outcomePrices', [])
    liq = float(m.get('liquidity', 0))
    if len(prices) == 2:
        p = [float(x) for x in prices]
        best = max(p)
        q = m.get('question', '')[:55]
        print(f"best={best:.3f} liq={liq:,.0f} | {q}")
