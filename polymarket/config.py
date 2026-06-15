import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Polymarket
POLYMARKET_PRIVATE_KEY = os.getenv("POLYMARKET_PRIVATE_KEY", "")
POLYMARKET_API_KEY     = os.getenv("POLYMARKET_API_KEY", "")
POLYMARKET_SECRET      = os.getenv("POLYMARKET_SECRET", "")
POLYMARKET_PASSPHRASE  = os.getenv("POLYMARKET_PASSPHRASE", "")
CLOB_HOST              = "https://clob.polymarket.com"
GAMMA_HOST             = "https://gamma-api.polymarket.com"

# Telegram
TELEGRAM_TOKEN   = os.getenv("TELEGRAM_TOKEN", "8997947154:AAGYl3AxGLLYp0rrQOavt-wBlrRT0hzKoOo")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "1021566586")

# Strateji parametreleri
BANKROLL          = float(os.getenv("POLY_BANKROLL", "50"))
MAX_POSITION_PCT  = 0.40   # tek pozisyona max %40
MIN_ODDS          = 0.60   # min %60 olasılık
MAX_ODDS          = 0.97   # max %97 (çok kesin olanları da dahil et)
MIN_LIQUIDITY     = 5_000  # min $5k likidite
PAPER_MODE        = os.getenv("POLY_PAPER", "true").lower() == "true"
