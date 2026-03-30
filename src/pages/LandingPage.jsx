import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  function handleApplyClick() {
    navigate('/apply');
  }

  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-heading">Welcome to HireHub</h1>
        <p className="hero-subheading">
          Join a company that values innovation, collaboration, and personal growth.
          Discover a culture where your ideas matter and your career thrives.
        </p>
        <button className="btn btn-primary hero-cta" onClick={handleApplyClick}>
          Express Your Interest
        </button>
      </section>

      <section className="features-section">
        <h2 className="features-heading">Why Join Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-card-title">Innovation</h3>
            <p className="feature-card-description">
              Work on cutting-edge projects that push boundaries and shape the future of technology.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Career Growth</h3>
            <p className="feature-card-description">
              Access mentorship programs, learning opportunities, and clear paths for advancement.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Great Culture</h3>
            <p className="feature-card-description">
              Be part of a diverse, inclusive team that celebrates collaboration and creativity.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-card-title">Global Impact</h3>
            <p className="feature-card-description">
              Contribute to solutions that make a difference for communities around the world.
            </p>
          </div>
        </div>
      </section>

      <section className="bottom-cta-section">
        <h2 className="bottom-cta-heading">Ready to Start Your Journey?</h2>
        <p className="bottom-cta-subheading">
          Take the first step toward an exciting career with HireHub.
        </p>
        <button className="btn btn-primary bottom-cta" onClick={handleApplyClick}>
          Apply Now
        </button>
      </section>
    </div>
  );
}