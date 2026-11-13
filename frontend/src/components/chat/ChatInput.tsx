import { Paperclip, ArrowUp } from "lucide-react";
import { API_URL } from "../../config/api";

type ChatInputProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  conversationId: number | null;
  onConversationId: (id: number) => void;
  addUserMessage: (message: string) => void;
  addAssistantMessage: (message: string) => void;
};

function ChatInput({
  isLoading,
  setIsLoading,
  conversationId,
  onConversationId,
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

    // Don't allow another question while ACE is still answering
    if (isLoading) {
      return;
    }

    // 1. Show the user's question immediately
    addUserMessage(text);

    // 2. Clear the input immediately
    questionValue.value = "";

    // 3. Show the loading animation
    setIsLoading(true);

    try {
      // 4. Send the question, plus the id of the chat it belongs to
      //    (null for a brand-new chat, the server then creates one)
      const response = await fetch(`${API_URL}/question_input`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: text,
          conversation_id: conversationId,
        }),
      });

      // 5. If the server refused, show its reason inside the chat
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Server error:", errorData);

        addAssistantMessage(
          errorData && typeof errorData.detail === "string"
            ? errorData.detail
            : "Sorry, I couldn't process your question. Please try again.",
        );
        return;
      }

      // 6. Show ACE's answer
      const data = await response.json();
      addAssistantMessage(data.response);

      // 7. Remember which chat this is
      if (typeof data.conversation_id === "number") {
        onConversationId(data.conversation_id);
      }
    } catch (error) {
      console.error("Fetch failed:", error);

      addAssistantMessage(
        "Sorry, I couldn't process your question. Please try again.",
      );
    } finally {
      // 8. Remove the loading animation
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
