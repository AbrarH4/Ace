import Sidebar from "../components/chat/Sidebar";
import QuizHeader from "../components/quiz/QuizHeader";
import QuizViewer from "../components/quiz/QuizViewer";
import QuizControls from "../components/quiz/QuizControls";
import { useState } from "react";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [uploadedNotes, setUploadedNotes] = useState<string[]>([]);
  const [hasNotes, setHasNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  type QuizQuestion = {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };

  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
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
      const quizResponse = await fetch("http://localhost:8000/quiz", {
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

      const quiz = await quizResponse.json();
    }
  };
  return (
    <div className="chat-layout">
      <Sidebar uploadedNotes={[]} />

      <main className="chat-main">
        <QuizHeader />
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
        ) : (
          <>
            <QuizViewer />
            <QuizControls />
          </>
        )}
      </main>
    </div>
  );
}

export default Quiz;
