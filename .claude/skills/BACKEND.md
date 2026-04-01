# Kyuro — Backend (FastAPI)

## Stack
- Python 3.12+
- FastAPI + Uvicorn
- SQLAlchemy + Alembic
- yfinance (données marché)
- pandas + pandas-ta (indicateurs techniques)
- redis (cache)
- python-dotenv (config)

## Conventions

### Structure des routes
Toutes les routes suivent ce pattern :

```python
@router.get("/{ticker}")
async def get_prices(
    ticker: str,
    period: str = "1y",
    interval: str = "1d"
):
    # 1. Vérifier le cache Redis
    # 2. Si cache miss → appeler yfinance
    # 3. Stocker en cache
    # 4. Retourner les données
```

### Format de réponse uniforme
Toujours retourner ce format :

```json
{
  "ticker": "AAPL",
  "period": "1y",
  "data": [...],
  "cached": true,
  "timestamp": "2026-01-01T00:00:00Z"
}
```

### Gestion des erreurs
Toujours utiliser HTTPException avec des messages clairs :

```python
raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found")
raise HTTPException(status_code=503, detail="Market data unavailable")
```

### Cache Redis
- TTL prix historique : 3600s (1h)
- TTL prix live : 60s
- TTL indicateurs : 1800s (30min)
- Clé format : `prices:{ticker}:{period}:{interval}`

### WebSocket live
Pattern de reconnexion côté serveur :

```python
@app.websocket("/live/{ticker}")
async def live_price(ws: WebSocket, ticker: str):
    await ws.accept()
    try:
        while True:
            price = await fetch_current_price(ticker)
            await ws.send_json({"ticker": ticker, "price": price})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
```

### Indicateurs techniques
Toujours calculer via pandas-ta, jamais à la main :

```python
import pandas_ta as ta

df.ta.rsi(length=14, append=True)
df.ta.macd(append=True)
df.ta.sma(length=20, append=True)
```

## Variables d'environnement (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/kyuro
REDIS_URL=redis://localhost:6379
ENVIRONMENT=development
```

## Commandes utiles
```bash
# Lancer le serveur dev
uvicorn app.main:app --reload --port 8000

# Créer une migration
alembic revision --autogenerate -m "description"

# Appliquer les migrations
alembic upgrade head
```
