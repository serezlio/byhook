"""
Telegram bildirim modülü.
"""
import requests
from config import TELEGRAM_TOKEN, TELEGRAM_CHAT_ID


def send(text: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML",
    }, timeout=10)


def order_notify(result: dict):
    emoji = "📄" if result["status"] == "paper" else ("✅" if result["status"] == "live" else "❌")
    mode  = "PAPER" if result["status"] == "paper" else "CANLI"

    msg = (
        f"{emoji} <b>Polymarket [{mode}]</b>\n"
        f"📌 {result['market']}\n"
        f"🎯 {result['side']} @ {result['price']:.2f}\n"
        f"💵 Stake: <b>${result['stake']}</b>\n"
        f"💰 Potansiyel: ${result['potential']} (+${result['profit']})\n"
    )
    if result["status"] == "error":
        msg += f"⚠️ Hata: {result.get('error', '')}\n"

    send(msg)


def opportunity_notify(opps: list):
    if not opps:
        send("🔍 Polymarket: Uygun fırsat bulunamadı.")
        return

    lines = ["🔎 <b>Polymarket Fırsatları</b>\n"]
    for i, o in enumerate(opps, 1):
        lines.append(
            f"{i}. {o['question'][:50]}\n"
            f"   → {o['best_side']} {o['price']:.0%} | liq=${o['liquidity']/1000:.0f}k\n"
        )
    send("".join(lines))
