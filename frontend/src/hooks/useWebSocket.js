import { useEffect, useRef, useState } from "react"

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000"

export function useWebSocket(ticker) {
  const [price, setPrice] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    if (!ticker) return

    function connect() {
      ws.current = new WebSocket(`${WS_URL}/live/${ticker}`)
      ws.current.onmessage = (e) => setPrice(JSON.parse(e.data))
      ws.current.onclose = () => setTimeout(connect, 3000) // reconnexion auto
    }

    connect()
    return () => ws.current?.close()
  }, [ticker])

  return price
}
