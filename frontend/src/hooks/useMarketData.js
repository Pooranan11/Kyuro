import { useEffect, useState } from "react"
import { getPrices } from "../api/client"

export function useMarketData(ticker, period = "1y") {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!ticker) return
    setLoading(true)
    setError(null)
    getPrices(ticker, period)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [ticker, period])

  return { data, loading, error }
}
