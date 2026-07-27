import { Link } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";

function CallToAction() {
  return (
    <section className="cta-section">
      <div className="cta-card">
        <p className="cta-tag">Ready to begin?</p>

        <h2>
          Start studying smarter with <span>ACE</span>.
        </h2>

        <p className="cta-description">
          Upload your notes once and let ACE transform them into chats,
          flashcards, quizzes, and an organized study workspace—all powered by
          AI.
        </p>

        <div className="cta-buttons">
          <Link to={ROUTES.CHAT} className="primary-btn">
            Get Started
          </Link>

          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
