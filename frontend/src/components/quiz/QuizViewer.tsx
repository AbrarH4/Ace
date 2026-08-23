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

type QuizViewerProps = {
  quiz: QuizQuestion;
  result?: QuizResult;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  isSubmitted: boolean;
  onBackToResults?: () => void;
};

function QuizViewer({
  quiz,
  result,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
  onBackToResults,
}: QuizViewerProps) {
  if (!quiz) {
    return null;
  }

  return (
    <section className="quiz-viewer">
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-top">
          <div className="quiz-question-number">
            Question {currentIndex + 1}
            <span>of {totalQuestions}</span>
          </div>

          <div className="quiz-progress">
            <div
              className="quiz-progress-fill"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="quiz-question">{quiz.question}</h1>

        <p className="quiz-instruction">
          {isSubmitted
            ? "Review your answer below."
            : "Select the answer you think is correct."}
        </p>

        {/* Options */}
        <div className="quiz-options">
          {quiz.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);

            const isSelected = selectedAnswer === option;

            const isCorrect =
              isSubmitted &&
              !!result &&
              option.startsWith(result.correct_answer);

            const isWrong =
              isSubmitted && !!result && isSelected && !result.correct;

            let stateClass = "";

            if (isCorrect) {
              stateClass = "correct";
            } else if (isWrong) {
              stateClass = "wrong";
            } else if (isSelected) {
              stateClass = "selected";
            }

            return (
              <button
                key={index}
                type="button"
                className={`quiz-option ${stateClass}`}
                onClick={() => {
                  if (!isSubmitted) {
                    onSelectAnswer(option);
                  }
                }}
                disabled={isSubmitted}
              >
                <span className="quiz-option-letter">{letter}</span>

                <span className="quiz-option-text">{option}</span>

                {isSubmitted && isCorrect && (
                  <span className="quiz-option-status">✓</span>
                )}

                {isSubmitted && isWrong && (
                  <span className="quiz-option-status">✕</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Evaluation */}
        {isSubmitted && result && (
          <div
            className={`quiz-feedback ${
              result.correct ? "feedback-correct" : "feedback-wrong"
            }`}
          >
            <div className="feedback-header">
              <div className="feedback-icon">{result.correct ? "✓" : "!"}</div>

              <div>
                <h3>{result.correct ? "Correct answer" : "Not quite"}</h3>

                {!result.correct && (
                  <p>
                    Correct answer: <strong>{result.correct_answer}</strong>
                  </p>
                )}
              </div>
            </div>
            {isSubmitted && onBackToResults && (
              <button className="quiz-back-results" onClick={onBackToResults}>
                ← Back to Results
              </button>
            )}

            <div className="feedback-explanation">
              <span>Explanation</span>
              <p>{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default QuizViewer;
