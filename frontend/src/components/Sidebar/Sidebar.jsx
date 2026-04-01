import { useState } from "react"
import "./Sidebar.css"

export default function Sidebar({ assets, onSelect, activeTicker }) {
  const [filter, setFilter] = useState("all")

  const filtered =
    filter === "all" ? assets : assets.filter((a) => a.type === filter)

  return (
    <div className="sidebar">
      <div className="sidebar-brand">Kyuro</div>

      <div className="sidebar-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Tous
        </button>
        <button
          className={`filter-btn ${filter === "stock" ? "active" : ""}`}
          onClick={() => setFilter("stock")}
        >
          Actions
        </button>
        <button
          className={`filter-btn ${filter === "crypto" ? "active" : ""}`}
          onClick={() => setFilter("crypto")}
        >
          Crypto
        </button>
      </div>

      <ul className="sidebar-list">
        {filtered.map((asset) => (
          <li
            key={asset.ticker}
            className={`sidebar-item ${activeTicker === asset.ticker ? "active" : ""}`}
            onClick={() => onSelect(asset.ticker)}
          >
            <span className="asset-name">{asset.name}</span>
            <span className="asset-ticker">{asset.ticker}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
