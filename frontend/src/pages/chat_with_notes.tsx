import { useState } from "react";

import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatArea from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

function ChatWithNotes() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Adds the user's question and ACE's answer to the chat
  const handleMessage = (userMessage: string, assistantMessage: string) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
      {
        role: "assistant",
        content: assistantMessage,
      },
    ]);
  };

  // Opens the folder picker
  const handleUploadClick = () => {
    document.getElementById("file-input")?.click();
  };

  // Handles the selected folder
  const handleFolderChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files;

    const ShippingBox = new FormData();

    if (fileList && fileList.length > 0) {
      for (const file of Array.from(fileList)) {
        const name = file.name.toLowerCase();

        if (
          name.endsWith(".txt") ||
          name.endsWith(".md") ||
          name.endsWith(".pdf") ||
          name.endsWith(".docx") ||
          name.endsWith(".pptx")
        ) {
          ShippingBox.append("file", file, file.webkitRelativePath);
        }
      }

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: ShippingBox,
        });

        if (response.ok) {
          console.log("FOLDER SENT TO BACKEND");
        } else {
          console.error("Upload failed:", response.status);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        {/* Hidden folder picker */}
        <input
          id="file-input"
          type="file"
          {...({
            webkitdirectory: "",
            directory: "",
          } as any)}
          multiple
          style={{ display: "none" }}
          onChange={handleFolderChange}
        />

        <ChatHeader onUploadClick={handleUploadClick} />

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onUploadClick={handleUploadClick}
        />

        <ChatInput
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onMessage={handleMessage}
        />
      </main>
    </div>
  );
}

export default ChatWithNotes;
