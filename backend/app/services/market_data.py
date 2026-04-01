"""
Wrapper yfinance — récupère les prix historiques d'un ticker.
- Session avec User-Agent navigateur pour éviter le rate limiting Yahoo Finance
- Retry automatique (3 tentatives, backoff exponentiel)
"""
import time
from typing import List, Optional

import requests
import yfinance as yf


class RateLimitError(Exception):
    pass


# Session persistante — les cookies Yahoo Finance sont réutilisés entre les appels
_session = requests.Session()
_session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
})


def fetch_prices(
    ticker: str, period: str = "1y", interval: str = "1d"
) -> Optional[List[dict]]:
    last_exc = None

    for attempt in range(3):
        try:
            df = yf.Ticker(ticker, session=_session).history(
                period=period, interval=interval
            )
            if df.empty:
                return None

            return [
                {
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                }
                for date, row in df.iterrows()
            ]

        except Exception as e:
            is_rate_limit = (
                "Too Many Requests" in str(e)
                or "RateLimit" in type(e).__name__
                or "429" in str(e)
            )
            if is_rate_limit:
                last_exc = e
                if attempt < 2:
                    time.sleep(2 ** attempt)  # 1s puis 2s
                    continue
                raise RateLimitError() from last_exc
            return None

    return None
