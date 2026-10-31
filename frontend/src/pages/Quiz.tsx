import Sidebar from "../components/chat/Sidebar";
import QuizHeader from "../components/quiz/QuizHeader";
import QuizViewer from "../components/quiz/QuizViewer";
import QuizControls from "../components/quiz/QuizControls";
import { useState } from "react";
import QuizResults from "../components/quiz/QuizResults";
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
function Quiz() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);

  const [_, setHasNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [__, setIsSubmitted] = useState(false);
  const score = results.filter((result) => result.correct).length;
  const [isReviewing, setIsReviewing] = useState(false);
  const hasQuiz = quiz.length > 0;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers((previous) => {
      const updated = [...previous];
      updated[currentIndex] = answer;
      return updated;
    });
  };
  const handleNewQuiz = () => {
    setQuiz([]);
    setResults([]);
    setSelectedAnswers([]);
    setCurrentIndex(0);
    setIsReviewing(false);
  };
  const handleReview = () => {
    console.log("REVIEW CLICKED!");
    setCurrentIndex(0);
    setIsReviewing(true);
  };
  const handleGenerate = async () => {
    const response = await fetch(`${API_URL}/notes`, {
      credentials: "include",
    });

    const notes = await response.json();
    if (notes.length === 0) {
      setHasNotes(false);
      setIsGenerating(false);
      setIsReviewing(false);
    } else {
      setHasNotes(true);
      setIsGenerating(true);
      setIsReviewing(false);
      try {
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
        const generatedQuiz = await quizResponse.json();
        setQuiz(generatedQuiz);
      } finally {
        setIsGenerating(false);
      }
    }
  };
  const selectedAnswer = selectedAnswers[currentIndex] || "";
  const quizEval = async () => {
    try {
      const quizEvaluation = await fetch(`${API_URL}/quiz/evaluation`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz: quiz,
          selectedAnswers: selectedAnswers,
        }),
      });

      if (!quizEvaluation.ok) {
        throw new Error("Failed to evaluate quiz");
      }

      const evaluationResults = await quizEvaluation.json();

      setResults(evaluationResults);
      setIsSubmitted(true);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Quiz evaluation failed:", error);
    }
  };
  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <QuizHeader
          hasQuiz={hasQuiz}
          Generating={isGenerating}
          handleGenerate={handleGenerate}
        />
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
