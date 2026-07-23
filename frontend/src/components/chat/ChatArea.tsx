import { Brain, UploadCloud } from "lucide-react";

function ChatArea() {
  return (
    <section className="chat-area">
      <div className="chat-empty">
        <div className="empty-icon">
          <Brain size={44} />
        </div>

        <h2>Welcome to ACE</h2>

        <p>
          Upload your notes and start asking questions.
          <br />
          ACE will answer using your own study material.
        </p>

        <button className="empty-upload-btn">
          <UploadCloud size={18} />
          Upload Your First Document
        </button>
      </div>
    </section>
  );
}

export default ChatArea;
