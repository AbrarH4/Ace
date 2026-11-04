import Sidebar from "../components/chat/Sidebar";
import FlashcardHeader from "../components/flashcards/FlashcardHeader";
import FlashcardViewer from "../components/flashcards/FlashcardViewer";
import FlashcardControls from "../components/flashcards/FlashcardControls";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layers3, Sparkles, Trash2 } from "lucide-react";
import { API_URL } from "../config/api";

type FlashCard = {
  front: string;
  back: string;
};

// What the list endpoint returns for each saved set (no cards, just a summary)
type SavedSet = {
  id: number;
  title: string;
  card_count: number;
  created_at: string;
};

// The server stores times in UTC without a timezone label,
// so we add "Z" (meaning UTC) before turning it into a date.
const formatDate = (value: string) => {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Tells the sidebar "the list of sets changed, please reload it"
const announceSetsChanged = () => {
  window.dispatchEvent(new Event("flashcard-sets-changed"));
};

function Flashcards() {
  const [flashcard, setFlashcard] = useState<FlashCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setIndex] = useState<number>(0);
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
  const [error, setError] = useState<string | null>(null);

  // The address holds the open set, like /flashcards?set=3
  const [searchParams, setSearchParams] = useSearchParams();
  const setParam = searchParams.get("set");

  // Fetch the list of saved sets from the backend
  const loadSets = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/flashcards-set`, {
        credentials: "include",
      });

      if (!response.ok) {
        setSavedSets([]);
        return;
      }

      const data: SavedSet[] = await response.json();
      setSavedSets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load saved sets:", err);
      setSavedSets([]);
    }
  }, []);

  // Load the list once, when the page first appears
  useEffect(() => {
    loadSets();
  }, [loadSets]);

  // Whenever the address says "?set=<id>", fetch that set and show it.
  // This is the only place a saved set gets opened, whether the click came
  // from the sidebar or from the list on this page.
  useEffect(() => {
    if (!setParam) return;

    let ignore = false;

    const loadSet = async () => {
      setError(null);

      try {
        const response = await fetch(`${API_URL}/flashcards-set/${setParam}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Could not open that set.");
        }

        const cards = await response.json();
        if (!Array.isArray(cards) || cards.length === 0) {
          throw new Error("That set is empty.");
        }

        // "ignore" is true if the user already clicked another set
        if (!ignore) {
          setFlashcard(cards);
          setIndex(0);
          setIsFlipped(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      }
    };

    loadSet();

    return () => {
      ignore = true;
    };
  }, [setParam]);

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      const notesResponse = await fetch(`${API_URL}/notes`, {
        credentials: "include",
      });
      if (!notesResponse.ok) {
        throw new Error("Could not check your notes. Please try again.");
      }

      const notes = await notesResponse.json();
      if (notes.length === 0) {
        setError("Upload at least one note first, then generate flashcards.");
        return;
      }

      const flashcardResponse = await fetch(`${API_URL}/flashcards`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          count: cardCount,
        }),
      });
      if (!flashcardResponse.ok) {
        throw new Error("Could not generate flashcards. Please try again.");
      }

      const cards = await flashcardResponse.json();
      if (!Array.isArray(cards) || cards.length === 0) {
        throw new Error("No flashcards came back. Try a different topic.");
      }

      setFlashcard(cards);
      setIndex(0);
      setIsFlipped(false);

      // These cards are brand new, so the address should no longer name an old set
      setSearchParams({}, { replace: true });

      // The backend just saved this set, so refresh both lists
      loadSets();
      announceSetsChanged();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteSet = async (setId: number) => {
    if (!window.confirm("Delete this flashcard set?")) return;
    setError(null);

    try {
      const response = await fetch(`${API_URL}/flashcards-set/${setId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Could not delete that set.");
      }

      // The server confirmed, so remove it from the list on screen
      setSavedSets((previous) => previous.filter((item) => item.id !== setId));
      announceSetsChanged();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleFlip = () => {
    setIsFlipped((previous) => !previous);
  };

  const handleBack = () => {
    setFlashcard([]);
    setIndex(0);
    setIsFlipped(false);
    setIsGenerating(false);
    setSearchParams({});
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
      <Sidebar />

      <main className="chat-main">
        <FlashcardHeader
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />

        {error && (
          <div className="flashcard-error" role="alert">
            {error}
          </div>
        )}

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

            {savedSets.length > 0 && (
              <section className="saved-sets">
                <h3>Your sets</h3>

                <ul className="saved-sets-list">
                  {savedSets.map((item) => (
                    <li key={item.id} className="saved-set">
                      <button
                        type="button"
                        className="saved-set-open"
                        onClick={() =>
                          setSearchParams({ set: String(item.id) })
                        }
                      >
                        <Layers3 size={18} />
                        <span className="saved-set-info">
                          <strong>{item.title}</strong>
                          <small>
                            {item.card_count}{" "}
                            {item.card_count === 1 ? "card" : "cards"} ·{" "}
                            {formatDate(item.created_at)}
                          </small>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="saved-set-delete"
                        onClick={() => deleteSet(item.id)}
                        aria-label={`Delete ${item.title}`}
                        title="Delete set"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
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
              handleNew={handleBack}
              flashcards={flashcard}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Flashcards;
