"""
Polymarket market tarayıcı.
Dünya Kupası + kripto + siyasi marketleri filtreler,
yüksek güven skorlu fırsatları döndürür.
"""
import requests
from config import GAMMA_HOST, MIN_LIQUIDITY, MIN_ODDS, MAX_ODDS


def fetch_active_markets(limit=200):
    url = f"{GAMMA_HOST}/markets"
    params = {
        "active": "true",
        "closed": "false",
        "limit": limit,
        "order": "volume24hr",
        "ascending": "false",
    }
    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    return r.json()


def score_market(market: dict) -> dict | None:
    """
    Market kalite skoru hesapla.
    None döndürürse filtreden geçmedi.
    """
    try:
        import json as _json
        liquidity = float(market.get("liquidity", 0))
        volume    = float(market.get("volume", 0))
        outcomes_raw = market.get("outcomes", [])
        prices_raw   = market.get("outcomePrices", [])
        outcomes = _json.loads(outcomes_raw) if isinstance(outcomes_raw, str) else outcomes_raw
        prices   = _json.loads(prices_raw)   if isinstance(prices_raw, str)   else prices_raw

        if liquidity < MIN_LIQUIDITY:
            return None
        if len(outcomes) != 2 or len(prices) != 2:
            return None

        # En yüksek olasılıklı tarafı al
        p_yes = float(prices[0])
        p_no  = float(prices[1])
        best_price  = max(p_yes, p_no)
        best_side   = "YES" if p_yes >= p_no else "NO"
        best_outcome = outcomes[0] if best_side == "YES" else outcomes[1]

        if not (MIN_ODDS <= best_price <= MAX_ODDS):
            return None

        # Güven skoru: likidite + volume + oran stabilitesi
        score = (liquidity / 1_000_000) * 0.4 + (volume / 500_000) * 0.3 + (best_price * 0.3)

        return {
            "id":          market.get("id"),
            "condition_id": market.get("conditionId"),
            "question":    market.get("question", ""),
            "category":    market.get("category", ""),
            "best_side":   best_side,
            "best_outcome": best_outcome,
            "price":       best_price,
            "liquidity":   liquidity,
            "volume":      volume,
            "score":       round(score, 4),
            "end_date":    market.get("endDate", ""),
        }
    except Exception:
        return None


def get_opportunities(top_n=5) -> list[dict]:
    """En iyi N fırsatı döndür."""
    markets = fetch_active_markets()
    scored  = [s for m in markets if (s := score_market(m))]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_n]


if __name__ == "__main__":
    opps = get_opportunities()
    for o in opps:
        print(f"[{o['score']:.3f}] {o['question'][:60]} | {o['best_side']} {o['price']:.2f} | liq=${o['liquidity']:,.0f}")
