import Sidebar from "../components/chat/Sidebar";
import FlashcardHeader from "../components/flashcards/FlashcardHeader";
import FlashcardViewer from "../components/flashcards/FlashcardViewer";
import FlashcardControls from "../components/flashcards/FlashcardControls";

function Flashcards() {
  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <FlashcardHeader />

        <FlashcardViewer />

        <FlashcardControls />
      </main>
    </div>
  );
}

export default Flashcards;
