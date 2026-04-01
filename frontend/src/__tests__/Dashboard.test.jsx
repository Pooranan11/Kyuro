import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Dashboard from "../pages/Dashboard"

// Mock du Chart pour éviter les problèmes de canvas/Recharts en jsdom
vi.mock("../components/Chart", () => ({
  default: ({ data }) => (
    <div data-testid="chart">{data?.length ?? 0} points</div>
  ),
}))

const MOCK_ASSETS = [
  { ticker: "AAPL", name: "Apple", type: "stock" },
  { ticker: "BTC-USD", name: "Bitcoin", type: "crypto" },
]

const MOCK_PRICES = {
  ticker: "AAPL",
  period: "1y",
  data: [{ date: "2024-01-01", open: 150, high: 155, low: 149, close: 153, volume: 1000000 }],
  cached: false,
  timestamp: "2024-01-01T00:00:00Z",
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url) => {
      if (url.includes("/watchlist/default")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ assets: MOCK_ASSETS }),
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => MOCK_PRICES,
      })
    })
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Dashboard", () => {
  it("affiche la sidebar et la zone principale", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
    expect(await screen.findByText("Apple")).toBeInTheDocument()
    expect(screen.getByRole("complementary")).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
  })

  it("affiche le ticker actif par défaut (premier de la liste)", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
    expect(await screen.findByTestId("active-ticker")).toHaveTextContent("AAPL")
  })

  it("sélectionner un asset met à jour le ticker affiché", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
    await screen.findByText("Apple")
    await user.click(screen.getByText("Bitcoin"))
    expect(await screen.findByTestId("active-ticker")).toHaveTextContent("BTC-USD")
  })

  it("affiche le composant Chart", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
    expect(await screen.findByTestId("chart")).toBeInTheDocument()
  })
})
