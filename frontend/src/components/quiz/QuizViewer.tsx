function QuizViewer() {
  return (
    <section className="quiz-viewer">
      <div className="quiz-card">
        <span className="question-number">Question 1 / 10</span>

        <h2>What is the time complexity of Binary Search?</h2>

        <div className="quiz-options">
          <button className="quiz-option">O(n²)</button>

          <button className="quiz-option active">O(log n)</button>

          <button className="quiz-option">O(n)</button>

          <button className="quiz-option">O(1)</button>
        </div>
      </div>
    </section>
  );
}

export default QuizViewer;
