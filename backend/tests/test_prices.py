"""
TDD — Routes /prices
Tests écrits avant l'implémentation.
"""

MOCK_DATA = [
    {"date": "2024-01-01", "open": 150.0, "high": 155.0, "low": 149.0, "close": 153.0, "volume": 1000000},
    {"date": "2024-01-02", "open": 151.0, "high": 156.0, "low": 150.0, "close": 154.0, "volume": 1100000},
]


# ---------------------------------------------------------------------------
# Format de réponse
# ---------------------------------------------------------------------------

def test_get_prices_format_complet(client, mocker):
    """La réponse doit contenir ticker, period, data, cached, timestamp."""
    mocker.patch("app.routers.prices.cache.get_cache", return_value=None)
    mocker.patch("app.routers.prices.fetch_prices", return_value=MOCK_DATA)
    mocker.patch("app.routers.prices.cache.set_cache", return_value=None)

    response = client.get("/prices/AAPL")
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "AAPL"
    assert data["period"] == "1y"
    assert data["data"] == MOCK_DATA
    assert data["cached"] is False
    assert "timestamp" in data


def test_get_prices_cache_hit(client, mocker):
    """Si le cache répond, cached doit être True et fetch_prices pas appelé."""
    mocker.patch("app.routers.prices.cache.get_cache", return_value=MOCK_DATA)
    mock_fetch = mocker.patch("app.routers.prices.fetch_prices")

    response = client.get("/prices/AAPL")
    assert response.status_code == 200
    assert response.json()["cached"] is True
    mock_fetch.assert_not_called()


def test_get_prices_period_custom(client, mocker):
    """Le paramètre period est bien transmis dans la réponse."""
    mocker.patch("app.routers.prices.cache.get_cache", return_value=None)
    mocker.patch("app.routers.prices.fetch_prices", return_value=MOCK_DATA)
    mocker.patch("app.routers.prices.cache.set_cache", return_value=None)

    response = client.get("/prices/AAPL?period=1mo")
    assert response.status_code == 200
    assert response.json()["period"] == "1mo"


# ---------------------------------------------------------------------------
# Validation du ticker
# ---------------------------------------------------------------------------

def test_get_prices_ticker_avec_chiffres_rejete(client):
    """Un ticker contenant des chiffres doit retourner 400."""
    response = client.get("/prices/AAPL1")
    assert response.status_code == 400
    assert "Invalid ticker" in response.json()["detail"]


def test_get_prices_ticker_trop_long_rejete(client):
    """Un ticker de plus de 5 caractères (sans -USD) doit retourner 400."""
    response = client.get("/prices/TOOLONG")
    assert response.status_code == 400


def test_get_prices_ticker_vide_rejete(client):
    """Un ticker vide doit retourner 404 (route non matchée)."""
    response = client.get("/prices/")
    assert response.status_code == 404


def test_get_prices_crypto_valide(client, mocker):
    """BTC-USD doit être accepté (format [A-Z]{1,5}-USD)."""
    mocker.patch("app.routers.prices.cache.get_cache", return_value=None)
    mocker.patch("app.routers.prices.fetch_prices", return_value=MOCK_DATA)
    mocker.patch("app.routers.prices.cache.set_cache", return_value=None)

    response = client.get("/prices/BTC-USD")
    assert response.status_code == 200
    assert response.json()["ticker"] == "BTC-USD"


# ---------------------------------------------------------------------------
# Ticker inconnu
# ---------------------------------------------------------------------------

def test_get_prices_ticker_inconnu_retourne_404(client, mocker):
    """Si yfinance ne trouve pas le ticker, retourner 404."""
    mocker.patch("app.routers.prices.cache.get_cache", return_value=None)
    mocker.patch("app.routers.prices.fetch_prices", return_value=None)

    response = client.get("/prices/XYZQ")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
