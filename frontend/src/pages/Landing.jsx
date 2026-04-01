import { Link } from "react-router-dom"
import "./Landing.css"

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing-hero">
        <span className="landing-badge">Bêta</span>
        <h1 className="landing-logo">Kyuro</h1>
        <p className="landing-tagline">
          Suivez vos marchés en temps réel.<br />
          Actions et crypto, en un coup d'œil.
        </p>
        <Link to="/dashboard" className="landing-cta">
          Accéder au Dashboard
        </Link>
      </div>
    </main>
  )
}
