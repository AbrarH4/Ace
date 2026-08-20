import Sidebar from "../components/chat/Sidebar";
import FlashcardHeader from "../components/flashcards/FlashcardHeader";
import FlashcardViewer from "../components/flashcards/FlashcardViewer";
import FlashcardControls from "../components/flashcards/FlashcardControls";
import { useState } from "react";
import { Layers3, Sparkles } from "lucide-react";

type Flashcards = {
  front: string;
  back: string;
};
function Flashcards() {
  const [flashcard, setFlashcard] = useState<Flashcards[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setIndex] = useState<number>(0);
  const [uploadedNotes, setUploadedNotes] = useState<string[]>([]);
  const [hasNotes, setHasNotes] = useState(false);
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const handleGenerate = async () => {
    const response = await fetch("http://localhost:8000/notes", {
      credentials: "include",
    });
    const notes = await response.json();
    if (notes.length === 0) {
      setHasNotes(false);
      setIsGenerating(false);
    } else {
      setHasNotes(true);
      setIsGenerating(true);
      const flashcard_Response = await fetch(
        "http://localhost:8000/flashcards",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
            count: cardCount,
          }),
        },
      );
      const cards = await flashcard_Response.json();
      setFlashcard(cards);
    }
  };
  const handleFlip = () => {
    setIsFlipped((previous) => !previous);
  };
  const currentFlashcard = flashcard[currentIndex];
  const handleNext = () => {
    setIsFlipped(false);
    setIndex((previous) => {
      if (previous < flashcard.length - 1) {
        return previous + 1;
      }
      return 0;
    });
  };
  const handlePrevious = () => {
    setIsFlipped(false);
    setIndex((previous) => {
      if (previous > 0) {
        return previous - 1;
      }

      return previous;
    });
  };
  return (
    <div className="chat-layout">
      <Sidebar uploadedNotes={uploadedNotes} />

      <main className="chat-main">
        <FlashcardHeader
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />

        {flashcard.length === 0 ? (
          <div className="flashcard-empty">
            <div className="flashcard-empty-icon">
              <Layers3 size={46} />
            </div>

            <h2>Generate Smart Flashcards</h2>

            <p>
              ACE will scan your uploaded notes and create concise
              question-answer flashcards for quick revision.
            </p>

            <div className="generation-settings">
              <div className="setting-group">
                <label htmlFor="topic">Topic</label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g. Newton's Laws"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                />
              </div>

              <div className="setting-group">
                <label htmlFor="card-count">Number of cards</label>
                <select
                  id="card-count"
                  value={cardCount}
                  onChange={(event) => setCardCount(Number(event.target.value))}
                >
                  <option value={5}>5 cards</option>
                  <option value={10}>10 cards</option>
                  <option value={15}>15 cards</option>
                  <option value={20}>20 cards</option>
                </select>
              </div>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Sparkles size={18} />

              {isGenerating
                ? "Generating Flashcards..."
                : "Generate Flashcards"}
            </button>
          </div>
        ) : (
          <>
            <FlashcardViewer
              isFlipped={isFlipped}
              flashcard={currentFlashcard}
            />
            <FlashcardControls
              onFlip={handleFlip}
              onNext={handleNext}
              onPrevious={handlePrevious}
              currentIndex={currentIndex}
              totalCards={flashcard.length}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Flashcards;
