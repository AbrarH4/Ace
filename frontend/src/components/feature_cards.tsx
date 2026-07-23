import { Brain, Zap, FolderOpen, Target, LayoutDashboard } from "lucide-react";

function FeatureCards() {
  return (
    <section className="feature-section">
      <div className="text-center mb-5">
        <h2 className="section-title">
          Everything you need to study, finally in one place.
        </h2>

        <p className="section-subtitle">
          Upload your notes once. Chat with them, generate flashcards, test
          yourself, and stay organized—all from a single workspace.
        </p>
      </div>

      <div className="cards-container">
        {/* Card 1 */}

        <div className="card">
          <div className="card-body">
            <Brain className="card-icon" />

            <h4>Chat with Your Notes</h4>

            <p className="card-text">
              Stop scrolling through PDFs. Ask questions naturally and receive
              answers grounded directly in your uploaded documents with complete
              context.
            </p>

            <div className="feature-pills">
              <span>AI Chat</span>
              <span>Context Aware</span>
              <span>Source Grounded</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}

        <div className="card">
          <div className="card-body">
            <Zap className="card-icon" />

            <h4>Generate Flashcards</h4>

            <p className="card-text">
              Turn chapters, lecture slides, and notes into revision-ready
              flashcards in seconds. Spend less time preparing and more time
              learning.
            </p>

            <div className="feature-pills">
              <span>AI Generated</span>
              <span>Anki Ready</span>
              <span>One Click</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}

        <div className="card">
          <div className="card-body">
            <FolderOpen className="card-icon" />

            <h4>Upload Everything</h4>

            <p className="card-text">
              PDFs, Word documents, PowerPoint slides, Markdown, and text
              files—all indexed into one searchable knowledge workspace.
            </p>

            <div className="feature-pills">
              <span>PDF</span>
              <span>DOCX</span>
              <span>PPTX</span>
              <span>Markdown</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}

        <div className="card">
          <div className="card-body">
            <Target className="card-icon" />

            <h4>Smart Quiz Mode</h4>

            <p className="card-text">
              Generate personalized quizzes directly from your study material.
              Practice with instant feedback and improve your retention over
              time.
            </p>

            <div className="feature-pills">
              <span>MCQs</span>
              <span>True / False</span>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* Card 5 */}

        <div className="card">
          <div className="card-body">
            <LayoutDashboard className="card-icon" />

            <h4>Your Study Workspace</h4>

            <p className="card-text">
              Keep every subject, document, flashcard, and quiz inside one clean
              workspace designed to help you stay focused from start to finish.
            </p>

            <div className="feature-pills">
              <span>Organized</span>
              <span>Focused</span>
              <span>Productive</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
