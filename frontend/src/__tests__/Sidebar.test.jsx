import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Sidebar from "../components/Sidebar"

const MOCK_ASSETS = [
  { ticker: "AAPL", name: "Apple", type: "stock" },
  { ticker: "TSLA", name: "Tesla", type: "stock" },
  { ticker: "BTC-USD", name: "Bitcoin", type: "crypto" },
  { ticker: "ETH-USD", name: "Ethereum", type: "crypto" },
]

describe("Sidebar", () => {
  it("affiche tous les assets par défaut", () => {
    render(<Sidebar assets={MOCK_ASSETS} onSelect={() => {}} activeTicker="AAPL" />)
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("Tesla")).toBeInTheDocument()
    expect(screen.getByText("Bitcoin")).toBeInTheDocument()
    expect(screen.getByText("Ethereum")).toBeInTheDocument()
  })

  it("appelle onSelect avec le bon ticker au clic", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Sidebar assets={MOCK_ASSETS} onSelect={onSelect} activeTicker="AAPL" />)
    await user.click(screen.getByText("Tesla"))
    expect(onSelect).toHaveBeenCalledWith("TSLA")
  })

  it("filtre pour n'afficher que les actions", async () => {
    const user = userEvent.setup()
    render(<Sidebar assets={MOCK_ASSETS} onSelect={() => {}} activeTicker="AAPL" />)
    await user.click(screen.getByRole("button", { name: /actions/i }))
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("Tesla")).toBeInTheDocument()
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument()
    expect(screen.queryByText("Ethereum")).not.toBeInTheDocument()
  })

  it("filtre pour n'afficher que les cryptos", async () => {
    const user = userEvent.setup()
    render(<Sidebar assets={MOCK_ASSETS} onSelect={() => {}} activeTicker="AAPL" />)
    await user.click(screen.getByRole("button", { name: /crypto/i }))
    expect(screen.getByText("Bitcoin")).toBeInTheDocument()
    expect(screen.getByText("Ethereum")).toBeInTheDocument()
    expect(screen.queryByText("Apple")).not.toBeInTheDocument()
    expect(screen.queryByText("Tesla")).not.toBeInTheDocument()
  })

  it("marque l'asset actif avec la classe active", () => {
    render(<Sidebar assets={MOCK_ASSETS} onSelect={() => {}} activeTicker="AAPL" />)
    const appleItem = screen.getByText("Apple").closest("li")
    expect(appleItem).toHaveClass("active")
  })
})
