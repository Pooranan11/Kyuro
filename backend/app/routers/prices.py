"""
GET /prices/{ticker} — Prix historiques avec cache Redis.
Format de réponse : {ticker, period, data, cached, timestamp}
"""
import re
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app import cache
from app.services.market_data import RateLimitError, fetch_prices

router = APIRouter()

# Accepte les tickers actions (1-5 lettres) et crypto (ex: BTC-USD)
TICKER_PATTERN = re.compile(r"^[A-Z]{1,5}(-USD)?$")


@router.get("/{ticker}")
async def get_prices(ticker: str, period: str = "1y", interval: str = "1d"):
    ticker = ticker.upper()

    if not TICKER_PATTERN.match(ticker):
        raise HTTPException(
            status_code=400, detail=f"Invalid ticker format: {ticker}"
        )

    cache_key = f"prices:{ticker}:{period}:{interval}"
    cached_data = cache.get_cache(cache_key)

    if cached_data is not None:
        return {
            "ticker": ticker,
            "period": period,
            "data": cached_data,
            "cached": True,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    try:
        data = fetch_prices(ticker, period, interval)
    except RateLimitError:
        raise HTTPException(status_code=503, detail="Market data unavailable, try again later")

    if data is None:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")

    cache.set_cache(cache_key, data, ttl=3600)

    return {
        "ticker": ticker,
        "period": period,
        "data": data,
        "cached": False,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
