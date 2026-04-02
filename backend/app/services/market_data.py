"""
Wrapper yfinance — récupère les prix historiques d'un ticker.
- Retry automatique (3 tentatives, backoff exponentiel)
"""
import time
from typing import List, Optional

import yfinance as yf


class RateLimitError(Exception):
    pass


def fetch_prices(
    ticker: str, period: str = "1y", interval: str = "1d"
) -> Optional[List[dict]]:
    last_exc = None

    for attempt in range(3):
        try:
            df = yf.Ticker(ticker).history(period=period, interval=interval)
            if df.empty:
                return None

            date_fmt = "%Y-%m-%d %H:%M:%S" if interval != "1d" else "%Y-%m-%d"

            return [
                {
                    "date": date.strftime(date_fmt),
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
                    time.sleep(2 ** attempt)
                    continue
                raise RateLimitError() from last_exc
            return None

    return None
