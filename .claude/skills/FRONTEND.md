# Kyuro — Frontend (React + Vite)

## Stack
- React 19 + Vite
- Recharts (graphes)
- fetch natif (pas d'Axios, jamais)
- CSS vanilla (pas de UI lib pour l'instant)

## Conventions

### Client API — fetch natif uniquement
Toujours utiliser ce wrapper, jamais installer Axios :

```javascript
// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function api(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  return res.json()
}

export const getPrices = (ticker, period = '1y') =>
  api(`/prices/${ticker}?period=${period}`)

export const getIndicators = (ticker, type = 'rsi') =>
  api(`/indicators/${ticker}?type=${type}`)

export const getWatchlist = () => api('/watchlist')
```

### Hook WebSocket avec reconnexion auto

```javascript
// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react'

export function useWebSocket(ticker) {
  const [price, setPrice] = useState(null)
  const ws = useRef(null)

  useEffect(() => {
    function connect() {
      ws.current = new WebSocket(`ws://localhost:8000/live/${ticker}`)
      ws.current.onmessage = (e) => setPrice(JSON.parse(e.data))
      ws.current.onclose = () => setTimeout(connect, 3000) // reconnexion auto
    }
    connect()
    return () => ws.current?.close()
  }, [ticker])

  return price
}
```

### Structure des composants
Chaque composant dans son propre dossier :

```
components/
└── Chart/
    ├── Chart.jsx       # Composant principal
    ├── Chart.css       # Styles isolés
    └── index.js        # Export
```

### Conventions de nommage
- Composants : PascalCase (Chart, Watchlist)
- Hooks : camelCase préfixé use (useMarketData, useWebSocket)
- Fichiers CSS : même nom que le composant (Chart.css)
- Variables : camelCase
- Constantes : UPPER_SNAKE_CASE

### Recharts — pattern de base

```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function Chart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#6366f1" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### Variables d'environnement (.env)
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Commandes utiles
```bash
# Lancer le dev server
npm run dev

# Build production
npm run build
```
