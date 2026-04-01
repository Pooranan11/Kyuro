# Kyuro — Architecture

## Vision
Kyuro est une app de suivi de courbes financières premium.
Stack : FastAPI (Python) + React (Vite) + PostgreSQL + Redis.

## Structure du projet

```
kyuro/
├── backend/
│   ├── app/
│   │   ├── main.py               # Point d'entrée FastAPI
│   │   ├── routers/
│   │   │   ├── prices.py         # GET /prices/{ticker}
│   │   │   ├── indicators.py     # GET /indicators/{ticker}
│   │   │   ├── watchlist.py      # CRUD watchlist
│   │   │   └── portfolio.py      # CRUD portfolio
│   │   ├── services/
│   │   │   ├── market_data.py    # Wrapper yfinance
│   │   │   └── indicators.py     # Calcul RSI, MACD, SMA via pandas-ta
│   │   ├── cache.py              # Redis TTL management
│   │   ├── database.py           # SQLAlchemy session
│   │   └── models.py             # ORM models
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # fetch natif, pas d'Axios
│   │   ├── components/
│   │   │   ├── Chart/            # Composant graphe principal
│   │   │   ├── Watchlist/        # Liste des actifs suivis
│   │   │   └── Portfolio/        # Vue P&L et allocation
│   │   ├── hooks/
│   │   │   ├── useMarketData.js  # Fetch prix historiques
│   │   │   └── useWebSocket.js   # Prix live avec reconnexion auto
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── WatchlistPage.jsx
│   │       └── PortfolioPage.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .claude/
    └── skills/
        ├── ARCHITECTURE.md   (ce fichier)
        ├── BACKEND.md
        ├── FRONTEND.md
        └── SECURITY.md
```

## Flux de données

```
React → GET /prices/{ticker}?period=1y → FastAPI → Redis (cache hit?)
                                                  → yfinance (cache miss)
                                                  → PostgreSQL (watchlist/portfolio)
React → WS /live/{ticker} → FastAPI WebSocket → yfinance polling 5s
```

## Base de données

### Tables PostgreSQL
- `watchlist` : id, user_id, ticker, added_at
- `portfolio` : id, user_id, ticker, quantity, buy_price, buy_date
- `price_cache` : ticker, data (JSON), cached_at (backup Redis)

## Cache Redis
- Prix historique : TTL 1h
- Prix live : TTL 60s
- Indicateurs calculés : TTL 30min
