import { FileText, BrainCircuit } from "lucide-react";
type QuizHeaderProps = {
  hasQuiz: boolean;
  Generating: boolean;
  handleGenerate: () => void;
};
function QuizHeader({ hasQuiz, Generating, handleGenerate }: QuizHeaderProps) {
  return (
    <header className="flashcard-header">
      <div className="header-left">
        <h2>Quiz Generator</h2>

        <div className="current-file">
          <FileText size={16} />
          <span>No document selected</span>
        </div>
      </div>

      <button
        className="generate-btn"
        disabled={hasQuiz || Generating}
        onClick={handleGenerate}
      >
        <BrainCircuit size={18} />
        {Generating ? "Generating...." : "Generate Quiz"}
      </button>
    </header>
  );
}

export default QuizHeader;
