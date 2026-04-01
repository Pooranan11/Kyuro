// fetch natif uniquement — pas d'Axios
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function api(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  return res.json()
}

export const getPrices = (ticker, period = "1y") =>
  api(`/prices/${ticker}?period=${period}`)

export const getIndicators = (ticker, type = "rsi") =>
  api(`/indicators/${ticker}?type=${type}`)

export const getWatchlist = () => api("/watchlist/default")
