// Carousel.tsx
import { useEffect, useState } from "react";
import {
  Brain,
  Zap,
  FileText,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sliding_Carousel() {
  const [current, setCurrent] = useState(0);
  const total = 4;

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const prevSlide = () => setCurrent((c) => (c - 1 + total) % total);
  const nextSlide = () => setCurrent((c) => (c + 1) % total);

  return (
    <section className="feature-carousel">
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {/* CARD 1 */}
          <div className="feature-card c0">
            <div className="card-glow"></div>

            <div className="card-content">
              <Brain className="feature-icon" />
              <h2>Chat with your Notes</h2>
              <p>
                Ask questions naturally and receive answers grounded in your
                uploaded notes.
              </p>
              <div className="feature-pills">
                <span>Context</span>
                <span>Sources</span>
                <span>Instant</span>
              </div>
              <div className="card-preview">
                <div className="preview-window">
                  <div className="preview-top">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="preview-sidebar">
                    <div className="sidebar-item active">Algorithms.pdf</div>
                    <div className="sidebar-item">OS Notes</div>
                    <div className="sidebar-item">React Handbook</div>
                  </div>
                  <div className="preview-chat-area">
                    <div className="chat user">Summarize binary search.</div>
                    <div className="chat ai">
                      Binary search halves the search space every comparison.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="feature-card c1">
            <div className="card-glow"></div>

            <div className="card-content">
              <Zap className="feature-icon" />
              <h2>Generate Flashcards</h2>
              <p>Turn notes into revision-ready flashcards in seconds.</p>
              <div className="feature-pills">
                <span>AI</span>
                <span>Anki</span>
                <span>1 Click</span>
              </div>
              <div className="card-preview">
                <div className="flashcards-preview">
                  <div className="flashcard back"></div>
                  <div className="flashcard middle"></div>
                  <div className="flashcard front">
                    <span className="flashcard-label">Question</span>
                    <h5>What is Binary Search?</h5>
                    <div className="flash-divider"></div>
                    <p>Tap to Reveal Answer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="feature-card c2">
            <div className="card-glow"></div>

            <div className="card-content">
              <FileText className="feature-icon" />
              <h2>Upload Once. Learn Everywhere.</h2>
              <p>
                Index PDFs, DOCX, PPTX and Markdown into one knowledge base.
              </p>
              <div className="feature-pills">
                <span>PDF</span>
                <span>DOCX</span>
                <span>PPTX</span>
                <span>MD</span>
              </div>
              <div className="card-preview">
                <div className="upload-preview">
                  <div className="upload-box"></div>
                  <div className="upload-progress full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="feature-card c3">
            <div className="card-glow"></div>

            <div className="card-content">
              <Target className="feature-icon" />
              <h2>Smart Quiz Mode</h2>
              <p>Practice with quizzes generated directly from your notes.</p>
              <div className="feature-pills">
                <span>MCQ</span>
                <span>T/F</span>
                <span>Tracking</span>
              </div>
              <div className="card-preview">
                <div className="quiz-preview">
                  <div className="quiz-title">Question 4 / 10</div>
                  <div className="quiz-question">
                    Time complexity of Binary Search?
                  </div>
                  <div className="quiz-option">A. O(n²)</div>
                  <div className="quiz-option active">B. ✓ O(log n)</div>
                  <div className="quiz-option">C. O(n)</div>
                  <div className="quiz-score">Score 9/10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={prevSlide}>
          <ChevronLeft size={20} />
        </button>

        <div className="carousel-dots">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              className={`dot ${current === i ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <button className="carousel-arrow" onClick={nextSlide}>
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
