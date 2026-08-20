import { Paperclip, ArrowUp } from "lucide-react";

type ChatInputProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addUserMessage: (message: string) => void;
  addAssistantMessage: (message: string) => void;
};

function ChatInput({
  isLoading,
  setIsLoading,
  addUserMessage,
  addAssistantMessage,
}: ChatInputProps) {
  const question = async () => {
    const questionValue = document.getElementById("Chat_question");

    // Make sure the input exists
    if (!questionValue || !(questionValue instanceof HTMLInputElement)) {
      return;
    }

    // Get the question
    const text = questionValue.value.trim();

    // Don't send empty questions
    if (!text) {
      return;
    }

    // Don't allow another question
    // while ACE is still answering
    if (isLoading) {
      return;
    }

    // ========================================
    // 1. SHOW USER QUESTION IMMEDIATELY
    // ========================================

    addUserMessage(text);

    // ========================================
    // 2. CLEAR INPUT IMMEDIATELY
    // ========================================

    questionValue.value = "";

    // ========================================
    // 3. SHOW LOADING ANIMATION
    // ========================================

    setIsLoading(true);

    try {
      // ========================================
      // 4. SEND QUESTION TO FASTAPI
      // ========================================

      const response = await fetch("http://localhost:8000/question_input", {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: text,
        }),
      });

      // ========================================
      // 5. CHECK FOR SERVER ERROR
      // ========================================

      if (!response.ok) {
        const errorData = await response.json();

        console.error("Server error:", errorData);

        throw new Error(`Server Error: ${response.status}`);
      }

      // ========================================
      // 6. GET ACE'S ANSWER
      // ========================================

      const data = await response.json();

      console.log("Server response:", data);

      // ========================================
      // 7. ADD ACE'S ANSWER TO CHAT
      // ========================================

      addAssistantMessage(data.response);
    } catch (error) {
      console.error("Fetch failed:", error);

      // Show error inside chat
      addAssistantMessage(
        "Sorry, I couldn't process your question. Please try again.",
      );
    } finally {
      // ========================================
      // 8. REMOVE LOADING ANIMATION
      // ========================================

      setIsLoading(false);
    }
  };

  // Allow Enter key to send question
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      question();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-box">
        {/* Attachment button */}
        <button className="input-icon" disabled={isLoading}>
          <Paperclip size={20} />
        </button>

        {/* Question input */}
        <input
          type="text"
          id="Chat_question"
          placeholder="Ask anything about your notes..."
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />

        {/* Send button */}
        <button className="send-btn" onClick={question} disabled={isLoading}>
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
