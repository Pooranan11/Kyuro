import { useEffect, useState } from "react"
import Chart from "../components/Chart"
import Sidebar from "../components/Sidebar"
import { getPrices, getWatchlist } from "../api/client"
import "./Dashboard.css"

const PERIODS = [
  { label: "1S", value: "5d" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "1A", value: "1y" },
]

const DEFAULT_ASSETS = [
  { ticker: "AAPL", name: "Apple", type: "stock" },
  { ticker: "MSFT", name: "Microsoft", type: "stock" },
  { ticker: "GOOGL", name: "Alphabet", type: "stock" },
  { ticker: "TSLA", name: "Tesla", type: "stock" },
  { ticker: "AMZN", name: "Amazon", type: "stock" },
  { ticker: "BTC-USD", name: "Bitcoin", type: "crypto" },
  { ticker: "ETH-USD", name: "Ethereum", type: "crypto" },
  { ticker: "BNB-USD", name: "BNB", type: "crypto" },
]

export default function Dashboard() {
  const [assets, setAssets] = useState(DEFAULT_ASSETS)
  const [activeTicker, setActiveTicker] = useState(DEFAULT_ASSETS[0].ticker)
  const [priceData, setPriceData] = useState([])
  const [period, setPeriod] = useState("1y")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getWatchlist()
      .then((data) => {
        setAssets(data.assets)
        if (data.assets.length > 0) setActiveTicker(data.assets[0].ticker)
      })
      .catch(() => {/* backend indisponible — fallback DEFAULT_ASSETS déjà en place */})
  }, [])

  useEffect(() => {
    if (!activeTicker) return
    setLoading(true)
    const timer = setTimeout(() => {
      setError(null)
      getPrices(activeTicker, period)
        .then((data) => { setPriceData(data.data); setError(null) })
        .catch((err) => {
          setPriceData([])
          setError(err.message.includes("503") ? "rate_limit" : "error")
        })
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [activeTicker, period])

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar" role="complementary">
        <Sidebar
          assets={assets}
          onSelect={setActiveTicker}
          activeTicker={activeTicker}
        />
      </aside>

      <main className="dashboard-main" role="main">
        <div className="dashboard-header">
          <span className="dashboard-ticker" data-testid="active-ticker">{activeTicker}</span>
          <div className="period-selector">
            {PERIODS.map(({ label, value }) => (
              <button
                key={value}
                className={`period-btn ${period === value ? "active" : ""}`}
                onClick={() => setPeriod(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">Chargement...</div>
        ) : error === "rate_limit" ? (
          <div className="dashboard-error">
            Yahoo Finance est temporairement indisponible (rate limit).
            <button onClick={() => { setError(null); setLoading(true) }}>Réessayer</button>
          </div>
        ) : (
          <Chart data={priceData} />
        )}
      </main>
    </div>
  )
}
