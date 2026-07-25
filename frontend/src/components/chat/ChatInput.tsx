import { Paperclip, ArrowUp } from "lucide-react";

type ChatInputProps = {
  onMessage: (userMessage: string, assistantMessage: string) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

function ChatInput({ onMessage, setIsLoading, isLoading }: ChatInputProps) {
  const question = async () => {
    const questionValue = document.getElementById("Chat_question");

    if (questionValue && questionValue instanceof HTMLInputElement) {
      const text = questionValue.value.trim();

      if (!text) {
        return;
      }
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/question_input", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error:", errorData);
          return;
        }

        const data = await response.json();

        console.log("Server response:", data);

        onMessage(text, data.answer);

        questionValue.value = "";
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-box">
        <button className="input-icon">
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          id="Chat_question"
          placeholder="Ask anything about your notes..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              question();
            }
          }}
        />

        <button className="send-btn" onClick={question} disabled={isLoading}>
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
