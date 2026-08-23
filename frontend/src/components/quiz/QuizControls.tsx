type QuizControlsProps = {
  currentIndex: number;
  totalQuestions: number;
  isSubmitted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
};

function QuizControls({
  currentIndex,
  totalQuestions,
  isSubmitted,
  onPrevious,
  onNext,
  onSubmit,
}: QuizControlsProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <section className="quiz-controls">
      <button
        type="button"
        className="quiz-nav-button secondary"
        onClick={onPrevious}
        disabled={isFirst}
      >
        <span>←</span>
        Previous
      </button>

      <div className="quiz-counter">
        <strong>{currentIndex + 1}</strong>
        <span>/</span>
        <span>{totalQuestions}</span>
      </div>

      {isLast && !isSubmitted ? (
        <button
          type="button"
          className="quiz-nav-button submit"
          onClick={onSubmit}
        >
          Submit Quiz
          <span>✓</span>
        </button>
      ) : (
        <button
          type="button"
          className="quiz-nav-button primary"
          onClick={onNext}
          disabled={isLast}
        >
          Next
          <span>→</span>
        </button>
      )}
    </section>
  );
}

export default QuizControls;
