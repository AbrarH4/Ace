import { FileText, Sparkles } from "lucide-react";

function FlashcardHeader() {
  return (
    <header className="flashcard-header">
      <div className="header-left">
        <h2>Flashcard Generator</h2>

        <div className="current-file">
          <FileText size={16} />
          <span>No document selected</span>
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
