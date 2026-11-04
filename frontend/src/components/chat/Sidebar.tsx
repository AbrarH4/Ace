import {
  Home,
  MessageSquare,
  Zap,
  Target,
  Settings,
  GraduationCap,
  FileText,
  Trash2,
  Layers3,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/ROUTES";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import "./Sidebar.css";

type Note = {
  id: number;
  user_id: number;
  filename: string;
  content: string;
  created_at: string;
};

type FlashcardSetItem = {
  id: number;
  title: string;
  card_count: number;
  created_at: string;
};

function Sidebar() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [flashSets, setFlashSets] = useState<FlashcardSetItem[]>([]);

  // Which set is open right now? The Flashcards page keeps it in the address (?set=3)
  const activeSetId =
    location.pathname === "/flashcards"
      ? new URLSearchParams(location.search).get("set")
      : null;

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

  const loadSets = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/flashcards-set`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setFlashSets([]);
        return;
      }

      const data: FlashcardSetItem[] = await response.json();
      setFlashSets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load flashcard sets:", error);
      setFlashSets([]);
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

  // Load notes and sets when the sidebar appears and whenever the user changes page
  useEffect(() => {
    loadNotes();
    loadSets();
  }, [location.pathname, loadNotes, loadSets]);

  // The Flashcards page announces "the list of sets changed" (after generating
  // or deleting). When we hear it, we reload the list.
  useEffect(() => {
    window.addEventListener("flashcard-sets-changed", loadSets);
    return () => {
      window.removeEventListener("flashcard-sets-changed", loadSets);
    };
  }, [loadSets]);

  // Close the mobile drawer after navigating (including switching sets)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      {/* Hamburger button (phones only) */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Dimmed backdrop behind the open drawer (phones only) */}
      {open && (
        <div className="sidebar-backdrop" onClick={() => setOpen(false)} />
      )}

      <aside className={`chat-sidebar ${open ? "open" : ""}`}>
        <button
          type="button"
          className="sidebar-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

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
            FLASHCARD SETS
        ================================= */}
        {flashSets.length > 0 &&
          location.pathname !== ROUTES.CHAT &&
          location.pathname !== ROUTES.QUIZ && (
            <div className="sidebar-sets">
              <div className="sidebar-section-title">
                <span>Flashcard sets</span>
              </div>

              <div className="notes-list">
                {flashSets.slice(0, 15).map((item) => (
                  <Link
                    key={item.id}
                    to={`${ROUTES.FLASHCARDS}?set=${item.id}`}
                    className={`sidebar-set ${
                      String(item.id) === activeSetId ? "active" : ""
                    }`}
                    title={item.title}
                  >
                    <Layers3 size={16} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

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
                      {note.filename.split("/").pop()}
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
      </aside>

      {/* Modal lives OUTSIDE the <aside>, so the drawer's slide animation
          can't trap it inside the drawer */}
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
    </>
  );
}

export default Sidebar;
