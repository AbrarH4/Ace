import { Layers3 } from "lucide-react";
type FlashCard = {
  question: string;
  answer: string;
};
type FlashCardsViewerProps = {
  flashcard: FlashCard;
  isFlipped: boolean;
};
function FlashcardViewer({ flashcard, isFlipped }: FlashCardsViewerProps) {
  return (
    <section className="flashcard-viewer">
      <div className="flashcard">
        <div className="flashcard-top">
          <Layers3 size={18} />

          <span>Question</span>
        </div>
        <div className="flashcard-content">
          {isFlipped ? flashcard.answer : flashcard.question}
        </div>
      </div>
    </section>
  );
}

export default FlashcardViewer;
