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

const PERIOD_INTERVAL = {
  "5d":  "1h",
  "1mo": "1h",
  "3mo": "1d",
  "1y":  "1d",
}

export const getPrices = (ticker, period = "1y") => {
  const interval = PERIOD_INTERVAL[period] ?? "1d"
  return api(`/prices/${ticker}?period=${period}&interval=${interval}`)
}

export const getIndicators = (ticker, type = "rsi") =>
  api(`/indicators/${ticker}?type=${type}`)

export const getWatchlist = () => api("/watchlist/default")
