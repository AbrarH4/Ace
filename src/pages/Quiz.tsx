import Sidebar from "../components/chat/Sidebar";
import QuizHeader from "../components/quiz/QuizHeader";
import QuizViewer from "../components/quiz/QuizViewer";
import QuizControls from "../components/quiz/QuizControls";

function Quiz() {
  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <QuizHeader />
        <QuizViewer />
        <QuizControls />
      </main>
    </div>
  );
}

export default Quiz;
