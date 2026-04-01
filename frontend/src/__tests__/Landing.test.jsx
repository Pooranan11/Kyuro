import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Landing from "../pages/Landing"

describe("Landing", () => {
  it("affiche le titre Kyuro", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    expect(screen.getByText(/kyuro/i)).toBeInTheDocument()
  })

  it("affiche la tagline", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    expect(screen.getByText(/marchés|courbes|actifs/i)).toBeInTheDocument()
  })

  it("contient un lien vers /dashboard", () => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    const link = screen.getByRole("link", { name: /dashboard|commencer|accéder/i })
    expect(link).toHaveAttribute("href", "/dashboard")
  })
})
