"""
Watchlist par défaut — hardcodée pour le mode "use and go" (pas d'auth).
"""
from fastapi import APIRouter

router = APIRouter()

DEFAULT_ASSETS = [
    {"ticker": "AAPL", "name": "Apple", "type": "stock"},
    {"ticker": "MSFT", "name": "Microsoft", "type": "stock"},
    {"ticker": "GOOGL", "name": "Alphabet", "type": "stock"},
    {"ticker": "TSLA", "name": "Tesla", "type": "stock"},
    {"ticker": "AMZN", "name": "Amazon", "type": "stock"},
    {"ticker": "BTC-USD", "name": "Bitcoin", "type": "crypto"},
    {"ticker": "ETH-USD", "name": "Ethereum", "type": "crypto"},
    {"ticker": "BNB-USD", "name": "BNB", "type": "crypto"},
]


@router.get("/default")
async def get_default_watchlist():
    return {"assets": DEFAULT_ASSETS}
