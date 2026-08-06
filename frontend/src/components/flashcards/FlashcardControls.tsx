import { ChevronLeft, ChevronRight, RefreshCcw, Download } from "lucide-react";
type flashcardControlsProps = {
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
};
function FlashcardControls({
  onFlip,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
}: flashcardControlsProps) {
  return (
    <section className="flashcard-controls">
      <div className="card-navigation">
        <button onClick={onPrevious}>
          <ChevronLeft size={18} />
          Previous
        </button>

        <span>
          Card {currentIndex + 1} of {totalCards}
        </span>

        <button onClick={onNext}>
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="card-actions">
        <button onClick={onFlip}>
          <RefreshCcw size={18} />
          Flip Card
        </button>

        <button>
          <Download size={18} />
          Export PDF
        </button>
      </div>
    </section>
  );
}

export default FlashcardControls;
