"""
TDD — Routes /watchlist
Tests écrits avant l'implémentation.
"""


def test_get_default_watchlist_status(client):
    """GET /watchlist/default doit retourner 200."""
    response = client.get("/watchlist/default")
    assert response.status_code == 200


def test_get_default_watchlist_structure(client):
    """La réponse doit contenir une clé 'assets' avec une liste non vide."""
    response = client.get("/watchlist/default")
    data = response.json()
    assert "assets" in data
    assert isinstance(data["assets"], list)
    assert len(data["assets"]) > 0


def test_watchlist_asset_a_les_bons_champs(client):
    """Chaque asset doit avoir ticker, name et type."""
    response = client.get("/watchlist/default")
    for asset in response.json()["assets"]:
        assert "ticker" in asset
        assert "name" in asset
        assert "type" in asset


def test_watchlist_type_valide(client):
    """Le champ type doit être 'stock' ou 'crypto'."""
    response = client.get("/watchlist/default")
    for asset in response.json()["assets"]:
        assert asset["type"] in ("stock", "crypto")


def test_watchlist_contient_actions(client):
    """La watchlist doit contenir des actions (AAPL, TSLA)."""
    response = client.get("/watchlist/default")
    tickers = [a["ticker"] for a in response.json()["assets"]]
    assert "AAPL" in tickers
    assert "TSLA" in tickers


def test_watchlist_contient_crypto(client):
    """La watchlist doit contenir des cryptos (BTC-USD, ETH-USD)."""
    response = client.get("/watchlist/default")
    tickers = [a["ticker"] for a in response.json()["assets"]]
    assert "BTC-USD" in tickers
    assert "ETH-USD" in tickers
