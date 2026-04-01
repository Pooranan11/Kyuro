"""
Cache Redis avec fallback in-memory pour les tests/dev sans Redis.
Clé format : prices:{ticker}:{period}:{interval}
"""
import json
import os
from typing import Any, Optional

_memory_cache: dict = {}


def _get_redis():
    try:
        import redis as redis_lib

        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        r = redis_lib.from_url(redis_url, socket_connect_timeout=1)
        r.ping()
        return r
    except Exception:
        return None


def get_cache(key: str) -> Optional[Any]:
    r = _get_redis()
    if r:
        val = r.get(key)
        return json.loads(val) if val else None
    return _memory_cache.get(key)


def set_cache(key: str, value: Any, ttl: int = 3600) -> None:
    r = _get_redis()
    if r:
        r.setex(key, ttl, json.dumps(value))
    else:
        _memory_cache[key] = value
