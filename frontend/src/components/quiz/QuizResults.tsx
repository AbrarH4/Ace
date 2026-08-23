type QuizResult = {
  correct: boolean;
  user_answer: string;
  correct_answer: string;
  explanation: string;
};

type QuizResultsProps = {
  results: QuizResult[];
  onNewQuiz: () => void;
  onReview: () => void;
};
function QuizResults({ results, onNewQuiz, onReview }: QuizResultsProps) {
  const score = results.filter((result) => result.correct).length;
  const total = results.length;

  return (
    <section className="quiz-results">
      <h1>Quiz Complete!</h1>

      <div className="quiz-score">
        {score} / {total}
      </div>

      <p>
        You got {score} out of {total} questions correct.
      </p>

      <button type="button" onClick={onNewQuiz}>
        Generate Another Quiz
      </button>

      <button type="button" onClick={onReview}>
        Review Answers
      </button>
    </section>
  );
}

export default QuizResults;
