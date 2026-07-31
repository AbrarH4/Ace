import Sidebar from "../components/chat/Sidebar";
import FlashcardHeader from "../components/flashcards/FlashcardHeader";
import FlashcardViewer from "../components/flashcards/FlashcardViewer";
import FlashcardControls from "../components/flashcards/FlashcardControls";
import { useState } from "react";
import { Layers3, Sparkles } from "lucide-react";
type Flashcards = {
  question: string;
  answer: string;
};
function Flashcards() {
  const [flashcard, setFlashcard] = useState<Flashcards | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setFlashcard({
        question: "What is the main purpose of the uploaded notes?",
        answer: "To summarize key concepts for revision.",
      });
      setIsGenerating(false);
    }, 2000);
  };
  const handleFlip = () => {
    setIsFlipped((previous) => !previous);
  };

  return (
    <div className="chat-layout">
      <Sidebar uploadedNotes={[]} />

      <main className="chat-main">
        <FlashcardHeader
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />

        {flashcard === null ? (
          <div className="flashcard-empty">
            <div className="flashcard-empty-icon">
              <Layers3 size={46} />
            </div>

            <h2>Generate Smart Flashcards</h2>

            <p>
              ACE will scan your uploaded notes and create concise
              question-answer flashcards for quick revision.
            </p>

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
            <FlashcardViewer isFlipped={isFlipped} flashcard={flashcard} />
            <FlashcardControls onFlip={handleFlip} />
          </>
        )}
      </main>
    </div>
  );
}

export default Flashcards;
