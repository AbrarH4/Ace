import { Paperclip, ArrowUp } from "lucide-react";

function ChatInput() {
  const question = async () => {
    const question_value = document.getElementById("Chat_question");
    if (question_value && question_value instanceof HTMLInputElement) {
      const text = question_value.value;
      try {
        const response = await fetch("http://localhost:8000/question_input", {
          // Replace with your actual endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text }), // Send as JSON object
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Server response:", data);
          console.log("SUCCESSFULLY SENT THE QUESTION");
          return data;
        } else {
          console.error("Error:", response.status);
        }
        if (!response.ok) {
          // 👇 Read the error details from the server
          const errorData = await response.json();
          console.error("Validation Error Details:", errorData);
          throw new Error(`Server Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    }
  };

  // Return a default value if element is missing

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
        />
        <button className="send-btn" onClick={question}>
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
