import { ChevronLeft, ChevronRight, RefreshCcw, Download } from "lucide-react";
type flashcardControlsProps = {
  onFlip: () => void;
};
function FlashcardControls({ onFlip }: flashcardControlsProps) {
  return (
    <section className="flashcard-controls">
      <div className="card-navigation">
        <button>
          <ChevronLeft size={18} />
          Previous
        </button>

        <span>Card 1 of 20</span>

        <button>
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
