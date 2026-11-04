import { ChevronLeft, ChevronRight, RefreshCcw, Download } from "lucide-react";
import { API_URL } from "../../config/api";
type flashcardControlsProps = {
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalCards: number;
  handleNew: () => void;
  flashcards: {
    front: string;
    back: string;
  }[];
};
function FlashcardControls({
  onFlip,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
  handleNew,
  flashcards,
}: flashcardControlsProps) {
  const isLast = currentIndex === totalCards - 1;
  const question = flashcards.map((card) => card.front);
  const answer = flashcards.map((card) => card.back);
  const handleExport = async () => {
    try {
      const response = await fetch(`${API_URL}/exportflashcard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question: question,
          answer: answer,
        }),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.blob();
      const w = window as any;

      if (w.showSaveFilePicker) {
        const fileHandle = await w.showSaveFilePicker({
          suggestedName: "ExportedFlashcards.txt",
        });
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
      } else {
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ExportedFlashcards.txt";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      // Cancelling the save dialog also lands here, which is fine
      console.error("Export failed:", error);
    }
  };
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
        {isLast ? (
          <button onClick={handleNew}>Back to Flashcard</button>
        ) : (
          <button onClick={onNext}>
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <div className="card-actions">
        <button onClick={onFlip}>
          <RefreshCcw size={18} />
          Flip Card
        </button>

        <button onClick={handleExport}>
          <Download size={18} />
          Export PDF
        </button>
      </div>
    </section>
  );
}
export default FlashcardControls;
