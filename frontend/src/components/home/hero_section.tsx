import React from "react";
import { Sparkles, Bot, CornerDownLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";
function Hero_Section() {
  return (
    <section className="layout">
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT */}
          <div className="col-lg-6 hero-content">
            <h6 className="hero-badge">✨ Your AI Knowledge Workspace</h6>

            <h1 className="hero-title">Turn your documents into knowledge.</h1>

            <p className="hero-description">
              Stop searching through folders. Chat with your documents, generate
              flashcards, and test your understanding— all in one workspace.
            </p>

            <Link to={ROUTES.CHAT} className="hero-btn">
              Get Started <span>→</span>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="col-lg-6">
            <div className="relative w-full mx-auto hero-preview">
              {/* Background glow */}
              <div className="absolute hero-glow-1"></div>
              <div className="absolute hero-glow-2"></div>

              {/* Main card */}
              <div className="hero-chat-card">
                {/* Header */}
                <div className="hero-chat-header">
                  <div className="hero-chat-logo">
                    <Sparkles size={16} />
                  </div>

                  <div>
                    <div className="hero-chat-title">ACE Workspace</div>

                    <div className="hero-chat-status">
                      <span className="status-dot"></span>
                      Ready
                    </div>
                  </div>
                </div>

                {/* Conversation */}
                <div className="hero-chat-body">
                  {/* User */}
                  <div className="hero-user-message">
                    Summarize binary search in simple terms.
                  </div>

                  {/* AI */}
                  <div className="hero-ai-row">
                    <div className="hero-ai-avatar">
                      <Bot size={14} />
                    </div>

                    <div className="hero-ai-message">
                      Binary search repeatedly halves the search space, reducing
                      the time complexity from
                      <strong> O(n)</strong> to
                      <strong> O(log n)</strong>.
                    </div>
                  </div>
                </div>

                {/* Fake input */}
                <div className="hero-chat-input">
                  <div className="hero-input-placeholder">
                    Ask your notes anything...
                  </div>

                  <div className="hero-input-actions">
                    <span className="hero-enter">
                      <CornerDownLeft size={10} />
                      Enter
                    </span>

                    <div className="hero-send">
                      <Send size={13} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero_Section;
