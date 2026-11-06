import Sidebar from "../components/chat/Sidebar";
import QuizHeader from "../components/quiz/QuizHeader";
import QuizViewer from "../components/quiz/QuizViewer";
import QuizControls from "../components/quiz/QuizControls";
import QuizResults from "../components/quiz/QuizResults";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BrainCircuit, History, Trash2 } from "lucide-react";
import { API_URL } from "../config/api";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type QuizResult = {
  correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation: string;
};

// A saved quiz in the list (no questions, just a summary)
type SavedQuiz = {
  id: number;
  title: string;
  question_count: number;
  created_at: string;
};

// One finished attempt of a quiz
type AttemptItem = {
  id: number;
  score: number;
  total: number;
  created_at: string;
};

// The server stores times in UTC without a label, so we add "Z" before parsing
const formatDate = (value: string) => {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Tells the sidebar "the list of quizzes changed, please reload it"
const announceQuizzesChanged = () => {
  window.dispatchEvent(new Event("quizzes-changed"));
};

function Quiz() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isNotesUploaded, setIsNotesUploaded] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [attemptsByQuiz, setAttemptsByQuiz] = useState<
    Record<number, AttemptItem[] | undefined>
  >({});
  const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The address holds what is open: ?quiz=3 (retake) or ?attempt=5 (review)
  const [searchParams, setSearchParams] = useSearchParams();
  const quizParam = searchParams.get("quiz");
  const attemptParam = searchParams.get("attempt");

  const hasQuiz = quiz.length > 0;

  // Check once, when the page opens, whether the user has any notes
  useEffect(() => {
    const checkNotes = async () => {
      try {
        const response = await fetch(`${API_URL}/notes`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const notes = await response.json();
        setIsNotesUploaded(notes.length > 0);
      } catch (err) {
        console.error("Failed to load notes:", err);
        setIsNotesUploaded(false);
      }
    };

    checkNotes();
  }, []);

  // The list of saved quizzes
  const loadQuizzes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        credentials: "include",
      });
      if (!response.ok) {
        setSavedQuizzes([]);
        return;
      }
      const data: SavedQuiz[] = await response.json();
      setSavedQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      setSavedQuizzes([]);
    }
  }, []);

  // The attempts of one quiz
  const loadAttempts = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/quizzes/${id}/attempts`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to load attempts");
      }
      const data: AttemptItem[] = await response.json();
      setAttemptsByQuiz((previous) => ({
        ...previous,
        [id]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error(err);
      setAttemptsByQuiz((previous) => ({ ...previous, [id]: [] }));
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  // "?quiz=3" in the address: fetch that saved quiz and start it fresh
  useEffect(() => {
    if (!quizParam) return;

    let ignore = false;

    const loadQuiz = async () => {
      setError(null);

      try {
        const response = await fetch(`${API_URL}/quizzes/${quizParam}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Could not open that quiz.");
        }

        const questions = await response.json();
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error("That quiz is empty.");
        }

        if (!ignore) {
          setQuiz(questions);
          setQuizId(Number(quizParam));
          setSelectedAnswers([]);
          setResults([]);
          setCurrentIndex(0);
          setIsReviewing(false);
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

    loadQuiz();

    return () => {
      ignore = true;
    };
  }, [quizParam]);

  // "?attempt=5" in the address: fetch the saved quiz and picks, grade them
  // again (without a quiz id, so nothing new is saved) and show the results
  useEffect(() => {
    if (!attemptParam) return;

    let ignore = false;

    const loadAttempt = async () => {
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/quiz-attempts/${attemptParam}`,
          { credentials: "include" },
        );
        if (!response.ok) {
          throw new Error("Could not open that attempt.");
        }
        const data = await response.json();

        const gradeResponse = await fetch(`${API_URL}/quiz/evaluation`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: data.quiz,
            selectedAnswers: data.selectedAnswers,
          }),
        });
        if (!gradeResponse.ok) {
          throw new Error("Could not load the review.");
        }
        const graded: QuizResult[] = await gradeResponse.json();

        if (!ignore) {
          setQuiz(data.quiz);
          setQuizId(data.quiz_id);
          setSelectedAnswers(data.selectedAnswers);
          setResults(graded);
          setCurrentIndex(0);
          setIsReviewing(false);
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

    loadAttempt();

    return () => {
      ignore = true;
    };
  }, [attemptParam]);

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers((previous) => {
      const updated = [...previous];
      updated[currentIndex] = answer;
      return updated;
    });
  };

  const handleNewQuiz = () => {
    setQuiz([]);
    setQuizId(null);
    setResults([]);
    setSelectedAnswers([]);
    setCurrentIndex(0);
    setIsReviewing(false);
    setSearchParams({});
  };

  const handleReview = () => {
    setCurrentIndex(0);
    setIsReviewing(true);
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setIsReviewing(false);

    try {
      const notesResponse = await fetch(`${API_URL}/notes`, {
        credentials: "include",
      });
      if (!notesResponse.ok) {
        throw new Error("Could not check your notes. Please try again.");
      }

      const notes = await notesResponse.json();
      if (notes.length === 0) {
        setError("Upload at least one note first, then generate a quiz.");
        return;
      }

      const quizResponse = await fetch(`${API_URL}/quiz`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          count: questionCount,
        }),
      });
      if (!quizResponse.ok) {
        throw new Error("Could not generate the quiz. Please try again.");
      }

      const generated = await quizResponse.json();
      if (!Array.isArray(generated.quiz) || generated.quiz.length === 0) {
        throw new Error("No questions came back. Try a different topic.");
      }

      setQuiz(generated.quiz);
      setQuizId(generated.quiz_id ?? null);
      setSelectedAnswers([]);
      setResults([]);
      setCurrentIndex(0);

      // This quiz is brand new, so the address should not name an old one
      setSearchParams({}, { replace: true });

      // The backend just saved it, so refresh the lists
      loadQuizzes();
      announceQuizzesChanged();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const quizEval = async () => {
    setError(null);

    try {
      // Questions the user skipped are sent as empty text, so the list
      // always has exactly one entry per question
      const answersToSend = quiz.map(
        (_, index) => selectedAnswers[index] ?? "",
      );

      const response = await fetch(`${API_URL}/quiz/evaluation`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz: quiz,
          selectedAnswers: answersToSend,
          quiz_id: quizId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to evaluate quiz");
      }

      const evaluationResults: QuizResult[] = await response.json();

      setSelectedAnswers(answersToSend);
      setResults(evaluationResults);
      setCurrentIndex(0);

      // The backend just saved an attempt, so refresh this quiz's attempts
      if (quizId !== null) {
        loadAttempts(quizId);
      }
    } catch (err) {
      console.error("Quiz evaluation failed:", err);
      setError("Could not submit your quiz. Please try again.");
    }
  };

  const toggleAttempts = (id: number) => {
    if (expandedQuizId === id) {
      setExpandedQuizId(null);
      return;
    }
    setExpandedQuizId(id);
    loadAttempts(id);
  };

  const deleteQuiz = async (id: number) => {
    if (!window.confirm("Delete this quiz and its attempts?")) return;
    setError(null);

    try {
      const response = await fetch(`${API_URL}/quizzes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Could not delete that quiz.");
      }

      setSavedQuizzes((previous) => previous.filter((item) => item.id !== id));
      if (expandedQuizId === id) {
        setExpandedQuizId(null);
      }
      announceQuizzesChanged();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const selectedAnswer = selectedAnswers[currentIndex] || "";

  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <QuizHeader
          hasQuiz={hasQuiz}
          Generating={isGenerating}
          handleGenerate={handleGenerate}
          isNotesUploaded={isNotesUploaded}
        />

        {error && (
          <div className="flashcard-error" role="alert">
            {error}
          </div>
        )}

        {quiz.length === 0 ? (
          <div className="quiz-empty">
            <h2>Generate a Quiz</h2>

            <p>Choose a topic and the number of questions you want.</p>

            <div className="quiz-settings">
              <div className="setting-group">
                <label htmlFor="topic">Topic</label>

                <input
                  id="topic"
                  type="text"
                  placeholder="e.g. Electric Charges"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                />
              </div>

              <div className="setting-group">
                <label htmlFor="question-count">Number of questions</label>

                <select
                  id="question-count"
                  value={questionCount}
                  onChange={(event) =>
                    setQuestionCount(Number(event.target.value))
                  }
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={15}>15 questions</option>
                  <option value={20}>20 questions</option>
                </select>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating Quiz..." : "Generate Quiz"}
              </button>
            </div>

            {savedQuizzes.length > 0 && (
              <section className="saved-sets">
                <h3>Your quizzes</h3>

                <ul className="saved-sets-list">
                  {savedQuizzes.map((item) => {
                    const attempts = attemptsByQuiz[item.id];

                    return (
                      <li key={item.id} className="saved-quiz">
                        <div className="saved-set">
                          <button
                            type="button"
                            className="saved-set-open"
                            onClick={() =>
                              setSearchParams({ quiz: String(item.id) })
                            }
                          >
                            <BrainCircuit size={18} />
                            <span className="saved-set-info">
                              <strong>{item.title}</strong>
                              <small>
                                {item.question_count} questions ·{" "}
                                {formatDate(item.created_at)}
                              </small>
                            </span>
                          </button>

                          <button
                            type="button"
                            className="saved-set-history"
                            onClick={() => toggleAttempts(item.id)}
                            aria-label={`Past attempts of ${item.title}`}
                            title="Past attempts"
                          >
                            <History size={16} />
                          </button>

                          <button
                            type="button"
                            className="saved-set-delete"
                            onClick={() => deleteQuiz(item.id)}
                            aria-label={`Delete ${item.title}`}
                            title="Delete quiz"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {expandedQuizId === item.id && (
                          <ul className="attempts-list">
                            {attempts === undefined ? (
                              <li className="attempts-empty">Loading...</li>
                            ) : attempts.length === 0 ? (
                              <li className="attempts-empty">
                                No attempts yet
                              </li>
                            ) : (
                              attempts.map((attempt) => (
                                <li key={attempt.id}>
                                  <button
                                    type="button"
                                    className="attempt-open"
                                    onClick={() =>
                                      setSearchParams({
                                        attempt: String(attempt.id),
                                      })
                                    }
                                  >
                                    <span className="attempt-score">
                                      {attempt.score} / {attempt.total}
                                    </span>
                                    <span className="attempt-date">
                                      {formatDate(attempt.created_at)}
                                    </span>
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        ) : results.length > 0 && !isReviewing ? (
          <QuizResults
            results={results}
            onNewQuiz={handleNewQuiz}
            onReview={handleReview}
          />
        ) : (
          <>
            <QuizViewer
              quiz={quiz[currentIndex]}
              result={results[currentIndex]}
              currentIndex={currentIndex}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              isSubmitted={isReviewing}
              totalQuestions={quiz.length}
              onBackToResults={() => setIsReviewing(false)}
            />

            <QuizControls
              currentIndex={currentIndex}
              totalQuestions={quiz.length}
              isSubmitted={isReviewing}
              onPrevious={() =>
                setCurrentIndex((previous) => Math.max(previous - 1, 0))
              }
              onNext={() =>
                setCurrentIndex((previous) =>
                  Math.min(previous + 1, quiz.length - 1),
                )
              }
              onSubmit={quizEval}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Quiz;
