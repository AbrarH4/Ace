import { Paperclip, ArrowUp } from "lucide-react";

function ChatInput() {
  return (
    <div className="chat-input-container">
      <div className="chat-input-box">
        <button className="input-icon">
          <Paperclip size={20} />
        </button>

        <input type="text" placeholder="Ask anything about your notes..." />

        <button className="send-btn">
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
