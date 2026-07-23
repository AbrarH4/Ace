import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatArea from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";

function ChatWithNotes() {
  return (
    <div className="chat-layout">
      <Sidebar />

      <main className="chat-main">
        <ChatHeader />
        <ChatArea />
        <ChatInput />
      </main>
    </div>
  );
}

export default ChatWithNotes;
