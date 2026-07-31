import { Sparkles } from "lucide-react";
type FlashCardHeader = {
  handleGenerate: () => void;
};
type FlashcardHeaderProps = {
  onGenerate: () => void;
  isGenerating: boolean;
};

function FlashcardHeader({ onGenerate, isGenerating }: FlashcardHeaderProps) {
  return (
    <header className="flashcard-header">
      <div className="header-left">
        <h2>Flashcards</h2>

        <div className="current-file">
          <Sparkles size={16} />
          <span>Study smarter with ACE</span>
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        <Sparkles size={18} />
        {isGenerating ? "Generating..." : "Generate Flashcards"}
      </button>
    </header>
  );
}

export default FlashcardHeader;
