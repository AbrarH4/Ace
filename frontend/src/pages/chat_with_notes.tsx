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
  // Stores all messages in the conversation
  const [messages, setMessages] = useState<Message[]>([]);

  // Controls the "ACE is thinking..." loading animation
  const [isLoading, setIsLoading] = useState(false);

  // Controls whether notes have been successfully uploaded
  const [isNotesUploaded, setIsNotesUploaded] = useState(false);

  // =====================================================
  // ADD USER MESSAGE
  // =====================================================
  // This is called immediately when the user presses send.
  // The question appears in the chat before FastAPI responds.

  const addUserMessage = (userMessage: string) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);
  };

  // =====================================================
  // ADD ASSISTANT MESSAGE
  // =====================================================
  // This is called after FastAPI sends back ACE's answer.

  const addAssistantMessage = (assistantMessage: string) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "assistant",
        content: assistantMessage,
      },
    ]);
  };

  // =====================================================
  // OPEN FOLDER PICKER
  // =====================================================

  const handleUploadClick = () => {
    document.getElementById("file-input")?.click();
  };

  // =====================================================
  // HANDLE FOLDER UPLOAD
  // =====================================================
  const [uploadedNotes, setUploadedNotes] = useState<string[]>([]);
  const handleFolderChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files;
    const ShippingBox = new FormData();

    // Make sure files were selected
    if (fileList && fileList.length > 0) {
      // Go through every file selected from the folder
      const newUploadedNotes: string[] = [];

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

          newUploadedNotes.push(file.name);
        }
      }
      setUploadedNotes(newUploadedNotes);
      try {
        // Send the entire folder to FastAPI
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: ShippingBox,
        });

        // ============================================
        // SUCCESSFUL UPLOAD
        // ============================================

        if (response.ok) {
          console.log("FOLDER SENT TO BACKEND");

          // Update the UI
          // ChatHeader and ChatArea will re-render
          setIsNotesUploaded(true);
        } else {
          console.error("Upload failed:", response.status);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="chat-layout">
      {/* ============================================= */}
      {/* SIDEBAR                                       */}
      {/* ============================================= */}

      <Sidebar uploadedNotes={uploadedNotes} />

      {/* ============================================= */}
      {/* MAIN CHAT                                     */}
      {/* ============================================= */}

      <main className="chat-main">
        {/* =========================================== */}
        {/* HIDDEN FOLDER PICKER                       */}
        {/* =========================================== */}

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

        {/* =========================================== */}
        {/* CHAT HEADER                                 */}
        {/* =========================================== */}

        <ChatHeader
          onUploadClick={handleUploadClick}
          isNotesUploaded={isNotesUploaded}
        />

        {/* =========================================== */}
        {/* CHAT AREA                                   */}
        {/* =========================================== */}

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onUploadClick={handleUploadClick}
          isNotesUploaded={isNotesUploaded}
        />

        {/* =========================================== */}
        {/* CHAT INPUT                                  */}
        {/* =========================================== */}

        <ChatInput
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          addUserMessage={addUserMessage}
          addAssistantMessage={addAssistantMessage}
        />
      </main>
    </div>
  );
}

export default ChatWithNotes;
