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
  BrainCircuit,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

type QuizItem = {
  id: number;
  title: string;
  question_count: number;
  created_at: string;
};

type ChatItem = {
  id: number;
  title: string;
  updated_at: string;
};

// The server stores times in UTC without a label, so we add "Z" before parsing
const formatShortDate = (value: string) => {
  const date = new Date(value.endsWith("Z") ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [flashSets, setFlashSets] = useState<FlashcardSetItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [chats, setChats] = useState<ChatItem[]>([]);

  // Which page are we on? The history list changes with the page.
  const isChatPage = location.pathname === "/chat";
  const isQuizPage = location.pathname === "/quiz";

  // Which item is open right now? The pages keep it in the address
  const params = new URLSearchParams(location.search);
  const activeSetId =
    location.pathname === "/flashcards" ? params.get("set") : null;
  const activeQuizId = isQuizPage ? params.get("quiz") : null;
  const activeChatId = isChatPage ? params.get("conversation") : null;

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

  const loadQuizzes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setQuizzes([]);
        return;
      }

      const data: QuizItem[] = await response.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
      setQuizzes([]);
    }
  }, []);

  const loadChats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setChats([]);
        return;
      }

      const data: ChatItem[] = await response.json();
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load chats:", error);
      setChats([]);
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

  const deleteChat = async (chatId: number) => {
    if (!window.confirm("Delete this chat?")) return;

    try {
      const response = await fetch(`${API_URL}/conversations/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }

      setChats((previous) => previous.filter((chat) => chat.id !== chatId));

      // If the deleted chat was open, go back to a blank new chat
      if (String(chatId) === activeChatId) {
        navigate(ROUTES.CHAT);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Load the notes, plus only the list that is visible on this page
  useEffect(() => {
    loadNotes();

    if (isChatPage) {
      loadChats();
    } else if (isQuizPage) {
      loadQuizzes();
    } else {
      loadSets();
    }
  }, [
    location.pathname,
    isChatPage,
    isQuizPage,
    loadNotes,
    loadChats,
    loadQuizzes,
    loadSets,
  ]);

  // The pages announce "something changed" after generating, sending or
  // uploading. When we hear it, we reload that list.
  useEffect(() => {
    window.addEventListener("flashcard-sets-changed", loadSets);
    window.addEventListener("quizzes-changed", loadQuizzes);
    window.addEventListener("conversations-changed", loadChats);
    window.addEventListener("notes-changed", loadNotes);
    return () => {
      window.removeEventListener("flashcard-sets-changed", loadSets);
      window.removeEventListener("quizzes-changed", loadQuizzes);
      window.removeEventListener("conversations-changed", loadChats);
      window.removeEventListener("notes-changed", loadNotes);
    };
  }, [loadSets, loadQuizzes, loadChats, loadNotes]);

  // Close the mobile drawer after navigating (including switching items)
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
            HISTORY: chats on the chat page, quizzes on the quiz page,
            flashcard sets everywhere else
        ================================= */}
        {isChatPage
          ? chats.length > 0 && (
              <div className="sidebar-sets">
                <div className="sidebar-section-title">
                  <span>Recent chats</span>
                  <span className="sidebar-count">{chats.length}</span>
                </div>

                <div className="notes-list">
                  {chats.slice(0, 30).map((item) => (
                    <div key={item.id} className="sidebar-chat">
                      <Link
                        to={`${ROUTES.CHAT}?conversation=${item.id}`}
                        className={`sidebar-set ${
                          String(item.id) === activeChatId ? "active" : ""
                        }`}
                        title={item.title}
                      >
                        <span className="sidebar-set-icon">
                          <MessageSquare size={16} />
                        </span>
                        <span className="sidebar-set-text">
                          <strong>{item.title}</strong>
                          <small>{formatShortDate(item.updated_at)}</small>
                        </span>
                      </Link>

                      <button
                        type="button"
                        className="sidebar-chat-delete"
                        onClick={() => deleteChat(item.id)}
                        aria-label={`Delete chat ${item.title}`}
                        title="Delete chat"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          : isQuizPage
            ? quizzes.length > 0 && (
                <div className="sidebar-sets">
                  <div className="sidebar-section-title">
                    <span>Quizzes</span>
                    <span className="sidebar-count">{quizzes.length}</span>
                  </div>

                  <div className="notes-list">
                    {quizzes.slice(0, 15).map((item) => (
                      <Link
                        key={item.id}
                        to={`${ROUTES.QUIZ}?quiz=${item.id}`}
                        className={`sidebar-set ${
                          String(item.id) === activeQuizId ? "active" : ""
                        }`}
                        title={item.title}
                      >
                        <span className="sidebar-set-icon">
                          <BrainCircuit size={16} />
                        </span>
                        <span className="sidebar-set-text">
                          <strong>{item.title}</strong>
                          <small>{item.question_count} questions</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            : flashSets.length > 0 && (
                <div className="sidebar-sets">
                  <div className="sidebar-section-title">
                    <span>Flashcard sets</span>
                    <span className="sidebar-count">{flashSets.length}</span>
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
                        <span className="sidebar-set-icon">
                          <Layers3 size={16} />
                        </span>
                        <span className="sidebar-set-text">
                          <strong>{item.title}</strong>
                          <small>{item.card_count} cards</small>
                        </span>
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
