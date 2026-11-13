import { Upload, FileText, Plus } from "lucide-react";

type ChatHeaderProps = {
  onUploadClick: () => void;
  onNewChat: () => void;
  isNotesUploaded: boolean;
  isLoading: boolean;
};

// CHAT HEADER
function ChatHeader({
  onUploadClick,
  onNewChat,
  isNotesUploaded,
  isLoading,
}: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <h2>Chat with Notes</h2>
        <div className="current-file">
          <FileText size={16} />
          {isNotesUploaded ? (
            <span>DOCUMENT UPLOADED</span>
          ) : (
            <span>NO DOCUMENT UPLOADED</span>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button
          className="new-chat-btn"
          onClick={onNewChat}
          disabled={isLoading}
          title="New chat"
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>

        <button className="upload-btn" onClick={onUploadClick}>
          <Upload size={18} />
          Upload Notes
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
