"""
Polymarket emir yönetimi.
PAPER_MODE=true → gerçek emir açmaz, sadece loglar.
"""
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds, OrderArgs, OrderType
from py_clob_client.constants import POLYGON
import config


def get_client() -> ClobClient:
    creds = ApiCreds(
        api_key=config.POLYMARKET_API_KEY,
        api_secret=config.POLYMARKET_SECRET,
        api_passphrase=config.POLYMARKET_PASSPHRASE,
    )
    return ClobClient(
        host=config.CLOB_HOST,
        chain_id=POLYGON,
        key=config.POLYMARKET_PRIVATE_KEY,
        creds=creds,
    )


def kelly_stake(bankroll: float, price: float, edge: float = 0.03) -> float:
    """
    Yarı-Kelly: f = edge / (1 - price)
    edge = piyasa fiyatına karşı bizim avantajımız (varsayılan %3)
    """
    q = 1 - price
    if q <= 0:
        return 0
    f = edge / q
    half_kelly = f * 0.5  # yarı kelly — daha konservatif
    stake = bankroll * half_kelly
    return round(min(stake, bankroll * config.MAX_POSITION_PCT), 2)


def place_order(opportunity: dict, bankroll: float) -> dict:
    stake = kelly_stake(bankroll, opportunity["price"])
    if stake < 1:
        return {"status": "skip", "reason": "stake < $1"}

    result = {
        "market":    opportunity["question"][:60],
        "side":      opportunity["best_side"],
        "price":     opportunity["price"],
        "stake":     stake,
        "potential": round(stake / opportunity["price"], 2),
        "profit":    round(stake / opportunity["price"] - stake, 2),
    }

    if config.PAPER_MODE:
        result["status"] = "paper"
        return result

    try:
        client = get_client()
        order = client.create_and_post_order(
            OrderArgs(
                price=opportunity["price"],
                size=stake,
                side=opportunity["best_side"],
                token_id=opportunity["condition_id"],
            )
        )
        result["status"]   = "live"
        result["order_id"] = order.get("orderID", "")
    except Exception as e:
        result["status"] = "error"
        result["error"]  = str(e)

    return result


def get_positions() -> list:
    if config.PAPER_MODE:
        return []
    try:
        client = get_client()
        return client.get_positions()
    except Exception:
        return []
