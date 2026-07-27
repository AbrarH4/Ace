import { Sparkles } from "lucide-react";

function FlashcardHeader() {
  return (
    <header className="flashcard-header">
      <div className="header-left">
        <h2>Flashcards</h2>

        <div className="current-file">
          <Sparkles size={16} />
          <span>Study smarter with ACE</span>
        </div>
      </div>

      <button className="generate-btn">
        <Sparkles size={18} />
        Generate Flashcards
      </button>
    </header>
  );
}

export default FlashcardHeader;
