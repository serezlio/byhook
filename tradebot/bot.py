"""
By Hook — Yarı Otomatik Trade Bot
TradingView Webhook → Telegram Sinyal

Akış:
  Pine Script alert → POST /webhook → Telegram mesajı → Sen manuel emir
"""

import os
import json
import asyncio
from datetime import datetime
from flask import Flask, request, jsonify
import requests

# ── AYARLAR ──
TELEGRAM_TOKEN  = os.getenv("TELEGRAM_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "1021566586")
WEBHOOK_SECRET  = os.getenv("WEBHOOK_SECRET", "byhook2026")

app = Flask(__name__)

# ── TELEGRAM GÖNDER ──
def send_telegram(msg: str, parse_mode: str = "HTML") -> bool:
    if not TELEGRAM_TOKEN:
        print(f"[BOT] Telegram token yok — mesaj: {msg}")
        return False
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    resp = requests.post(url, json={
        "chat_id": TELEGRAM_CHAT_ID,
        "text": msg,
        "parse_mode": parse_mode,
        "disable_notification": False
    }, timeout=10)
    return resp.ok

# ── SİNYAL FORMATLA ──
def format_signal(data: dict) -> str:
    """TradingView webhook payload'ını Telegram mesajına çevirir."""
    action   = data.get("action", "").upper()      # BUY / SELL
    symbol   = data.get("symbol", "?")
    price    = data.get("price", "?")
    tf       = data.get("timeframe", "15")
    reason   = data.get("reason", "")
    sr_near  = data.get("sr_near", "")
    atr_val  = data.get("atr", "")

    now = datetime.now().strftime("%H:%M:%S")

    if action == "BUY":
        emoji = "🟢"
        action_tr = "LONG GİRİŞ"
    elif action == "SELL":
        emoji = "🔴"
        action_tr = "SHORT GİRİŞ"
    elif action == "CLOSE":
        emoji = "⚪"
        action_tr = "POZİSYON KAPAT"
    else:
        emoji = "📊"
        action_tr = action

    lines = [
        f"{emoji} <b>BY HOOK — {action_tr}</b>",
        f"━━━━━━━━━━━━━━━━━━━━",
        f"📌 Sembol : <b>{symbol}</b>",
        f"⏰ Zaman  : {now} | TF: {tf}dk",
        f"💲 Fiyat  : <b>{price}</b>",
    ]
    if sr_near:
        lines.append(f"📐 S/R    : {sr_near}")
    if atr_val:
        lines.append(f"📉 ATR    : {atr_val}")
    if reason:
        lines.append(f"💡 Neden  : {reason}")

    lines += [
        f"━━━━━━━━━━━━━━━━━━━━",
        f"⚡ <i>Manuel emir ver — A1 Capital</i>",
    ]
    return "\n".join(lines)

# ── WEBHOOK ENDPOINT ──
@app.route("/webhook", methods=["POST"])
def webhook():
    # Güvenlik: secret kontrolü
    secret = request.args.get("secret") or request.headers.get("X-Secret", "")
    if secret != WEBHOOK_SECRET:
        return jsonify({"error": "unauthorized"}), 401

    try:
        # TradingView JSON veya plain text gönderebilir
        if request.is_json:
            data = request.get_json()
        else:
            # Plain text → JSON parse dene
            raw = request.data.decode("utf-8")
            try:
                data = json.loads(raw)
            except Exception:
                # Ham metin olarak ilet
                data = {"action": "INFO", "symbol": raw, "price": "—"}
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    msg = format_signal(data)
    ok  = send_telegram(msg)

    print(f"[WEBHOOK] {data.get('symbol')} {data.get('action')} → Telegram: {'✅' if ok else '❌'}")
    return jsonify({"status": "ok", "telegram": ok})

# ── SAĞLIK KONTROLÜ ──
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "bot": "By Hook Trade Bot",
        "time": datetime.now().isoformat()
    })

# ── TEST MESAJI ──
@app.route("/test", methods=["GET"])
def test_msg():
    secret = request.args.get("secret", "")
    if secret != WEBHOOK_SECRET:
        return jsonify({"error": "unauthorized"}), 401
    test_data = {
        "action": "BUY",
        "symbol": "THYAO",
        "price": "42.50",
        "timeframe": "15",
        "reason": "Destek bounce + ST AL",
        "sr_near": "D:41.80 → R:44.20",
        "atr": "0.85"
    }
    msg = format_signal(test_data)
    ok  = send_telegram(msg)
    return jsonify({"sent": ok, "message": msg})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5050))
    print(f"[BOT] By Hook Trade Bot başlatıldı → port {port}")
    print(f"[BOT] Webhook: POST /webhook?secret={WEBHOOK_SECRET}")
    app.run(host="0.0.0.0", port=port, debug=False)
