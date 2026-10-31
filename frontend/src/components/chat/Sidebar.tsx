import {
  Home,
  MessageSquare,
  Zap,
  Target,
  Settings,
  GraduationCap,
  FileText,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../config/api";
// @ts-expect-error - CSS imports are handled by the bundler
import "./Sidebar.css";

type Note = {
  id: number;
  user_id: number;
  filename: string;
  content: string;
  created_at: string;
};

function Sidebar() {
  const location = useLocation();

  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = useCallback(async () => {
    try {
      setLoadingNotes(true);

      const response = await fetch(`${API_URL}/notes`, {
        method: "GET",
        credentials: "include",
      });

      // User is not authenticated
      if (response.status === 401) {
        setUploadedNotes([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const notes: Note[] = await response.json();

      setUploadedNotes(Array.isArray(notes) ? notes : []);
    } catch (error) {
      console.error("Failed to load notes:", error);
      setUploadedNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, []);
  const handleDelete = async (noteId: number) => {
    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("User is not authenticated");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to delete note: ${response.status}`);
      }

      // Remove it immediately from the UI
      setUploadedNotes((notes) => notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  const confirmDelete = () => {
    if (isDeleteClicked) {
    }
  };
  // Load notes when Sidebar appears
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Reload notes whenever the user navigates
  useEffect(() => {
    loadNotes();
  }, [location.pathname, loadNotes]);

  return (
    <aside className="chat-sidebar">
      {/* =================================
          LOGO
      ================================= */}
      <div className="sidebar-logo">
        <GraduationCap size={32} />
        <h2>ACE</h2>
      </div>

      {/* =================================
          MAIN NAVIGATION
      ================================= */}
      <nav className="sidebar-nav">
        <Link
          to={ROUTES.HOME}
          className={
            location.pathname === "/" ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          to={ROUTES.CHAT}
          className={
            location.pathname === "/chat"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <MessageSquare size={20} />
          <span>Chat</span>
        </Link>

        <Link
          to={ROUTES.FLASHCARDS}
          className={
            location.pathname === "/flashcards"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Zap size={20} />
          <span>Flashcards</span>
        </Link>

        <Link
          to={ROUTES.QUIZ}
          className={
            location.pathname === "/quiz"
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Target size={20} />
          <span>Quiz</span>
        </Link>
      </nav>

      {/* =================================
          UPLOADED NOTES
      ================================= */}
      <div className="sidebar-notes">
        <div className="sidebar-section-title">
          <span>Your Notes</span>
        </div>

        {loadingNotes ? (
          <div className="no-notes">
            <FileText size={18} />
            <span>Loading notes...</span>
          </div>
        ) : uploadedNotes.length === 0 ? (
          <div className="no-notes">
            <FileText size={18} />
            <span>No notes uploaded</span>
          </div>
        ) : (
          <div className="notes-list">
            {uploadedNotes.map((note) => (
              <div className="sidebar-note" key={note.id}>
                <FileText size={16} />

                <div className="sidebar-note-info">
                  <span title={note.filename}>
                    {note.filename.split("/")[1]}
                  </span>
                </div>

                <button
                  className="delete-note-btn"
                  onClick={() => {
                    setSelectedNote(note);
                    setIsDeleteClicked(true);
                  }}
                  title="Delete note"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================
          BOTTOM SETTINGS
      ================================= */}
      <div className="sidebar-bottom">
        <button className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      {isDeleteClicked && selectedNote && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Delete note?</h2>

            <p>Are you sure you want to delete "{selectedNote.filename}"?</p>

            <div className="delete-modal-actions">
              <button
                onClick={() => {
                  setIsDeleteClicked(false);
                  setSelectedNote(null);
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDelete(selectedNote.id);
                  setIsDeleteClicked(false);
                  setSelectedNote(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
