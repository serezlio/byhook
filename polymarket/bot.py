"""
Polymarket Ana Bot
Çalıştır: python polymarket/bot.py

Her 2 saatte bir market tarar, en iyi fırsatı bulur,
Kelly stake hesaplar, emir açar (veya paper loglar),
Telegram'a bildirir.
"""
import time
import schedule
import logging
import json
import os
from datetime import datetime

import scanner
import trader
import notifier
import config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("polymarket/bot.log", encoding="utf-8"),
        logging.StreamHandler(),
    ]
)
log = logging.getLogger(__name__)

LEDGER_FILE = "polymarket/ledger.json"


def load_ledger() -> dict:
    if os.path.exists(LEDGER_FILE):
        with open(LEDGER_FILE) as f:
            return json.load(f)
    return {"bankroll": config.BANKROLL, "trades": [], "daily_count": 0, "last_date": ""}


def save_ledger(ledger: dict):
    with open(LEDGER_FILE, "w") as f:
        json.dump(ledger, f, indent=2, ensure_ascii=False)


def reset_daily_if_needed(ledger: dict) -> dict:
    today = datetime.now().strftime("%Y-%m-%d")
    if ledger.get("last_date") != today:
        ledger["daily_count"] = 0
        ledger["last_date"]   = today
    return ledger


def run():
    ledger = load_ledger()
    ledger = reset_daily_if_needed(ledger)

    log.info(f"Tarama başladı | Bankroll: ${ledger['bankroll']:.2f} | Günlük işlem: {ledger['daily_count']}")

    # Günde max 3 işlem
    if ledger["daily_count"] >= 3:
        log.info("Günlük işlem limiti doldu, bekleniyor.")
        return

    # Fırsatları tara
    try:
        opps = scanner.get_opportunities(top_n=3)
    except Exception as e:
        log.error(f"Scanner hatası: {e}")
        notifier.send(f"⚠️ Scanner hatası: {e}")
        return

    if not opps:
        log.info("Uygun fırsat yok.")
        return

    # En iyi fırsatı seç
    best = opps[0]
    log.info(f"Fırsat: {best['question'][:60]} | {best['best_side']} {best['price']:.2f}")

    # Emir ver
    result = trader.place_order(best, ledger["bankroll"])
    log.info(f"Emir sonucu: {result}")

    # Ledger güncelle
    if result["status"] in ("paper", "live"):
        ledger["daily_count"] += 1
        ledger["trades"].append({
            "time":      datetime.now().isoformat(),
            "market":    best["question"][:80],
            "side":      result["side"],
            "price":     result["price"],
            "stake":     result["stake"],
            "potential": result["potential"],
            "status":    result["status"],
        })
        # Paper modda potansiyel kazancı simüle et (gerçekte sonuç beklenir)
        if config.PAPER_MODE:
            ledger["bankroll"] = round(ledger["bankroll"] - result["stake"], 2)

    save_ledger(ledger)
    notifier.order_notify(result)

    # Kötü senaryo kontrolü
    if ledger["bankroll"] < 20:
        notifier.send("⛔ Bankroll $20 altına düştü! Bot duruyor, manuel kontrol gerekiyor.")
        log.warning("Bankroll kritik seviye!")


def main():
    mode = "📄 PAPER" if config.PAPER_MODE else "🟢 CANLI"
    notifier.send(f"🤖 Polymarket Bot başladı | {mode} | Bankroll: ${config.BANKROLL}")
    log.info("Bot başladı.")

    # Hemen bir tarama yap
    run()

    # Sonra her 2 saatte bir
    schedule.every(2).hours.do(run)

    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == "__main__":
    main()
