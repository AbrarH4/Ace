import { Upload, FileText } from "lucide-react";

function ChatHeader() {
  const input = () => {
    // console.log("Upload button clicked");
    document.getElementById("file-input")?.click();
  };

  const handlefolderchange = async (
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
          console.log(ShippingBox);
        }
      }
      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "Post",
          body: ShippingBox,
        });
        if (response.ok) {
          console.log("FOLDER SENT TO BACKEND");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <header className="chat-header">
      <input
        id="file-input"
        type="file"
        {...({ webkitdirectory: "", directory: "" } as any)}
        multiple
        style={{ display: "none" }}
        onChange={handlefolderchange}
      />
      <div className="header-left">
        <h2>Chat with Notes</h2>
        <div className="current-file">
          <FileText size={16} />
          <span>No document uploaded</span>
        </div>
      </div>
      <button className="upload-btn" onClick={input}>
        <Upload size={18} />
        Upload Notes
      </button>
    </header>
  );
}

export default ChatHeader;
