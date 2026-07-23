import { Layers3 } from "lucide-react";

function FlashcardViewer() {
  return (
    <section className="flashcard-viewer">
      <div className="flashcard">
        <div className="flashcard-top">
          <Layers3 size={18} />

          <span>Question</span>
        </div>

        <div className="flashcard-content">
          <h2>What is Binary Search?</h2>

          <p>Click Flip Card to reveal the answer.</p>
        </div>
      </div>
    </section>
  );
}

export default FlashcardViewer;
