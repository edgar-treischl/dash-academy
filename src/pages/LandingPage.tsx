
import { Link } from "react-router-dom";
import { Box, Map, BookCheck, Settings, ChartColumnBig, Rocket, Lightbulb, GraphHub } from "lucide-react";
import "../styles/landing.css";



const featureLinks = [
  { label: "Explore", path: "/retention", icon: ChartColumnBig, description: "Beispiel App" },
  { label: "Learn", path: "/learning-path", icon: Map, description: "Beispiel Roadmap" },
  { label: "Connect", path: "/.", icon: GraphHub, description: "Example Button" },
  { label: "Settings", path: "/settings", icon: Settings, description: "Example Page" }
];

const benefits = [
  {
    icon: <Lightbulb />,
    number: "01 / LERNEN",
    title: "Learning by Doing",
    description: "Lernen mit echten Apps."
  },
  {
    icon: <Box />,
    number: "02 / ENTDECKEN",
    title: "Safe Sandbox",
    description: "App Inhalte in einer geschützten Umgebung entdecken."
  },
  {
    icon: <BookCheck />,
    number: "03 / ENTWICKELN",
    title: "Apps, Roadmap, Knowledge Hubs?",
    description: "Dash und Fortbildungen zur DGQE gemeinsam entwickeln."
  },
  {
    icon: <Rocket />,
    number: "04 / AUFBAUEN",
    title: "Data Literacy",
    description: "Data Literacy Skills aufbauen."
  }
];

export default function LandingPage() {
  return (
    <div className="learning-page mfe-academy-landing-page">
      <section className="mfe-academy-landing-benefits">
        <div className="mfe-academy-landing-intro">
          <p className="learning-eyebrow">Fortbildungsapp</p>

          <h1 className="mfe-academy-landing-title">
            Dash <span>Academy</span>
          </h1>

          <div className="mfe-academy-landing-note">
            <span className="mfe-academy-landing-note-icon">✓</span>
            <span>Fortbildungsinhalte für Dash.</span>
          </div>

          <div className="mfe-academy-landing-actions">
            <Link
              to="/learning-path"
              className="mfe-academy-landing-start"
            >
              Starten
            </Link>
          </div>
        </div>

        <div className="mfe-academy-landing-benefits-visual">
          {benefits.map((benefit, index) => (
            <div key={index} className="mfe-academy-landing-benefit">
              <div className="mfe-academy-landing-benefit-icon">
                {benefit.icon}
              </div>
              <div className="mfe-academy-landing-benefit-copy">
                <span className="mfe-academy-landing-benefit-number">{benefit.number}</span>
                <h2>{benefit.title}</h2>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mfe-academy-landing-features">
        <div className="mfe-academy-feature-links-grid">
          {featureLinks.map(({ label, path, icon: Icon, description }) => (
            <Link
              key={label}
              to={path}
              className="mfe-academy-feature-link-card"
            >
              <div className="mfe-academy-feature-link-icon">
                <Icon size={32} />
              </div>
              <h3 className="mfe-academy-feature-link-title">{label}</h3>
              <p className="mfe-academy-feature-link-description">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
