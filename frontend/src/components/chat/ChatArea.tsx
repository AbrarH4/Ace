import { useEffect, useRef } from "react";
import { Brain, UploadCloud } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatAreaProps = {
  messages: Message[];
  isLoading: boolean;
  onUploadClick: () => void;
  isNotesUploaded: boolean;
};

function ChatArea({
  messages,
  isLoading,
  onUploadClick,
  isNotesUploaded,
}: ChatAreaProps) {
  // This points to an invisible element at the bottom of the chat
  const bottomRef = useRef<HTMLDivElement>(null);

  // Whenever messages or loading state changes,
  // scroll to the bottom of the chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0) {
    return (
      <section className="chat-area">
        {!isNotesUploaded ? (
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

            <button className="empty-upload-btn" onClick={onUploadClick}>
              <UploadCloud size={18} />
              Upload Your First Document
            </button>
          </div>
        ) : (
          ""
        )}
      </section>
    );
  }

  // Chat state
  return (
    <section className="chat-area">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-row ${
              message.role === "user" ? "user-row" : "assistant-row"
            }`}
          >
            <div
              className={`message-bubble ${
                message.role === "user" ? "user-bubble" : "assistant-bubble"
              }`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message-row assistant-row">
            <div className="message-bubble assistant-bubble loading-bubble">
              <span>ACE is thinking</span>

              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}

        {/* Invisible element at the very bottom */}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

export default ChatArea;
