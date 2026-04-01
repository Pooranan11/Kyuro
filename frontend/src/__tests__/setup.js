import "@testing-library/jest-dom"

// Recharts utilise ResizeObserver — jsdom ne l'implémente pas
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
