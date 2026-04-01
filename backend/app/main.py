from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import prices, watchlist

app = FastAPI(title="Kyuro API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(prices.router, prefix="/prices", tags=["prices"])
app.include_router(watchlist.router, prefix="/watchlist", tags=["watchlist"])
