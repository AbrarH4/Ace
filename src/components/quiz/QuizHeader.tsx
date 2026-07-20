import { FileText, BrainCircuit } from "lucide-react";

function QuizHeader() {
  return (
    <header className="flashcard-header">
      <div className="header-left">
        <h2>Quiz Generator</h2>

        <div className="current-file">
          <FileText size={16} />
          <span>No document selected</span>
        </div>
      </div>

      <button className="generate-btn">
        <BrainCircuit size={18} />
        Generate Quiz
      </button>
    </header>
  );
}

export default QuizHeader;
