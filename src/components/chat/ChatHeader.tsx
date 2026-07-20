import { Upload, FileText } from "lucide-react";

function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="header-left">
        <h2>Chat with Notes</h2>

        <div className="current-file">
          <FileText size={16} />
          <span>No document uploaded</span>
        </div>
      </div>

      <button className="upload-btn">
        <Upload size={18} />
        Upload Notes
      </button>
    </header>
  );
}

export default ChatHeader;
