import { Upload, FileText } from "lucide-react";
type ChatHeaderProps = {
  onUploadClick: () => void;
  isNotesUploaded: boolean;
};
// CHAT HEADER
function ChatHeader({ onUploadClick, isNotesUploaded }: ChatHeaderProps) {
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
      <button className="upload-btn" onClick={onUploadClick}>
        <Upload size={18} />
        Upload Notes
      </button>
    </header>
  );
}

export default ChatHeader;
