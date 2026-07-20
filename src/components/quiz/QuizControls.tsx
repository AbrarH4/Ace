import { ChevronLeft, ChevronRight } from "lucide-react";

function QuizControls() {
  return (
    <section className="flashcard-controls">
      <div className="card-navigation">
        <button>
          <ChevronLeft size={18} />
          Previous
        </button>

        <span>Score: 0 / 10</span>

        <button>
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}

export default QuizControls;
