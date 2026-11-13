import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatArea from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";
import { API_URL } from "../config/api";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

type SavedMessage = {
  role: "user" | "assistant";
  content: string;
};

function ChatWithNotes() {
  // Stores all messages of the chat that is on screen
  const [messages, setMessages] = useState<Message[]>([]);

  // Controls the "ACE is thinking..." loading animation
  const [isLoading, setIsLoading] = useState(false);

  // Controls whether notes have been successfully uploaded
  const [isNotesUploaded, setIsNotesUploaded] = useState(false);

  // The id of the chat on screen. null means a brand-new chat that
  // the server has not saved yet.
  const [conversationId, setConversationId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // The address holds the open chat, like /chat?conversation=12
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationParam = searchParams.get("conversation");

  // A sticky note that remembers which chat is on screen. Unlike state,
  // changing it does not redraw the page.
  const shownConversation = useRef<number | null>(null);

  // Check once, when the page opens, whether the user has any notes
  useEffect(() => {
    const checkNotes = async () => {
      try {
        const notesResponse = await fetch(`${API_URL}/notes`, {
          credentials: "include",
        });

        if (!notesResponse.ok) {
          throw new Error("Failed to fetch notes");
        }

        const notes = await notesResponse.json();
        setIsNotesUploaded(notes.length > 0);
      } catch (err) {
        console.error("Failed to load notes:", err);
        setIsNotesUploaded(false);
      }
    };

    checkNotes();
  }, []);

  // React to the address: "?conversation=12" means open chat 12,
  // and no "conversation" means a new chat.
  useEffect(() => {
    if (!conversationParam) {
      // We were showing a saved chat and the address lost it: clear the screen
      if (shownConversation.current !== null) {
        shownConversation.current = null;
        setConversationId(null);
        setMessages([]);
      }
      return;
    }

    const id = Number(conversationParam);

    // This chat is already on screen (we just created it ourselves)
    if (shownConversation.current === id) return;

    let ignore = false;

    const loadConversation = async () => {
      setError(null);

      try {
        const response = await fetch(`${API_URL}/conversations/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Could not open that chat.");
        }

        const data = await response.json();

        if (!ignore) {
          shownConversation.current = id;
          setConversationId(id);
          setMessages(
            Array.isArray(data.messages)
              ? data.messages.map((item: SavedMessage) => ({
                  role: item.role,
                  content: item.content,
                }))
              : [],
          );
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      }
    };

    loadConversation();

    return () => {
      ignore = true;
    };
  }, [conversationParam]);

  // =====================================================
  // ADD MESSAGES TO THE SCREEN
  // =====================================================

  const addUserMessage = (userMessage: string) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userMessage,
      },
    ]);
  };

  const addAssistantMessage = (assistantMessage: string) => {
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "assistant",
        content: assistantMessage,
      },
    ]);
  };

  // The server tells us which chat the question belongs to
  const handleConversationId = (id: number) => {
    shownConversation.current = id; // set first, so the address effect skips reloading
    setConversationId(id);
    setSearchParams({ conversation: String(id) }, { replace: true });

    // Tell the sidebar to reload its list of chats
    window.dispatchEvent(new Event("conversations-changed"));
  };

  const handleNewChat = () => {
    shownConversation.current = null;
    setConversationId(null);
    setMessages([]);
    setError(null);
    setSearchParams({});
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
  const [_, setUploadedNotes] = useState<string[]>([]);
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
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: ShippingBox,
          credentials: "include",
        });

        if (response.ok) {
          setIsNotesUploaded(true);

          // Tell the sidebar to reload its list of notes
          window.dispatchEvent(new Event("notes-changed"));
        } else {
          console.error("Upload failed:", response.status);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

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

        <ChatHeader
          onUploadClick={handleUploadClick}
          onNewChat={handleNewChat}
          isNotesUploaded={isNotesUploaded}
          isLoading={isLoading}
        />

        {error && (
          <div className="flashcard-error" role="alert">
            {error}
          </div>
        )}

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onUploadClick={handleUploadClick}
          isNotesUploaded={isNotesUploaded}
        />

        <ChatInput
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          conversationId={conversationId}
          onConversationId={handleConversationId}
          addUserMessage={addUserMessage}
          addAssistantMessage={addAssistantMessage}
        />
      </main>
    </div>
  );
}

export default ChatWithNotes;
